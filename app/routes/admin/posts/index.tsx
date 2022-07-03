import * as c from "@chakra-ui/react"
import { Prisma } from "@prisma/client"
import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { LinkButton } from "~/components/LinkButton"
import { Search } from "~/components/Search"
import { Column, Table } from "~/components/Table"
import { Tile } from "~/components/Tile"
import { INote, NoteSchema } from "~/entities"
import { getEntityManager } from "~/lib/db.server"
import { AwaitedFunction } from "~/lib/helpers/types"
import { getTableParams, TableParams } from "~/lib/table"

const getPosts = async ({ search, ...tableParams }: TableParams) => {
const em=getEntityManager();
  const [posts,count] = await em.findAndCount(NoteSchema,{



  },{limit:tableParams.take,offset:tableParams.skip })

  return { posts:posts as INote[], count }
}

const TAKE = 10

export const loader: LoaderFunction = async ({ request }) => {
  const posts = await getPosts(getTableParams(request, TAKE, { createdAt: Prisma.SortOrder.desc }))
  return json(posts)
}

type LoaderData = AwaitedFunction<typeof getPosts>
type Post = LoaderData["posts"][0]

export default function Posts() {
  const ld = useLoaderData<LoaderData>();

  const { posts, count }=ld;
  return (
    <c.Stack spacing={4}>
      <c.Flex justify="space-between">
        <c.Heading>Posts</c.Heading>
        <LinkButton to="new" colorScheme="purple">
          Create
        </LinkButton>
      </c.Flex>
      <Search placeholder="Search posts" />
      <Tile>
        <Table
          noDataText="No posts found"
          data={posts as any}
          take={TAKE}
          getRowHref={(post) => post.id}
          count={count}
        >
          <Column  sortKey="title" header="Title" row={(post:INote) => post.title as any}  />


        </Table>
      </Tile>
    </c.Stack>
  )
}
