// YOUR CODE HERE:
$(document).ready(function() {
  var messages = new Messages();
  var username = $(location).attr('href').split('=')[1];

  messages.fetchData(username);

  $(".sendButton").on("click", function() {
    messages.sendData(username);
  });

  $('body').on("click", '.user', function(e){
    var userId = e.target.id;
    if (!messages.friends[userId]) {
      messages.friends[userId] = userId;
    }
  });

  messages.refresh();

});

var Messages = function(){
  this.friends = {};
};

Messages.prototype.fetchData = function(roomname) {
  var that = this;
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
      $(".msgStream").text("");
      for (var i = 0; i < 19; i++) {
        var user = Messages.escapeStr(data.results[i].username);
        var message = Messages.escapeStr(' (' + data.results[i].createdAt.slice(0, 10) + " "+ data.results[i].createdAt.slice(11, 19) + ') : ' + data.results[i].text);
        message = message.slice(0, 140);
        user = user.slice(0, 140);
        if (that.friends[user]) {
          message = '<b>' + message + '</b>';
        }
        if ($(location).attr('href').split('=')[1] === user) {
          user = 'me';
        }
        if (!roomname) {
          $(".msgStream").append('<li> <span class=user id=' + user +  '>' + user + '</span>' + message + '</li>');
        } else if (data.results[i].roomname === roomname) {
          $(".msgStream").append('<li> <span class=user id=' + user +  '>' + user + '</span>' + message + '</li>');
        }
        $('#friendslist').text('');
        for (var friend in that.friends) {
          $('#friendslist').append('<li> <span class=fri>'+ friend + '</span></li>');
        }

      }
    },

    error: function(data) {
      console.log('failed to retrieve message');
    }
  });
};

Messages.prototype.sendData = function(username) {
  var that = this;
  var message = $('.msg').val();
  var roomname = $('.room').val();
  $('.msg').val("");
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      text: message,
      username: username,
      roomname: roomname
    }),
    success: function() {
      console.log('it sent');
      that.fetchData(roomname);
    },
    error: function() {
      console.log('failed to send message');
    }
  });
};

Messages.escapeStr = function(str){
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(str));
  return li.innerHTML;
};

Messages.prototype.refresh = function() {
  var that = this;
  setInterval(function() {
    var roomname = $('.room').val();
    that.fetchData(roomname);
  }, 1000); };
