//var co = require('co');
var buildingBlast = function*(next){
  'use strict';

  let match = this.message.Body.match(/[0-9]*: (.*)/);
  if(!match || !Array.isArray(match)) return yield next;
  if (!match[0] || !match[1]) return yield next;
  var code = match[0];
  var msg = match[1];
  
  //var siteresult = yield this.knex.select('department').from('buildings').where('code', code);
  var subscribers = yield this.knex.select('number').from('phones').where('code', code);
  for (var i in subscribers){
    let r = yield this.smsClient.sendMessage({
      to: subscribers[i].number,
      from: this.message.From,
      body: msg
    });
    console.log(r);
  }
  
  var registerresult = yield this.knex('phones').insert({number: this.message.From, building: code});
  console.log(registerresult);
  this.response.body = `${i} recipients: ${msg}`;

  yield next;
  
  /*This works, but the response body with a 200 response is the same as an echo.
  let sent = yield this.smsClient.sendMessage({
    to: msg.From,
    from: msg.To,
    body: msg.Body
  });  */
  
  //this.response.body = msg.Body;
  //return yield Promise.resolve(false);
  return;
};

module.exports = buildingBlast;
