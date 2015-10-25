'use strict';
const nudgeSMS = function(c){
  'use strict';
  const config = c || {};
  if(!config.twilioAccountSID || !config.twilioAuthToken) throw Error('Provide TWILIO_SID and TWILIO_TOKEN in config.');
  if (!config.knex) throw Error('Provide a knex instance in config.');

  const koa = require('koa');
  const bodyParser = require('koa-body-parser');
  const app = koa();
  app.name = 'nudgesms';
  app.use(bodyParser());

  app.use(function*(next) {
    this.resolved = false;
    this.config = config;
    this.twilio = require('twilio');
    this.smsClient = this.twilio(config.twilioAccountSID, config.twilioAuthToken);
    this.knex = this.config.knex;
    this.slug = this.request.path.split('/').pop();
    return yield next;
  });

  app.use(require('./smsarrived.js'));
  //app.use(require('./buildingblast.js'));
  //app.use(require('./echosms.js'));
  app.use(require('./registerphone.js'));
  app.use(require('./asksms.js'));
  app.use(require('./manualtrigger.js'));
  return app;
};

module.exports = nudgeSMS;
