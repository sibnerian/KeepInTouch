let Handlebars = require('handlebars');
Handlebars.registerPartial('add-button', require('../templates/add-button.hbs'));
Handlebars.registerPartial('notes', require('../templates/notes.hbs'));
Handlebars.registerPartial('reminders', require('../templates/reminders.hbs'));
module.exports = Handlebars;
