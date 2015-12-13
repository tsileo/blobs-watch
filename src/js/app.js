var UI = require('ui');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var Voice = require('ui/voice');

var main = new UI.Card({
  title: 'Blobs',
  body: 'Press center to record a new note.',
});

main.show();

main.on('click', 'select', function(e) {
  var card = new UI.Card({
    title: 'New Note',
    subtitle: 'Press select to save it',
  });
  Voice.dictate('start', false, function(e) {
    if (e.err) {
      card.body('Error: ' + e.err);
      console.log('Error: ' + e.err);
      card.show();
      return;
    }
    var content = e.transcription;
    card.on('click', 'select', function(e) {
      Vibe.vibrate();
      var feedbackCard = new UI.Card();
      console.log(e.button);
      ajax(
        {
          url: 'http://requestb.in/1cpmxfm1',
          method: 'post',
          type: 'json',
          data: {'content': content},
        },
        function(data, status, req) {
          console.log('Req failed: ', data, status, req);
          console.log(data);
          console.log(status);
          console.log(req);
          Vibe.vibrate('long');
          feedbackCard.title('Failed :(');
          feedbackcard.body('status:'+status);
          feedbackcard.show();
        },
        function(data, status, req) {
          Vibe.vibrate();
          feedbackCard.title('Note saved!');
          feedbackcard.show();
          console.log('Req for saving note: ' + status + '/' +data);
        }
      );
    });
    card.body(e.transcription);
    card.show();
  });
});
