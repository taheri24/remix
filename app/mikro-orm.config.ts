import 'reflect-metadata'
import { JavaScriptMetadataProvider, MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';

import { Options } from '@mikro-orm/core';
import * as entities from '~/entities'
const {DATABASE_URL}=process.env;
export function getMikroORMOptionsByDatabaseURL(url:string|undefined): Options{
	const dbURL=new URL(url||'');
	return {
		dbName:dbURL.pathname.replace('/',''),
		host:dbURL.hostname,
		port:+dbURL.port,
		user:dbURL.username,
		password:dbURL.password,

	}
}
const options:Options=    {
	entities:Object.values(entities) as any,
	type:'mysql',
	...getMikroORMOptionsByDatabaseURL(DATABASE_URL),
	debug:true,

} ;

export default options;
