export function getMikroORMOptionsByDatabaseURL(url:string|undefined){
	const dbURL=new URL(url||'');
	return {
		dbName:dbURL.pathname.replace('/',''),
		host:dbURL.hostname,
		port:dbURL.port,
		user:dbURL.username,
		password:dbURL.password

	}
}
