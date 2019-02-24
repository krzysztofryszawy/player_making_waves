const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();

// pobieramy obiekt audio
const audioElement = document.getElementById('myAudio');

const canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
// ustalamy źródło dzwieku w audioContext podając mu powyższy obiekt audio
const track = audioContext.createMediaElementSource(audioElement);

// tworzymy node do sterowania glosnoscia
const gainNode = audioContext.createGain();

var analyser = audioContext.createAnalyser();

//podłączamy track do wyjścia audioContext
// track.connect(audioContext.destination);
track
  .connect(analyser)
  .connect(gainNode)
  .connect(audioContext.destination);

analyser.smoothingTimeConstant = 0.3;
analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

console.log(WIDTH);
console.log(HEIGHT);

const barWidth = (WIDTH / bufferLength) * 13;
console.log(barWidth);

let barHeight;
let x = 0;

function renderFrame() {
  requestAnimationFrame(renderFrame);

  x = 0;

  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  let r, g, b;
  let bars = 118; // Set total number of bars you want per frame

  for (let i = 0; i < bars; i++) {
    barHeight = dataArray[i] * 2.5;

    if (dataArray[i] > 210) {
      // pink
      r = 250;
      g = 0;
      b = 255;
    } else if (dataArray[i] > 200) {
      // yellow
      r = 250;
      g = 255;
      b = 0;
    } else if (dataArray[i] > 190) {
      // yellow/green
      r = 204;
      g = 255;
      b = 0;
    } else if (dataArray[i] > 180) {
      // blue/green
      r = 0;
      g = 219;
      b = 131;
    } else {
      // light blue
      r = 0;
      g = 199;
      b = 255;
    }

    // if (i === 0){
    //   console.log(dataArray[i])
    // }

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    // (x, y, i, j)
    // (x, y) Represents start point
    // (i, j) Represents end point

    x += barWidth + 10; // Gives 10px space between each bar
  }
}

renderFrame();

const playButton = document.querySelector('button');

playButton.addEventListener(
  'click',
  function() {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === 'false') {
      audioElement.play();
      this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
      audioElement.pause();
      this.dataset.playing = 'false';
    }
  },
  false
);

audioElement.addEventListener(
  'ended',
  () => {
    playButton.dataset.playing = 'false';
  },
  false
);

const volumeControl = document.querySelector('#volume');

volumeControl.addEventListener(
  'input',
  function() {
    gainNode.gain.value = this.value;
  },
  false
);
