import type { Prisma } from "@prisma/client"
import { UserSchema } from "~/entities";

import { getEntityManager } from "~/lib/db.server"

export const updateUser = async (_id: string, data: Prisma.UserUpdateInput) => {
	const id=parseInt(_id);
	const em=getEntityManager();
  if (data.email) {
    const existing = await em.findOne(   UserSchema, { email:   data.email as string  })
    if (existing) return { error: "User with these details already exists" }
  }

await em.nativeUpdate(UserSchema.name, id , data  as any );
return em.findOneOrFail(UserSchema,id)
}
