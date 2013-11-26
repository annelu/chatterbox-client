// YOUR CODE HERE:
$(document).ready(function() {
  var username = $(location).attr('href').split('=')[1];
  var friends = {};

  var fetchData = function(roomname) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        console.log(data);
        $(".msgStream").html("");
        for (var i = 0; i < 19; i++) {
          var user = escapeStr(data.results[i].username);
          var message = escapeStr(' (' + data.results[i].createdAt.slice(0, 10) + " "+ data.results[i].createdAt.slice(11, 19) + ') : ' + data.results[i].text);
          message = message.slice(0, 140);
          user = user.slice(0, 140);
          if (friends[user]) {
            message = '<b>' + message + '</b>';
          }
          if (!roomname) {
            $(".msgStream").append('<li> <span class=user id=' + user +  '>' + user + '</span>' + message + '</li>');
          } else if (data.results[i].roomname === roomname) {
            $(".msgStream").append('<li> <span class=user id=' + user +  '>' + user + '</span>' + message + '</li>');
          }
          $('.user').on("click", function(){
            console.log('clicking on user is working');
            var userId = $(this).attr('id');
            if (!friends[userId]) {
              friends[userId] = userId;
            }
          });
        }
      },

      error: function(data) {
        console.log('failed to retrieve message');
      }
    });
  };

  var sendData = function(username, message, roomname) {
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
        fetchData(roomname);
      },
      error: function() {
        console.log('failed to send message');
      }
    });
  };

  var escapeStr = function(str){
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(str));
    return li.innerHTML;
  };

  $(".sendButton").on("click", function() {
    var message = $('.msg').val();
    var roomname = $('.room').val();
    sendData(username, message, roomname);
    $('.msg').val("");
  });

  setInterval(function() {
    var roomname = $('.room').val();
    fetchData(roomname);
  }, 1000);

});