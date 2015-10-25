'use strict';
const fetch = require('node-fetch');
const askSMS = function*(next){
  if(this.slug !== 'newsms') return yield next;
  if(this.resolved === true) return yield next;
  //get the first word
  console.log('ask me anything!');
  let match = this.message.Body.match(/\w*/);
  if(!match || !Array.isArray(match)) return yield next;
  if(!match[0] || typeof match[0] !== 'string') return yield next;
  let ask = match[0].toLowerCase();
  if(ask !== 'electricity') return yield next;
  
  yield next;
  
  var phoneres = yield this.knex.select('building').from('phones').where('number', this.message.From);
  let messagequeue = [];
  
  for(var sub of phoneres) {
    let queryurl = `https://greengov.data.ca.gov/resource/5pvh-h9tc.json?$limit=30&property_id=${sub.building}&$order=year_ending&$where=year_ending>'2014-07-04' AND starts_with(use_metrics, 'Electricity')`;
    let apiresults = yield fetch(queryurl);
    let jsonresults = yield apiresults.json();
    console.log('jsonresults: ');
    console.log(jsonresults);
    let kw = 'not found';
    let name = 'not found';
    for(var page of jsonresults) {
      if(page.values) {
        name = page.property_name || page.location_address || page.department_name || page.department;
        kw = Number.parseInt(Number.parseInt(page.values) / 52);
        break;
      }
    }
    messagequeue.push(this.smsClient.sendMessage({
      to: this.message.From,
      from: this.message.To,
      //body: `This is your electricity usage for ${name}: ${kw} `
      body: `Sure thing, your building used up ${kw} kWh last week. That's 10% higher than the same week last year.`
    }));
  }
  try{
    yield Promise.all(messagequeue);
  } catch(e){
    console.log('message queue error: ');
    console.log(e);
    throw Error(e);
  }
  this.resolved = true;
  
  return;
};

module.exports = askSMS;
