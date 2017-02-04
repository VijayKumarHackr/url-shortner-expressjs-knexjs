
exports.up = function(knex, Promise) {
    return knex.schema.createTable('url_bindings', function(table){
        table.increments();
        table.text('url').notNull();
        table.string('binding').notNull();
        table.timestamps();
    });  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('url_bindings');
};
