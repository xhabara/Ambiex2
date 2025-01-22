let autonomousMode = false;
let autonomousButton;
let sound1, sound2, delay1, delay2, sound3, sound4, delay3, delay4;
let delayTimeSlider1, pitchSlider1, octaveSlider1, delayTimeSlider3, pitchSlider3, octaveSlider3;
let delayTimeSlider2, pitchSlider2, octaveSlider2, delayTimeSlider4, pitchSlider4, octaveSlider4;
let panSlider1, panSlider2, panSlider3, panSlider4;
let volumeSlider1, volumeSlider2, volumeSlider3, volumeSlider4;
let isPlaying = false;

let saveButton;
let mainRecorder;
let mainRecording;
let isMainRecording = false;

let fileInput1, fileInput2, fileInput3, fileInput4;
let isCanvasReady = false;
let scaleSelect;
let currentScale = "chromatic";

// Define scales as note arrays (frequencies relative to a base note for rate, octaves for octave)
const scales = {
    chromatic: [
        0.5, 0.529732, 0.561231, 0.594604, 0.629961, 0.66742,
        0.707107, 0.749154, 0.793701, 0.840896, 0.890899,
        0.943874, 1.0, 1.059463, 1.122462, 1.189207, 1.259921,
        1.33484, 1.414214, 1.498307, 1.587401, 1.681793, 1.781797,
        1.887749, 2.0
    ],
    major: [0.5, 0.561231,  0.629961, 0.707107, 0.793701, 0.890899, 1.0, 1.122462, 1.259921,1.414214, 1.587401,  1.781797,  2.0 ],
    minor: [0.5, 0.561231, 0.629961, 0.707107, 0.793701, 0.840896, 1.0, 1.122462, 1.189207,  1.414214, 1.587401, 1.681793, 2.0],
    pentatonic: [0.5, 0.594604, 0.707107, 0.793701, 1.0, 1.189207,1.414214, 1.587401, 2.0],
    wholeTone: [0.5, 0.594604, 0.707107,  0.793701, 0.890899, 1.0, 1.189207, 1.414214,1.587401, 1.781797, 2.0 ]

};
const octaveSteps = [-2, -1, 0, 1, 2];

// Define Rhythmic Patterns as arrays of timing ratios
const rhythmicPatterns = [
    [1, 1, 1, 1],  // Quarter notes
    [1, 0.5, 1, 0.5], // Quarter and Eighth notes
    [1, 0.5, 0.5, 1], // syncopated
    [0.5, 0.5, 1, 1], // 8th, 8th, quarter, quarter
    [1, 0.75, 0.5, 0.75], // swing
];
let currentPatternIndex1 = 0;
let currentPatternIndex2 = 1;
let patternTimer = 0;
let patternStep1 = 0;
let patternStep2 = 0;
let currentNoteIndex1 = 0;
let currentNoteIndex2 = 1;
let currentNoteIndex3 = 2;
let currentNoteIndex4 = 3;

// Individual speed sliders
let speedSlider1, speedSlider2, speedSlider3, speedSlider4;
let currentSpeed1 = 0.05;
let currentSpeed2 = 0.05;
let currentSpeed3 = 0.05;
let currentSpeed4 = 0.05;

// Filter variables
let filter1, filter2, filter3, filter4;
let filterFreqSlider1, filterFreqSlider2, filterFreqSlider3, filterFreqSlider4;
let filterBandwidthSlider1, filterBandwidthSlider2, filterBandwidthSlider3, filterBandwidthSlider4;

// Tempo slider variables
let globalTempoSlider;
let currentTempo = 120;

function preload() {
  // No preloaded sounds here.
}

function setup() {
    noCanvas(); // No canvas is needed
  background(25);

  // Add master limiter
  masterLimiter = new p5.Compressor();
  masterLimiter.attack(0.003);
  masterLimiter.knee(30);
  masterLimiter.ratio(12);
  masterLimiter.threshold(-24);
  masterLimiter.release(0.25);

  // Initialize sound files as empty p5.SoundFile objects
  sound1 = new p5.SoundFile();
  sound2 = new p5.SoundFile();
  sound3 = new p5.SoundFile();
  sound4 = new p5.SoundFile();

  delay1 = new p5.Delay();
  delay1.process(sound1, 0.12, 0.5, 2300);
  delay2 = new p5.Delay();
  delay2.process(sound2, 0.12, 0.5, 2300);
  delay3 = new p5.Delay();
  delay3.process(sound3, 0.12, 0.5, 2300);
  delay4 = new p5.Delay();
  delay4.process(sound4, 0.12, 0.5, 2300);

  // Initialize the main recorder and set its input to the master output
  mainRecorder = new p5.SoundRecorder();
  mainRecorder.setInput();

  // Create a new p5.SoundFile for the recording
  mainRecording = new p5.SoundFile();

    // Get slider elements from HTML
  delayTimeSlider1 = document.getElementById('delayTimeSlider1');
  pitchSlider1 = document.getElementById('pitchSlider1');
  octaveSlider1 = document.getElementById('octaveSlider1');
  panSlider1 = document.getElementById('panSlider1');
  volumeSlider1 = document.getElementById('volumeSlider1');

  delayTimeSlider2 = document.getElementById('delayTimeSlider2');
  pitchSlider2 = document.getElementById('pitchSlider2');
  octaveSlider2 = document.getElementById('octaveSlider2');
  panSlider2 = document.getElementById('panSlider2');
  volumeSlider2 = document.getElementById('volumeSlider2');

  delayTimeSlider3 = document.getElementById('delayTimeSlider3');
  pitchSlider3 = document.getElementById('pitchSlider3');
  octaveSlider3 = document.getElementById('octaveSlider3');
  panSlider3 = document.getElementById('panSlider3');
  volumeSlider3 = document.getElementById('volumeSlider3');

  delayTimeSlider4 = document.getElementById('delayTimeSlider4');
  pitchSlider4 = document.getElementById('pitchSlider4');
  octaveSlider4 = document.getElementById('octaveSlider4');
  panSlider4 = document.getElementById('panSlider4');
  volumeSlider4 = document.getElementById('volumeSlider4');

  // Create filter objects
  filter1 = new p5.BandPass();
  filter2 = new p5.BandPass();
   filter3 = new p5.BandPass();
  filter4 = new p5.BandPass();


    // Create filter cutoff sliders
    filterFreqSlider1 = document.getElementById('filterFreqSlider1');
    filterFreqSlider2 = document.getElementById('filterFreqSlider2');
    filterFreqSlider3 = document.getElementById('filterFreqSlider3');
    filterFreqSlider4 = document.getElementById('filterFreqSlider4');

     // Create filter bandwidth sliders
    filterBandwidthSlider1 = document.getElementById('filterBandwidthSlider1');
    filterBandwidthSlider2 = document.getElementById('filterBandwidthSlider2');
    filterBandwidthSlider3 = document.getElementById('filterBandwidthSlider3');
    filterBandwidthSlider4 = document.getElementById('filterBandwidthSlider4');


     // Create the buttons using p5.js
  saveButton = createButton("REC");
  saveButton.class("button");
   autonomousButton = createButton("Start Xhabarabot Mode");
  autonomousButton.class("button");
    startButton = createButton("Start");
  startButton.class("button");


      //Append buttons to the button-container
     let buttonsContainer = document.getElementById("buttons-container");
     buttonsContainer.appendChild(startButton.elt);
    buttonsContainer.appendChild(autonomousButton.elt);
    buttonsContainer.appendChild(saveButton.elt);


     saveButton.mousePressed(toggleMainRecording);
  autonomousButton.mousePressed(() => {
    autonomousMode = !autonomousMode;
    autonomousButton.html(
      autonomousMode ? "Stop Xhabarabot Mode" : "Start Xhabarabot Mode"
    );
  });
   startButton.mousePressed(togglePlay);


   scaleSelect = document.getElementById('scaleSelect');
  scaleSelect.addEventListener('change', (event) => {
    currentScale = event.target.value;
      updateSlidersForScale(currentScale);
  });

       // Get speed slider elements from HTML
     speedSlider1 = document.getElementById('speedSlider1');
     speedSlider2 = document.getElementById('speedSlider2');
     speedSlider3 = document.getElementById('speedSlider3');
      speedSlider4 = document.getElementById('speedSlider4');


    speedSlider1.addEventListener('input', () => {
       currentSpeed1 = parseFloat(speedSlider1.value);
    });
    speedSlider2.addEventListener('input', () => {
         currentSpeed2 = parseFloat(speedSlider2.value);
      });
    speedSlider3.addEventListener('input', () => {
          currentSpeed3 = parseFloat(speedSlider3.value);
       });
      speedSlider4.addEventListener('input', () => {
           currentSpeed4 = parseFloat(speedSlider4.value);
        });

       // Get global tempo slider
        globalTempoSlider = document.getElementById('globalTempoSlider');
         globalTempoSlider.addEventListener('input', () => {
            currentTempo = parseFloat(globalTempoSlider.value);
         });


  // Get file input elements
  fileInput1 = document.getElementById("fileInput1");
  fileInput2 = document.getElementById("fileInput2");
  fileInput3 = document.getElementById("fileInput3");
  fileInput4 = document.getElementById("fileInput4");

  // Add event listeners to handle file uploads
  fileInput1.addEventListener("change", handleFile.bind(null, 1));
  fileInput2.addEventListener("change", handleFile.bind(null, 2));
  fileInput3.addEventListener("change", handleFile.bind(null, 3));
  fileInput4.addEventListener("change", handleFile.bind(null, 4));

      // Set initial slider values based on the default scale
    updateSlidersForScale(currentScale);
    // Set the canvas as ready
    isCanvasReady = true;
}


function togglePlay() {
    isPlaying = !isPlaying;

    if (isPlaying) {
        // Start playing the loaded sounds
        if (sound1.isLoaded()) {
            sound1.play();
            sound1.loop();
        }
        if (sound2.isLoaded()) {
            sound2.play();
            sound2.loop();
        }
        if (sound3.isLoaded()) {
            sound3.play();
            sound3.loop();
        }
        if (sound4.isLoaded()) {
            sound4.play();
            sound4.loop();
        }
    } else {
        sound1.stop();
        sound2.stop();
        sound3.stop();
        sound4.stop();
    }
}

function gradualSlide(slider, target, speed) {
  let currentValue = parseFloat(slider.value);
  let newValue = currentValue + (target - currentValue) * speed;
  slider.value = newValue;
}

function adjustSound() {

  if (sound1.isLoaded()) {
    sound1.rate(parseFloat(pitchSlider1.value) * pow(2, parseFloat(octaveSlider1.value)));
    sound1.amp(parseFloat(volumeSlider1.value));
      sound1.pan(parseFloat(panSlider1.value));
      filter1.process(sound1);
        filter1.freq(parseFloat(filterFreqSlider1.value) * 1000);
        filter1.res(parseFloat(filterBandwidthSlider1.value) * 10);
  }

  if (sound2.isLoaded()) {
    sound2.rate(parseFloat(pitchSlider2.value) * pow(2, parseFloat(octaveSlider2.value)));
    sound2.amp(parseFloat(volumeSlider2.value));
      sound2.pan(parseFloat(panSlider2.value));
      filter2.process(sound2);
        filter2.freq(parseFloat(filterFreqSlider2.value) * 1000);
      filter2.res(parseFloat(filterBandwidthSlider2.value) * 10);
  }

  if (sound3.isLoaded()) {
    sound3.rate(parseFloat(pitchSlider3.value) * pow(2, parseFloat(octaveSlider3.value)));
    sound3.amp(parseFloat(volumeSlider3.value));
      sound3.pan(parseFloat(panSlider3.value));
    filter3.process(sound3);
        filter3.freq(parseFloat(filterFreqSlider3.value) * 1000);
    filter3.res(parseFloat(filterBandwidthSlider3.value) * 10);
  }
  if (sound4.isLoaded()) {
    sound4.rate(parseFloat(pitchSlider4.value) * pow(2, parseFloat(octaveSlider4.value)));
     sound4.amp(parseFloat(volumeSlider4.value));
      sound4.pan(parseFloat(panSlider4.value));
       filter4.process(sound4);
        filter4.freq(parseFloat(filterFreqSlider4.value) * 1000);
    filter4.res(parseFloat(filterBandwidthSlider4.value) * 10);
  }

  delay1.delayTime(parseFloat(delayTimeSlider1.value));
  delay2.delayTime(parseFloat(delayTimeSlider2.value));
  delay3.delayTime(parseFloat(delayTimeSlider3.value));
  delay4.delayTime(parseFloat(delayTimeSlider4.value));
}


function draw() {
    if(!isCanvasReady) return;

  if (!isPlaying) {
    return;
  }
    // Calculate dynamic time based on global tempo
    const baseTempo = 60;
    const tempoRatio = currentTempo / baseTempo;
    let autonomousTime = millis() * 0.002 * tempoRatio;


      patternTimer += 1;
        const beatsPerMinute = currentTempo; // Use the global tempo
      const secondsPerBeat = 60 / beatsPerMinute;
      const timePerStep = secondsPerBeat * 1000;

    if (patternTimer >= timePerStep * rhythmicPatterns[currentPatternIndex1][patternStep1] ) {
          patternStep1 = (patternStep1 + 1) % rhythmicPatterns[currentPatternIndex1].length;
         patternTimer = 0;
          if(patternStep1 == 0) {
             currentPatternIndex1 = floor(random(0, rhythmicPatterns.length));
         }
       }
      if (patternTimer >= timePerStep * rhythmicPatterns[currentPatternIndex2][patternStep2] ) {
        patternStep2 = (patternStep2 + 1) % rhythmicPatterns[currentPatternIndex2].length;
          if(patternStep2 == 0) {
            currentPatternIndex2 = floor(random(0, rhythmicPatterns.length));
        }

       }

  if (autonomousMode) {

      // Calculate target indexes within the scale array
      let pitchIndex1 = (currentNoteIndex1) % scales[currentScale].length;
      let octaveIndex1 = floor(map(sin(autonomousTime * 0.1 + random(-0.1, 0.1)), -1, 1, 0, octaveSteps.length-1));
        let autonomousPan = noise(autonomousTime * 0.3 + 2000) * 2 - 1;
        let filterTarget1 = map(sin(autonomousTime * 0.3+random(-0.1,0.1)),-1,1,0.1,1);
        let filterBandwidthTarget1 = map(cos(autonomousTime * 0.1+random(-0.1,0.1)),-1,1,0.1,1);

       let targetPitch1 = scales[currentScale][pitchIndex1];
       let targetOctave1 = octaveSteps[octaveIndex1]


       let pitchIndex2 = (currentNoteIndex2) % scales[currentScale].length;
      let octaveIndex2 = floor(map(cos(autonomousTime * 0.1 + random(-0.1, 0.1)), -1, 1, 0, octaveSteps.length-1));
         let filterTarget2 = map(sin(autonomousTime * 0.1+random(-0.1,0.1)),-1,1,0.1,1);
       let  filterBandwidthTarget2 = map(cos(autonomousTime * 0.2+random(-0.1,0.1)),-1,1,0.1,1);
        let targetPitch2 = scales[currentScale][pitchIndex2];
        let targetOctave2 = octaveSteps[octaveIndex2];



       let pitchIndex3 = (currentNoteIndex3) % scales[currentScale].length;
        let octaveIndex3 = floor(map(sin(autonomousTime * 0.1 + random(-0.1, 0.1)), -1, 1, 0, octaveSteps.length-1));
           let filterTarget3 = map(cos(autonomousTime * 0.2+random(-0.1,0.1)),-1,1,0.1,1);
       let  filterBandwidthTarget3 = map(sin(autonomousTime * 0.3+random(-0.1,0.1)),-1,1,0.1,1);
        let targetPitch3 = scales[currentScale][pitchIndex3];
        let targetOctave3 = octaveSteps[octaveIndex3];

       let pitchIndex4 = (currentNoteIndex4) % scales[currentScale].length;
       let octaveIndex4 = floor(map(cos(autonomousTime * 0.1 + random(-0.1, 0.1)), -1, 1, 0, octaveSteps.length-1));
           let filterTarget4 = map(cos(autonomousTime * 0.3+random(-0.1,0.1)),-1,1,0.1,1);
       let  filterBandwidthTarget4 = map(sin(autonomousTime * 0.1+random(-0.1,0.1)),-1,1,0.1,1);
       let targetPitch4 = scales[currentScale][pitchIndex4];
        let targetOctave4 = octaveSteps[octaveIndex4];



    gradualSlide(pitchSlider1, targetPitch1, currentSpeed1);
     gradualSlide(octaveSlider1, targetOctave1, currentSpeed1);
    gradualSlide(panSlider1, autonomousPan, currentSpeed1);
      gradualSlide(filterFreqSlider1, filterTarget1, currentSpeed1);
         gradualSlide(filterBandwidthSlider1, filterBandwidthTarget1, currentSpeed1);

     gradualSlide(pitchSlider2, targetPitch2, currentSpeed2);
    gradualSlide(octaveSlider2, targetOctave2, currentSpeed2);
    gradualSlide(panSlider2, -autonomousPan, currentSpeed2);
        gradualSlide(filterFreqSlider2, filterTarget2, currentSpeed2);
           gradualSlide(filterBandwidthSlider2, filterBandwidthTarget2, currentSpeed2);

    gradualSlide(pitchSlider3, targetPitch3, currentSpeed3);
    gradualSlide(octaveSlider3, targetOctave3, currentSpeed3);
    gradualSlide(panSlider3, autonomousPan, currentSpeed3);
       gradualSlide(filterFreqSlider3, filterTarget3, currentSpeed3);
           gradualSlide(filterBandwidthSlider3, filterBandwidthTarget3, currentSpeed3);

    gradualSlide(pitchSlider4, targetPitch4, currentSpeed4);
    gradualSlide(octaveSlider4, targetOctave4, currentSpeed4);
    gradualSlide(panSlider4, -autonomousPan, currentSpeed4);
          gradualSlide(filterFreqSlider4, filterTarget4, currentSpeed4);
          gradualSlide(filterBandwidthSlider4, filterBandwidthTarget4, currentSpeed4);

       if (patternTimer == 0){
             currentNoteIndex1 =  (currentNoteIndex1+1)  % scales[currentScale].length;
             currentNoteIndex2 =  (currentNoteIndex2+2) % scales[currentScale].length;
           currentNoteIndex3 =  (currentNoteIndex3+3)  % scales[currentScale].length;
           currentNoteIndex4 =   (currentNoteIndex4+4) % scales[currentScale].length;
        }

  }

  adjustSound(); // Call this function to adjust the sound whether in autonomous mode or manual mode
}

function toggleMainRecording() {
  if (!isMainRecording) {
    // Start main recording
    mainRecorder.record(mainRecording);
    isMainRecording = true;
      saveButton.html("STOP REC");
  } else {
    // Stop main recording and save the file
    mainRecorder.stop();
    saveSound(mainRecording, "XhabarabotAmbiexRecording.wav");
    isMainRecording = false;
    saveButton.html("REC");
    mainRecording = new p5.SoundFile(); // Reset the recording
  }
}


function handleFile(soundNumber, event) {
  const file = event.target.files[0];
  if (!file) {
    console.log("no file selected");
    return;
  }
  const reader = new FileReader();

  reader.onload = (e) => {
    const fileData = e.target.result;

    loadSound(fileData, (loadedSound) => {
      if (soundNumber === 1) {
        sound1.stop();
        sound1 = loadedSound;
        delay1.process(sound1, 0.12, 0.7, 2300);
        if (isPlaying) {sound1.play(); sound1.loop();};
      } else if (soundNumber === 2) {
        sound2.stop();
        sound2 = loadedSound;
        delay2.process(sound2, 0.12, 0.7, 2300);
        if (isPlaying) {sound2.play(); sound2.loop();};
      } else if (soundNumber === 3) {
        sound3.stop();
        sound3 = loadedSound;
        delay3.process(sound3, 0.12, 0.7, 2300);
        if (isPlaying) {sound3.play(); sound3.loop();};
      } else if (soundNumber === 4) {
        sound4.stop();
        sound4 = loadedSound;
        delay4.process(sound4, 0.12, 0.7, 2300);
        if (isPlaying) {sound4.play(); sound4.loop();};
      }
    },
     () => {
      console.error("Error loading sound");
    });
  };
  reader.readAsDataURL(file);
}
// Function to update slider ranges based on the selected scale
function updateSlidersForScale(scale) {

    // Update the slider values on each scale change
    for (let i = 1; i <= 4; i++) {
          const pitchSlider = document.getElementById(`pitchSlider${i}`);
        const octaveSlider = document.getElementById(`octaveSlider${i}`);
           pitchSlider.value = scales[scale][0];
          octaveSlider.value = octaveSteps[2];
    }
}
