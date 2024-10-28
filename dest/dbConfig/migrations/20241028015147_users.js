"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema
        .createTable('users', function (table) {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.string('email', 255).unique().notNullable();
        table.string('password', 255).notNullable();
        table.timestamps();
    });
}
async function down(knex) {
    return knex.schema
        .dropTable('users');
}
