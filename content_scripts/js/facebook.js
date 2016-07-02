let $ = require('jquery');
let Handlebars = require('./handlebarsWithBoilerplate');
let embedTemplate = Handlebars.compile(require('../templates/embed.hbs'));

let sampleData = {
  notes: [
    {content: 'This guy is awesome, one of my favorites.'},
    {content: 'Donald Trump has small hands'}
  ],
  reminders: [
    {content: 'reconnect', date: '3 days from now'}
  ]
};

$(function () {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var embedHTML = function () {
    var isProfilePage = $('#fb-timeline-cover-name').length > 0;
    if (isProfilePage) {
      var name = $('#fb-timeline-cover-name').text();
      var id = $('a > #fb-timeline-cover-name').parent().attr('href').split('facebook.com/').pop();
      // console.log('Name: ' + name + ', id: ' + id);
      $('#keep-in-touch-embed').remove();
      $('#timeline_tab_content').prepend(embedTemplate(sampleData)); 
    } else {
      console.log('Not a profile page');
    }
  };

  embedHTML();

  var observer = new MutationObserver(function (mutations, observer) {
    // fired when a mutation occurs
    // we are going to use the observer to add the extension HTML to profile pages,
    // only when necessary.
    embedHTML();
  });

  observer.observe(document, {
    subtree: true,
    attributes: true
  });

});
