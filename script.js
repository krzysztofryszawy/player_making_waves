const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();

// pobieramy obiekt audio
const audioElement = document.getElementById('myAudio');

// ustalamy źródło dzwieku w audioContext podając mu powyższy obiekt audio
const track = audioContext.createMediaElementSource(audioElement);

//podłączamy track do wyjścia audioContext
track.connect(audioContext.destination);

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
