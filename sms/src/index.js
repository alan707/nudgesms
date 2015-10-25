'use strict';
var port = process.env.PORT|| process.env.port || process.env.npm_package_config_port || global.port || 3000;
var baseurl = process.env.BASE_URL || 'http://nudgesms.herokuapp.com';
if (!global.knex) var knex = require('knex')({
  client: 'pg',
  connection: require('./pgconnection.js')
});
const koa = require('koa');
const app = koa();
const mount = require('koa-mount');

const nudgeserver = require('./nudgeserver.js');
const config = {
  port: port,
  baseurl: baseurl,
  knex: knex,
  twilioAccountSID: process.env.TWILIO_SID,
  twilioAuthToken: process.env.TWILIO_TOKEN,
  secret: process.env.SECRET
};

app.use(mount(nudgeserver(config)));
console.log('Starting server on port ' + port);
app.listen(port);
