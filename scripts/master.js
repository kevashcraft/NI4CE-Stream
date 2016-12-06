var NS = {
  live_label: document.getElementById('live_label'),
  play_label: document.getElementById('play_label'),
  play_button: document.getElementById('play_button'),
  playing: false,
  toggle: function() {
    if (NS.playing) {
      NS.stream.pause();
      NS.playing = false;
      NS.play_button.classList.remove('active');
      NS.live_label.classList.remove('show');
    } else {
      if (!NS.stream) {
        NS.stream = new Audio('https://ni4ce-stream.com/live');
      }
      NS.stream.play();
      NS.playing = true;
      NS.play_button.classList.add('active');
      NS.play_label.classList.remove('show');
      NS.live_label.classList.add('show');
    }
  },
};

play_button.addEventListener('click', NS.toggle);

setTimeout(function(){
  if (!NS.playing)
    NS.play_label.classList.add('show');
}, 2500);
