import * as React from "react"

import { MetaFunction } from "@remix-run/node"
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from "@remix-run/react"


import styles from "~/styles/app.css"
export function links() {
	return [{ rel: "stylesheet", href: styles }]
  }
export const meta: MetaFunction = () => {
  return { title: "Boilerplate" }
}


export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
   return (
    <Document>
      <div className="h-full-screen min-h-screen  text-current content-center">
        <h1  className="leading-3">There was an error</h1>
        <div className="text-lg">{error.message}</div>
        <hr />
        <div >Hey, developer,
			you should replace this with what you want your users to see.
			</div>
      </div>
    </Document>
  )
}

export function CatchBoundary() {
  let caught = useCatch()
  let message
  switch (caught.status) {
    case 401:
      message = <div className="leading-5">Oops! Looks like you tried to visit a page that
	  you do not have access to.</div>
      break
    case 404:
      message = <div className="leading-5">Oops! Looks like you tried to visit a page
		that does not exist.</div>
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Document>
      <div className="h-full-screen min-h-screen ">
        <h3 className="leading-3">
          {caught.status}: {caught.statusText}
        </h3>
        {message}
      </div>
    </Document>
  )
}

interface DocumentProps {
  children: React.ReactNode
}

const Document = (({ children }: DocumentProps) => {


  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />

      </head>
      <body>
		 {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  )
})
