import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('transactions', function(table) {
      table.increments('id').primary();
      table.string('transType');
      table.integer('sender')
        .unsigned()
        .references('accountNumber')
        .inTable('users')
        .onDelete('CASCADE');

        table.integer('receiver')
        .unsigned()
        .references('accountNumber')
        .inTable('users')
        .onDelete('CASCADE');
        table.integer('amount').unsigned().notNullable();
        table.datetime('created_at').notNullable();

        table.index(['transType', 'sender'], 'idx_transType_sender');
        table.index(['transType', 'receiver'], 'idx_transType_receiver');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions');
}

