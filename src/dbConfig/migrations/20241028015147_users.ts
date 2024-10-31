import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('email', 255).unique().notNullable();
      table.string('password', 255).notNullable();
      table.integer('balance').notNullable().defaultTo(0);
      table.integer('accountNumber').unsigned().notNullable().unique();
      table.timestamps();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('users');
}

