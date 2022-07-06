
import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { UserSchema } from "~/entities"

import { getEntityManager } from "~/lib/db.server"
import { AwaitedFunction } from "~/lib/helpers/types"
import { createImageUrl } from "~/lib/s3"

const getUser = async (id?: string) => {
	if (!id) throw new Response("ID required", { status: 400 });
	const em = getEntityManager();
	const user = await em.findOne(UserSchema, +id);
	if (!user) throw new Response("Not Found", { status: 404 })
	return { user }
}

export const loader: LoaderFunction = async ({ params: { id } }) => {
	const data = await getUser(id)
	return json(data)
}

type LoaderData = AwaitedFunction<typeof getUser>

export default function UserDetail() {
	const { user } = useLoaderData<LoaderData>()
	return (
		<Box>
			<Flex justify="space-between">
				<Stack>
					<Heading fontWeight={800}>{user.firstName}</Heading>
					<Text>{user.email}</Text>
				</Stack>
				{user.avatar && <Avatar size="xl" src={createImageUrl(user.avatar)} name={user.firstName} />}
			</Flex>
		</Box>
	)
}

export function CatchBoundary() {
	return <Box>Not found!</Box>
}
