const timeOutput = document.getElementById("timer");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const header = document.getElementById("head");
const progressOutput = document.getElementById("counter");
const banner = document.getElementById("banner");
const bannerText = document.getElementById("banner-text");
const closeBannerBtn = document.getElementById("close-banner");
const alarmSound =  new Audio('assets/meow.mp3');

const urlParams = new URLSearchParams(window.location.search);
let totalPomodoros = parseInt(urlParams.get('totalPomodoros')) || 1;
let pomodoroType = parseInt(urlParams.get('pomodoroType')) || 25;

const STARTTIMEWORK25 = 5; // 25 minutes, 1500s
const STARTTIMEBREAK5 = 2;  // 5  minutes, 300s
const STARTTIMEWORK50 = 3000; // 50 minutes, 3000s
const STARTTIMEBREAK10 = 600; // 10 minutes, 600s

let WORKTIME;
let BREAKTIME;
let timerValue; 
let currentTime;
let timer = null
let isWorkPhase = true;
let pomodoroCounter = 0;
let startTime;
let timerValueAtStart;

stopButton.disabled = true;
resetButton.disabled = true;

function updateDisplay() {
    let minutes = Math.floor(timerValue / 60);
    let seconds = timerValue % 60;
    timeOutput.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    header.textContent = `${isWorkPhase ? 'Working' : 'Relaxing'}`;
    progressOutput.textContent = `${pomodoroCounter}/${totalPomodoros} Pomodoros finished!`;
}

function showBanner(message) {
    bannerText.textContent = message;
    banner.classList.remove("hidden");
    alarmSound.play();
}

function setPomodoroType() {
    if(pomodoroType===25) {
        WORKTIME = STARTTIMEWORK25;
        BREAKTIME = STARTTIMEBREAK5;
    } else {
        WORKTIME = STARTTIMEWORK50;
        BREAKTIME = STARTTIMEBREAK10;
    }
    timerValue = WORKTIME;
    currentTime = WORKTIME;
}

function switchWorkphase() {
    isWorkPhase = !isWorkPhase;
    startButton.disabled = false;

    if(isWorkPhase) {
        timerValue = WORKTIME;
        currentTime = WORKTIME;
        showBanner("Your break is over. Time to continue work!");   
    } else {
        timerValue = BREAKTIME;
        currentTime = BREAKTIME;
        pomodoroCounter++;
        if(pomodoroCounter == totalPomodoros) {
            showBanner("Great! You've reached your Pomodoro Goal for this session! :3");
        } else {
            showBanner("Your worktime is over. Time for a break!");       
        }
    }

    updateDisplay();
}


startButton.addEventListener("click", () => { 
    alarmSound.load();
    if(timer !== null) {
        return; // prevents multiple timer
    }

    startButton.disabled = true;
    stopButton.disabled = false;
    resetButton.disabled = false;

    startTime = Date.now();
    timerValueAtStart = timerValue;

    timer = setInterval(() => {
        const secondsPassed = Math.floor((Date.now() - startTime) / 1000);
        timerValue = timerValueAtStart - secondsPassed;

    if (timerValue <= 0) {
        timerValue = 0;
        clearInterval(timer);
        timer = null;
        switchWorkphase();
    }
    updateDisplay();
    }, 100); // recalls every 10 second (100ms)
})

stopButton.addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    stopButton.disabled = true;
    startButton.disabled = false;
})

resetButton.addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    timerValue = currentTime;
    stopButton.disabled = true;
    resetButton.disabled = true;
    startButton.disabled = false;
    updateDisplay();
})

closeBannerBtn.addEventListener("click", () => {
    banner.classList.add("hidden");
})

setPomodoroType();
updateDisplay();

document.getElementById('totalPomodoros').textContent = totalPomodoros;
document.getElementById('pomodoroStartTimeWork').textContent = WORKTIME / 60;

