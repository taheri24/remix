import { Entity, EntitySchema, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { IUser, UserSchema } from './user'
export interface INote {
	id: number;
	title: string;
	description: string;
	author: IUser;
}

export const NoteSchema = new EntitySchema<INote>({
	name:'note',
	properties: {
		id: { type: 'number', primary: true, autoincrement: true },
		title: { type: 'string', length: 30 },
		description: { type: 'string', length: 350 },
		author: { reference: 'm:1', entity: () => UserSchema }
	}
})
