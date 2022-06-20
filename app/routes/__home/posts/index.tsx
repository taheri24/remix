import * as c from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/react"
import { MikroORM, RequestContext } from "@mikro-orm/core"
import { json, LoaderFunction, MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import dayjs from "dayjs"

import { Tile, TileBody, TileFooter, TileHeader, TileHeading } from "~/components/Tile"
import { INote, NoteSchema } from "~/entities"

import { createImageUrl } from "~/lib/s3"

interface ILoadedData{
	posts:INote[]
}


export const loader: LoaderFunction = async () => {
	const em = RequestContext.getEntityManager();
	if (!em) throw new Error('em')
	const posts = await em.find(NoteSchema, {})
	return json<ILoadedData>({posts})
}
export default function Posts() {
	const { posts } = useLoaderData<ILoadedData>()
	return (
		<c.Stack py={10} spacing={8}>
			<c.Heading fontSize={{ base: "2xl", md: "3xl" }}>Posts</c.Heading>
			<c.SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
				{posts.map((post) => (
					<Link to={''+post.id} key={post.id}>
						<Tile>
							<TileHeader>
								<TileHeading>{post.title}</TileHeading>
							</TileHeader>
							<TileBody>{post.description}</TileBody>
							<TileFooter>
								<c.Flex justify="flex-end">
									<c.HStack>
											<c.Text>{ }</c.Text>
									</c.HStack>
								</c.Flex>
							</TileFooter>
						</Tile>
					</Link>
				))}
			</c.SimpleGrid>
		</c.Stack>
	)
}
