//var co = require('co');
var echoSMS = function*(next){
  'use strict';
  yield next;
  console.log('echo...');
  console.log(typeof this.message);
  let match = this.message.Body.match(/echo: (.*)/)
  
  if(!match) return;
  if(!match[1]) return;
  if (match[1] && match[1].length > 0 && typeof match[1] === 'string') {
    this.response.body = match[1];
  }

  
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

module.exports = echoSMS;
