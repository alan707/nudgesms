'use strict';
const smsArrived = function*(next){
  if(this.slug !== 'newsms') return yield next;
  
  const valid = this.twilio.validateRequest(this.config.twilioAuthToken, this.request.header, this.config.baseurl, this.request.body);
  this.message = JSON.parse(JSON.stringify(this.request.body));
  
  yield next;

  return;
};

module.exports = smsArrived;
