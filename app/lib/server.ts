import { MikroORM, RequestContext } from "@mikro-orm/core"
import { createRequestHandler } from "@remix-run/express"
import express from "express"
import morgan from "morgan"
import path from "path"
const { MIKRO_ORM_FILE,NODE_ENV } = process.env;
if (!MIKRO_ORM_FILE) {
	throw new Error("MIKRO_ORM_FILE not set")
}
const mikroORMmod = require(MIKRO_ORM_FILE);
const [mikroORMOptions] = [mikroORMmod.default, mikroORMmod].filter(Boolean);


const app = express()
let orm: any = null;
MikroORM.init(mikroORMOptions).then(o => orm = o);
app.use(async (req, res, next: any) => {
	RequestContext.create(orm.em, next);

});
app.use((req, res, next) => {
	// helpful headers:
	res.set("x-fly-region", process.env.FLY_REGION ?? "unknown")
	res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`)

	// /clean-urls/ -> /clean-urls
	if (req.path.endsWith("/") && req.path.length > 1) {
		const query = req.url.slice(req.path.length)
		const safepath = req.path.slice(0, -1).replace(/\/+/g, "/")
		res.redirect(301, safepath + query)
		return
	}
	if (next instanceof Function) {
		next()
	}
})

// if we're not in the primary region, then we need to make sure all
// non-GET/HEAD/OPTIONS requests hit the primary region rather than read-only
// Postgres DBs.
// learn more: https://fly.io/docs/getting-started/multi-region-databases/#replay-the-request
app.all("*", function getReplayResponse(req, res, next) {
	const { method, path: pathname } = req
	const { PRIMARY_REGION, FLY_REGION } = process.env

	const isMethodReplayable = !["GET", "OPTIONS", "HEAD"].includes(method)
	const isReadOnlyRegion = FLY_REGION && PRIMARY_REGION && FLY_REGION !== PRIMARY_REGION

	const shouldReplay = isMethodReplayable && isReadOnlyRegion

	if (!shouldReplay && next instanceof Function) return next()

	const logInfo = {
		pathname,
		method,
		PRIMARY_REGION,
		FLY_REGION,
	}
	console.info(`Replaying:`, logInfo)
	res.set("fly-replay", `region=${PRIMARY_REGION}`)
	return res.sendStatus(409)
})


// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by")

// Remix fingerprints its assets so we can cache forever.
app.use("/build", express.static("public/build", { immutable: true, maxAge: "1y" }) as any)

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }) as any)

app.use(morgan("tiny") as any)

const BUILD_DIR = path.join(process.cwd(), "build")

app.all(
	"*",
	NODE_ENV === "production"
		? createRequestHandler({ build: require(BUILD_DIR) }) as any
		: (...args) => {
			purgeRequireCache()
			const requestHandler: any = createRequestHandler({
				build: require(BUILD_DIR),
				mode: NODE_ENV,
			})
			return requestHandler(...args)
		},
)

const port = process.env.PORT || 3000

app.listen(port, () => {
	// require the built app so we're ready when the first request comes in
	require(BUILD_DIR)
	console.log(`✅ Ready: http://localhost:${port}`)
})

function purgeRequireCache() {
	// purge require cache on requests for "server side HMR" this won't let
	// you have in-memory objects between requests in development,
	// alternatively you can set up nodemon/pm2-dev to restart the server on
	// file changes, we prefer the DX of this though, so we've included it
	// for you by default
	for (const key in require.cache) {
		if (key.startsWith(BUILD_DIR)) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete require.cache[key]
		}
	}
}
