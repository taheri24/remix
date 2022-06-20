import { Entity, EntitySchema, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';


export interface IUser {
	id: number
	email: string
	password: string
	fullName:string
	status: BookStatus;
}
export const UserSchema = new EntitySchema<IUser>({
	name: `user`,
	properties: {
		id: { type: 'number', primary: true },
		email: { type: 'string' },
		password: { type: 'string', length: 40 },
		fullName: { type: 'string', length: 40 },
		status: { enum: true, items: () => BookStatus }

	}
}
)
export enum BookStatus {
	SOLD_OUT = 'sold',
	ACTIVE = 'active',
	UPCOMING = 'upcoming',
}
