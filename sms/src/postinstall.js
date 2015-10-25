var knex = require('knex')({
  client: 'pg',
  connection: require('./pgconnection.js')
});

var sql = `CREATE TABLE IF NOT EXISTS "phones" (
    "id" serial,
    "building" text NOT NULL,
    "number" text NOT NULL,
    PRIMARY KEY ("id")
);`;

knex.raw(sql).then(function(){
  knex.destroy();
}).catch(function(){
  knex.destroy();
});
