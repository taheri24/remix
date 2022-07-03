import { RequestContext } from '@mikro-orm/core'

export const getEntityManager=(name?:string)=>{
	const em=RequestContext.getEntityManager(name);
	if(!em) throw new Error(`RequestContext.getEntityManager`);
	return em;
}
