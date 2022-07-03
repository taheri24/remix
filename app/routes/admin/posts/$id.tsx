import * as c from "@chakra-ui/react"
import { HeadersFunction, json,LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { NoteSchema } from "~/entities"

import { getEntityManager } from "~/lib/db.server"
import { AwaitedFunction } from "~/lib/helpers/types"

export const headers: HeadersFunction = () => {
  return { "Cache-Control": "max-age=300, s-maxage=3600" }
}

const getPost = async (id?: string) => {
  if (!id) throw new Response("ID required", { status: 400 })
  const em=getEntityManager();
  const post = await em?.findOne(NoteSchema,+id);
  if (!post) throw new Response("Not Found", { status: 404 })
  return { post }
}

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const data = await getPost(id)
  return json(data)
}

type LoaderData = AwaitedFunction<typeof getPost>

export default function PostDetail() {
  const { post } = useLoaderData<LoaderData>()
  return (
    <c.Box>
      <c.Flex justify="space-between">
        <c.Stack>
          <c.HStack>
            <c.Heading fontWeight={800}>{post.title}</c.Heading>
            <c.Tag>{post.type}</c.Tag>
          </c.HStack>
          <c.Text>{post.description}</c.Text>
        </c.Stack>

      </c.Flex>
    </c.Box>
  )
}
