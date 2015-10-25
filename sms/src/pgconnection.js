'use strict';
//knex/src/util/parse-connection.js

let local = {
  host: 'localhost'
};

let url = require('url');

let parseConnectionString = function(str) {
  'use strict';
  let parsed   = url.parse(str);
  let protocol = parsed.protocol;
  if (protocol && protocol.indexOf('maria') === 0) {
    protocol = 'maria';
  }
  if (protocol === null) {
    return {
      client: 'sqlite3',
      connection: {
        filename: str
      }
    };
  }
  if (protocol.slice(-1) === ':') {
    protocol = protocol.slice(0, -1);
  }
  return {
    client: protocol,
    connection: connectionObject(parsed)
  };
};

let connectionObject = function(parsed) {
  'use strict';
  let connection = {};
  let db = parsed.pathname;
  if (db[0] === '/') {
    db = db.slice(1);
  }
  if (parsed.protocol.indexOf('maria') === 0) {
    connection.db = db;
  } else {
    connection.database = db;
  }
  if (parsed.hostname) {
    connection.host = parsed.hostname;
  }
  if (parsed.port) {
    connection.port = parsed.port;
  }
  if (parsed.auth) {
    let idx = parsed.auth.indexOf(':');
    if (idx !== -1) {
      connection.user = parsed.auth.slice(0, idx);
      if (idx < parsed.auth.length - 1) {
        connection.password = parsed.auth.slice(idx + 1);
      }
    }
  }
  connection.ssl = true;
  return connection;
};

if (process.env.DATABASE_URL) var con = parseConnectionString(process.env.DATABASE_URL).connection;
if (process.env.TRAVIS) var con = {user: 'postgres', database: 'travis_ci_test'};

module.exports = con || local;
