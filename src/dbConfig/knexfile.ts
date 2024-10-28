import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "C:/Users/User/Desktop/demo-credit/db.sqlite"
    },
    debug : true,
    pool: {
      min: 0,
      afterCreate: (conn:any, done:(err:typeof Error, conn: any) => any) => {

        conn.run('PRAGMA foreign_keys = ON', (err: typeof Error) => {
          if (err) {
            console.log(err)
            done(err, conn);
          }
          else {
            console.log('successful')
            done(err, conn);
          }
        });
      }
    },
    migrations: {
      tableName: 'db_migrations'
    },
    useNullAsDefault: true,
  },
};
export default config;