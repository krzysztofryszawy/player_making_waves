const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const playlist = [
  './assets/BoxCat_Games_-_12_-_Passing_Time.mp3',
  './assets/BoxCat_Games_-_02_-_Mt_Fox_Shop.mp3',
  './assets/Trash80_-_01_-_Icarus.mp3'
];
const fieldFilename = document.getElementById('fieldFilename');
const playlistDom = document.querySelector('.playlist');
const playlistWindow = document.querySelector('.playlistWindow');

fieldFilename.addEventListener('click', () =>
  playlistWindow.classList.toggle('hidden')
);

playlistDom.innerHTML = playlist
  .map(item => `<li class="playlistItem">${item}</li>`)
  .join('');

let audioElement = document.createElement('audio');
audioElement.id = 'myAudio';
audioElement.type = 'audio/mpeg';
audioElement.src = playlist[0];

const playButton = document.querySelector('button');
const volumeControl = document.querySelector('#volume');

const changeMusicHandler = e => {
  audioElement.src = playlist[playlist.indexOf(e.target.innerText)];
  audioElement.play();
  playButton.innerHTML = '||';
  this.fieldFilename.innerHTML = `${e.target.innerText}`;
  playlistWindow.classList.toggle('hidden');
};

playlistDom.addEventListener('click', changeMusicHandler);

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
const track = audioContext.createMediaElementSource(audioElement);

const gainNode = audioContext.createGain();
const analyser = audioContext.createAnalyser();

track
  .connect(analyser)
  .connect(gainNode)
  .connect(audioContext.destination);

analyser.smoothingTimeConstant = 0.3;
analyser.fftSize = 512;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const width = canvas.width;
const height = canvas.height;

const barWidth = (width / bufferLength) * 4;

let barHeight;
let x = 0;

const renderFrame = () => {
  requestAnimationFrame(renderFrame);

  x = 0;

  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);

  let r, g, b;
  let bars = 118;

  for (let i = 0; i < bars; i++) {
    barHeight = dataArray[i] * 3;

    if (dataArray[i] > 210) {
      r = 255;
      g = 0;
      b = 255;
    } else if (dataArray[i] > 200) {
      r = 255;
      g = 255;
      b = 0;
    } else if (dataArray[i] > 190) {
      r = 0;
      g = 255;
      b = 0;
    } else if (dataArray[i] > 180) {
      r = 0;
      g = 255;
      b = 255;
    } else {
      r = 0;
      g = 128;
      b = 128;
    }

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);

    x += barWidth - 5;
  }
};

playButton.addEventListener(
  'click',
  function() {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (this.dataset.playing === 'false') {
      audioElement.play();
      playButton.innerHTML = '||';
      this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
      audioElement.pause();
      playButton.innerHTML = '&#9658';
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

volumeControl.addEventListener(
  'input',
  function() {
    gainNode.gain.value = this.value;
  },
  false
);

renderFrame();
