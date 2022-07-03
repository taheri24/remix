import * as c from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/react"
import { MikroORM } from "@mikro-orm/core"
import { json, LoaderFunction, MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import dayjs from "dayjs"

import { Tile, TileBody, TileFooter, TileHeader, TileHeading } from "~/components/Tile"
import { INote, NoteSchema } from "~/entities"
import { getEntityManager } from "~/lib/db.server"

import { createImageUrl } from "~/lib/s3"

interface ILoadedData{
	posts:INote[]
}


export const loader: LoaderFunction = async () => {
	const em =  getEntityManager();
	if (!em) throw new Error('em')
	const posts = await em.find(NoteSchema, {})
	const jsonDat:ILoadedData={posts} ;
	return json<ILoadedData>(jsonDat);
}
export default function Posts() {
	const ld = useLoaderData<ILoadedData>()
	console.log('ld>>>',ld);
	const {posts}=ld;
	return (
		<c.Stack py={10} spacing={8}>
			<c.Heading fontSize={{ base: "2xl", md: "3xl" }}>Posts</c.Heading>
			{!!posts.length && <c.SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
				{posts.filter(Boolean).map((post) => (
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
			</c.SimpleGrid>}
		</c.Stack>
	)
}
