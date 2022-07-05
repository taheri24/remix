import { renderToString } from "react-dom/server"
import type { EntryContext } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import "dotenv/config"

import { ServerStyleContext } from "~/lib/emotion/context"
import { createEmotionCache } from "~/lib/emotion/createEmotionCache"

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {

  const html = renderToString(
            <RemixServer context={remixContext} url={request.url} />


  )

  const chunks = extractCriticalToChunks(html)

  const markup = renderToString(
    <ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>,
  )

  responseHeaders.set("Content-Type", "text/html")

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
