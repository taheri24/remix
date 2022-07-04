import * as c from "@chakra-ui/react"

import { Limiter } from "~/components/Limiter"
import { LinkButton } from "~/components/LinkButton"

export default function Home() {
  return (
    <Limiter pt={20} minH="100vh">
		  <div className="p-10 bg-base-100 text-base-content" >
        <button className="btn">button</button>
        <button className="btn btn-primary">button</button>
        <button className="btn btn-secondary">button</button>
        <button className="btn btn-accent">button</button>
      </div>

      <c.VStack spacing={10}>
        <c.Heading as="h1" mb={4} textAlign="center">
          Welcome to the Boilerplate
        </c.Heading>
        <LinkButton to="posts">See posts</LinkButton>
      </c.VStack>
    </Limiter>
  )
}
