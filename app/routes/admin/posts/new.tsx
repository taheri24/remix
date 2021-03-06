import * as React from "react"

import { PostType } from "@prisma/client"
import { ActionFunction, redirect } from "@remix-run/node"
import { useTransition } from "@remix-run/react"
import { z } from "zod"

import { Form, FormError, FormField } from "~/components/Form"
import { Tile, TileBody, TileFooter, TileHeader, TileHeading } from "~/components/Tile"
import { getEntityManager } from "~/lib/db.server"
import { validateFormData } from "~/lib/form"
import { badRequest } from "~/lib/remix"
import { getCurrentUser } from "~/services/auth/auth.server"
import { NoteSchema } from "~/entities"

export const action: ActionFunction = async ({ request }) => {
  const postSchema = z.object({
    title: z.string().min(1, { message: "Required" }),
    description: z.string().min(1, { message: "Required" }),
    type: z.nativeEnum(PostType, { errorMap: () => ({ message: "Invalid option" }) }),
  })
  const formData = await request.formData()
  const { data, fieldErrors } = await validateFormData(postSchema, formData)
   if (fieldErrors) return badRequest({ fieldErrors, data })
  const em=getEntityManager();
  const freshPost=em.create(NoteSchema,data as any);
  await em.persistAndFlush(freshPost);
  return redirect(`/admin/posts/${freshPost.id}`)
}

const POST_TYPE_OPTIONS: { label: string; value: PostType }[] = [

]

export default function NewPost() {
  const [isDirty, setIsDirty] = React.useState(false)
  const { state } = useTransition()
  const isSubmitting = state === "submitting"

  return (
    <c.Stack spacing={4}>
      <c.Flex justify="space-between">
        <c.Heading>New post</c.Heading>
      </c.Flex>

      <Form
        method="post"
        onChange={(e) => {
          const formData = new FormData(e.currentTarget)
          const data = Object.fromEntries(formData)
          const isDirty = Object.values(data).some((val) => !!val)
          setIsDirty(isDirty)
        }}
      >
        <Tile>
          <TileHeader>
            <TileHeading>Info</TileHeading>
          </TileHeader>
          <TileBody>
            <c.Stack spacing={4}>
              <FormField name="title" label="Title" placeholder="My post" min={1} />
              <FormField name="description" label="Description" input={<c.Textarea rows={6} />} />
              <FormField
                name="type"
                label="Type"
                placeholder="Select type"
                input={
                  <c.Select>
                    {POST_TYPE_OPTIONS.map(({ value, label }) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))}
                  </c.Select>
                }
              />
              <FormError />
            </c.Stack>
          </TileBody>
          <TileFooter>
            <c.ButtonGroup>
              <c.Button
                type="submit"
                isDisabled={isSubmitting || !isDirty}
                isLoading={isSubmitting}
                colorScheme="purple"
                size="sm"
              >
                Create
              </c.Button>
            </c.ButtonGroup>
          </TileFooter>
        </Tile>
      </Form>
    </c.Stack>
  )
}
