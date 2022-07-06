import * as React from "react"


import { useActionData, useTransition } from "@remix-run/react"
import type { ActionData } from "~/lib/form"
import { createImageUrl } from "~/lib/s3"

import { ImageUploader } from "./ImageUploader"

export { Form } from '@remix-run/react'

interface FormFieldProps {
	className:string;
	isRequired?: boolean;
	id: string;
	name: string;
	label: string;
	input?: React.ReactElement;
	defaultValue?: any;
	placeholder:string;
}

export function FormField({ label, input, id, name,className, ...props }: FormFieldProps) {
	const form = useActionData<ActionData<any>>();
	const defaultValue = form?.data?.[name];
	const errorText = form?.fieldErrors?.[name]?.[0];
	const classNames=[className,"form-control w-full max-w-xs",
		errorText && "input-error"];
	const clonedInput =
		input &&
		React.cloneElement(input, {
			defaultValue,
			id: id || name,
			className:classNames.join(' '),
			...props,
		});
	return (
		<div className="input input-bordered w-full max-w-xs">
  <label className="label">
    <span className="label-text">What is your name?</span>
    <span className="label-text-alt">Alt label</span>
  </label>
  {clonedInput}
  <label className="label">
    <span className="label-text-alt">{errorText}</span>
    <span className="label-text-alt">Alt label</span>
  </label>
</div>

	)
}

interface ImageFieldProps extends Omit<c.FlexProps, "defaultValue"> {
	path: string
	name: string
	label: string
	defaultValue?: string | null | undefined
	isRequired?: boolean
	placeholder?: string
}

export function ImageField({
	label,
	path,
	placeholder,
	isRequired,
	defaultValue,
	...props
}: ImageFieldProps) {
	const form = useActionData<ActionData<any>>()
	const [image, setImage] = React.useState(defaultValue)
	return (
		<c.FormControl isRequired={isRequired} isInvalid={!!form?.fieldErrors?.[props.name]}>
			<c.FormLabel htmlFor={props.name}>{label}</c.FormLabel>
			<c.Box>
				<ImageUploader onSubmit={setImage} path={path}>
					{image ? (
						<c.Image
							_hover={{ opacity: 0.8 }}
							objectFit="cover"
							src={createImageUrl(image)}
							h="200px"
							w="100%"
							{...props}
						/>
					) : (
						<c.Center
							_hover={{ bg: "whiteAlpha.100", transition: "100ms all" }}
							bg="whiteAlpha.50"
							h="200px"
							w="100%"
							{...props}
						>
							<c.Text color="gray.400">{placeholder || "Upload an image"}</c.Text>
						</c.Center>
					)}
				</ImageUploader>
				<input type="hidden" value={image || ""} name={props.name} />
			</c.Box>
			<c.FormErrorMessage>{form?.fieldErrors?.[props.name]?.[0]}</c.FormErrorMessage>
		</c.FormControl>
	)
}

export function FormError() {
	const form = useActionData<ActionData<any>>()
	if (!form?.formError) return null
	return (
		<c.FormControl isInvalid={!!form?.formError}>
			<c.FormErrorMessage>{form?.formError}</c.FormErrorMessage>
		</c.FormControl>
	)
}
export type FormButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
	color: 'primary' | 'secondary' | 'success'
	| 'accent' | 'warning' | 'error';
	ghost: boolean;
	link: boolean;
	active: boolean;
	disabled: boolean;
	loading: boolean;
	noAnimation: boolean;
	size: 'lg' | 'md' | 'sm' | 'xs';
	lgSize: 'lg' | 'md' | 'sm' | 'xs';
	mdSize: 'lg' | 'md' | 'sm' | 'xs';
	smSize: 'lg' | 'md' | 'sm' | 'xs';
	xsSize: 'lg' | 'md' | 'sm' | 'xs';


}
export function FormButton(props: FormButtonProps) {
	const transition = useTransition()
	const classNames = [
		'btn',
		props.color && `btn-${props.color}`,
		props.size && `btn-${props.size}`,
		props.lgSize && `lg:btn-${props.lgSize}`,
		props.mdSize && `md:btn-${props.mdSize}`,
		props.smSize && `sm:btn-${props.smSize}`,
		props.xsSize && `xs:btn-${props.xsSize}`,

	].filter(Boolean)
	return (
		<button
			className={classNames.join(' ')}
			type="submit"
			isLoading={transition.state === "submitting"}
			isDisabled={transition.state === "submitting"}
			{...props}
		/>
	)
}
