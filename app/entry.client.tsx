import * as React from "react"
import { hydrate } from "react-dom"
import { RemixBrowser } from "@remix-run/react"

import { ClientStyleContext } from "~/lib/emotion/context"
import { createEmotionCache } from "~/lib/emotion/createEmotionCache"

interface ClientCacheProviderProps {
  children: React.ReactNode
}


hydrate(
    <RemixBrowser />,
  document,
)
