"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Update with your config settings.
const config = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "C:/Users/User/Desktop/demo-credit/db.sqlite"
        },
        debug: true,
        pool: {
            min: 0,
            afterCreate: (conn, done) => {
                conn.run('PRAGMA foreign_keys = ON', (err) => {
                    if (err) {
                        console.log(err);
                        done(err, conn);
                    }
                    else {
                        console.log('successful');
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
exports.default = config;
