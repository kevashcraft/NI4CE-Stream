WebFontConfig = {
  google: {
    families: ['Hind']
  }
};

(function(d) {
  var wf = d.createElement('script'), s = d.scripts[0];
  wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  s.parentNode.insertBefore(wf, s);
})(document);

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-88266216-2', 'auto');
ga('send', 'pageview');

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


