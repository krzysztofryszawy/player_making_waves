window.onload = function() {
  var ctx = new AudioContext();
  var audio = document.getElementById('myAudio');
  var audioSrc = ctx.createMediaElementSource(audio);
  var analyser = ctx.createAnalyser();
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);
  analyser.connect(ctx.destination);

  var frequencyData = new Uint8Array(analyser.frequencyBinCount);

  renderFrame();
  document.getElementById('button').addEventListener('click', function() {
    ctx.resume().then(() => {
      audio.play();
      console.log(ctx);
      console.log('Playback resumed successfully');
    });
  });
};

// a full circle
var twoPi = 2 * Math.PI;
var objectsCount = 12;
var radius = 100;

// you want to align objectsCount objects on the circular path
// with constant distance between neighbors
var change = twoPi / objectsCount;
for (var i = 0; i < twoPi; i += change) {
  var x = radius * Math.cos(i);
  var y = radius * Math.sin(i);
  // rotation of object in radians
  var rotation = i;
  // set the CSS properties to calculated values
}
