import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('email', 255).unique().notNullable();
      table.string('password', 255).notNullable();
<<<<<<< HEAD
      table.integer('balance').notNullable().defaultTo(0);
=======
>>>>>>> b456af096210a9eef1ba711231411ab367ec41ca
      table.timestamps();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('users');
}

