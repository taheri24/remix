import {   EntitySchema  } from '~/lib/db.server';
import { v4 } from 'uuid';


export interface IUser {
	id: number
	email: string
	password: string
	fullName:string
	status: BookStatus;
	firstName:string;
	avatar:string
}
export const UserSchema = new EntitySchema<IUser>({
	name: `user`,
	properties: {
		id: { type: 'number', primary: true },
		email: { type: 'string' },
		password: { type: 'string', length: 40 },
		fullName: { type: 'string', length: 40 },
		status: { enum: true, items: () => BookStatus },
		firstName: { type: 'string', length:30},
		avatar: { type: 'string',length:40},
	}
}
)
export enum BookStatus {
	SOLD_OUT = 'sold',
	ACTIVE = 'active',
	UPCOMING = 'upcoming',
}
