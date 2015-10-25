'use strict';
const manualTrigger = function*(next){
  if (this.slug !== 'manualtrigger') return yield next;
  if (this.request.get('secret') !== this.config.secret) return yield next;
  const body = JSON.parse(JSON.stringify(this.request.body));
  if(!body.message || !body.building || !body.from) return;
  yield next;

  const subscribers = yield this.knex.select('number').from('phones').where('building', body.building);
  
  let count = 0;
  for (let i of subscribers) {
    try {
      let sent = yield this.smsClient.sendMessage({
        to: i.number,
        from: body.from,
        body: body.message
      });
      ++count;
    }catch(e){
      console.log(e);
    }
  }

  
  this.response.body = `Sent ${count} messages.`;
  return;
};

module.exports = manualTrigger;
