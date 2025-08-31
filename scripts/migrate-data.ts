import { drizzle as drizzleLocal } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleProd } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../lib/schema';

async function main() {
  const localClient = postgres(process.env.LOCAL_DATABASE_URL!, { max: 1 });
  const localDb = drizzleLocal(localClient, { schema });

  const prodClient = postgres(process.env.PRODUCTION_DATABASE_URL!, { max: 1 });
  const prodDb = drizzleProd(prodClient, { schema });

  console.log('Fetching data from local database...');
  const users = await localDb.query.users.findMany();
  const articles = await localDb.query.articles.findMany();

  console.log('Inserting data into production database...');
  await prodDb.insert(schema.users).values(users);
  await prodDb.insert(schema.articles).values(articles);

  console.log('Data migration complete!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
