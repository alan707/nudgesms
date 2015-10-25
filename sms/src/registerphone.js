'use strict';
const fetch = require('node-fetch');
const registerPhone = function*(next){
  if(this.slug !== 'newsms') return yield next;
  if(this.resolved === true) return yield next;
  let match = this.message.Body.match(/[0-9]*/);
  if(!match || !Array.isArray(match)) return yield next;
  if(!match[0]) return yield next;
  
  yield next;
  
  const code = match[0]
  
  let queryurl = `https://greengov.data.ca.gov/resource/5pvh-h9tc.json?$limit=30&property_id=${code}&$order=year_ending&$where=year_ending>'2014-07-04' AND starts_with(use_metrics, 'Electricity')`;
  let siteresult = yield fetch(queryurl);
  let sites = yield siteresult.json();

  if(sites.length <= 0) return;
  
  let regresult = yield this.knex('phones').insert({number: this.message.From, building: code});
  let name = sites[0].property_name || sites[0].location_address || sites[0].department_name || sites[0].department;
  
  this.response.body = "Hey there! Thanks for registering with CA Energy Conservation program. You're registered at building  " + name;
  this.resolved = true;
  
  return;
};

module.exports = registerPhone;
