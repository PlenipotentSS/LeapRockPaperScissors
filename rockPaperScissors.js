var moveNumber, displayMsg, computerNumber, hand, imageID, keyboardInput;
var bounceCount = 0;
var wasSeen = false;
var lmOptions = { enableGestures: true };
var playerScore = 0;
var computerScore = 0;

function getImageURL(id) {
  id += 2 // offset to get correct image id
  return 'http://cdn.downloads.palm.com/public/com.ddluk.rockpaperscissors/1.1.0/en/images/' + id + '/L/ph_rockpaperscissors_v1_' + id + '.png';
}

function leapLoop(frame) {
  displayMsg = 'No hands detected<br>';

  if (frame.hands.length > 0 || typeof(keyboardInput) !== "undefined") {
    displayMsg = 'Hand(s) detected<br />';
    hand = frame.hands[0];

    if (window.bounceCount < 3 && !wasSeen) {
      window.bounceCount++;
      wasSeen = true;
    } else if (window.bounceCount >= 3) {
      console.log(hand)
      window.bounceCount = 0;
      if (hand.pointables.length == 0) {
        moveNumber = 0;
      } else if (hand.pointables.length <= 2) {
        moveNumber = 1;
      } else if (hand.pointables.length <= 4) {
        moveNumber = 2;
      }

      computerNumber = Math.round(Math.random() * 2);
      console.log(computerNumber)
      if (moveNumber < computerNumber) {
        if (computerNumber == 2 && moveNumber == 0) {
          computerScore++;
        } else {
          playerScore++;
        }
      } else if (computerNumber < moveNumber) {
        if (moveNumber == 2 && computerNumber == 0) {
          playerScore++;
        } else {
          computerScore++;
        }
      }

      $('#imageID').attr('src', getImageURL(moveNumber));
      $('#display').html(displayMsg);
      $('#playerScore').html(playerScore);
      $('#computerScore').html(computerScore);
      $('#imageID2').attr('src', getImageURL(computerNumber));
    }

    displayMsg += 'number of bounces:'+window.bounceCount;
    keyboardInput = undefined;

  } else {
    wasSeen = false;
  }
  $('#display').html(displayMsg);
}

$(document).ready(function() {

  $('body').on('keypress', function(key) {
    moveNumber = Math.abs(key.keyCode - 114);
    keyboardInput = true;
    window.bounceCount++;
    console.log('Player move: ' + moveNumber);
    var data = fakeFrame({fingers: moveNumber*2, hands:1})
    var frame = new Leap.Frame(data);

    leapLoop(frame)
  });

  if (typeof(Leap) === 'undefined') {
    $('#display').html('Leap JS client library, leap.js, not found');
    alert('Leap JS client library, leap.js, not found.');
  } else {
    // Note: Leap produces frames faster than the browser can
    // utilize them, so while it is possible to get them all,
    // we will only receive frames on repaint here (Leap.loop
    // uses requestAnimationFrame).

    Leap.loop(lmOptions, function(frame){
      leapLoop(frame)
    });
  }
});
