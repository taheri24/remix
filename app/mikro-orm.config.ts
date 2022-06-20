import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';

import { Options } from '@mikro-orm/core';
import * as entities from '~/entities'
const options:Options=   ({
	entities:Object.values(entities) as any,
	type: "mysql",
	dbName: 'remix',
	host: 'localhost',
	user: 'root',
	password: "123456",
	port: 3306,
});

export default options;
