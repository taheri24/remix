
import { json,LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { INote, NoteSchema } from "~/entities"

import { getEntityManager } from "~/lib/db.server"
import { useLoaderHeaders } from "~/lib/headers"
import { AwaitedFunction } from "~/lib/helpers/types"
import { createImageUrl } from "~/lib/s3"

const getPost = async (id?: string) => {
  if (!id) throw new Response("ID required", { status: 400 });
  const em=getEntityManager();
  const post = await em?.findOneOrFail<INote>(NoteSchema,+id )
  if (!post) throw new Response("Not Found", { status: 404 })
  return { post }
}
export const headers = useLoaderHeaders

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const data = await getPost(id)
  return json(data, { headers: { "Cache-Control": "max-age=300, s-maxage=36000" } })
}

type LoaderData = AwaitedFunction<typeof getPost>

export default function PostDetail() {
  const { post } = useLoaderData<LoaderData>()
  return (
    <c.Stack py={10} spacing={8}>
      <c.Stack justify="space-between">
        <c.Heading fontSize={{ base: "2xl", md: "3xl" }}>{post.title}</c.Heading>
        <c.Box>
          <c.Tag>{post.type}</c.Tag>
        </c.Box>
      </c.Stack>

      <c.Stack>
        <c.Text>{post.description}</c.Text>
      </c.Stack>

    </c.Stack>
  )
}
