import { MikroORM } from "@mikro-orm/core"
import type { LoaderFunction } from "@remix-run/node"
import { UserSchema } from "~/entities/user"

import mikroORMOptions from '~/mikro-orm.config'

export const loader: LoaderFunction = async ({ request }) => {
	const opt=await MikroORM.init(mikroORMOptions)

  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host")

  try {
    const url = new URL("/", `http://${host}`)
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
	const count= await opt.em.count(UserSchema)

    return new Response(`OK${count}`)
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error })
    return new Response("ERROR", { status: 500 })
  }
}
