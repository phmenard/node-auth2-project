const { table } = require("console");

exports.up = async function(knex) {
    await await knex.schema.createTable('users', (table) =>{
        table.increments('id').primary();
        table.string('username').notNull();
        table.string('password').notNull().unique();
        table.string('department').notNull();
        
    })  
};

exports.down = async function(knex) {
   await knex.schema.dropTableIfExists('users');
};
