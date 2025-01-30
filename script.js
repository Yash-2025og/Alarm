// DOM Elements
const timeDisplay = document.getElementById('time');
const dateDisplay = document.getElementById('date');
const alarmTimeInput = document.getElementById('alarmTime');
const alarmLabelInput = document.getElementById('alarmLabel');
const setAlarmBtn = document.getElementById('setAlarmBtn');
const alarmList = document.getElementById('alarmList');
const darkModeToggle = document.getElementById('darkModeToggle');
const alarmSound = new Audio("alarm.mp3"); // Use a local file instead of an online link
alarmSound.volume = 1.0; // Ensure volume is high
alarmSound.preload = "auto"; // Preload the audio

let alarms = [];

// Format Time (HH:MM:SS AM/PM)
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
}

// Update Clock
function updateClock() {
  const now = new Date();
  timeDisplay.textContent = formatTime(now);
  dateDisplay.textContent = now.toDateString();
  checkAlarms(now);
}

setInterval(updateClock, 1000);

// Set Alarm
setAlarmBtn.addEventListener('click', () => {
  const alarmTime = alarmTimeInput.value;
  const alarmLabel = alarmLabelInput.value || 'No Label';

  if (!alarmTime) {
    alert('Please select a valid time!');
    return;
  }

  if (!alarms.find((alarm) => alarm.time === alarmTime)) {
    alarms.push({ time: alarmTime, label: alarmLabel });
    displayAlarms();
  } else {
    alert('Alarm already set for this time.');
  }

  alarmTimeInput.value = '';
  alarmLabelInput.value = '';
});

// Display Alarms
function displayAlarms() {
  alarmList.innerHTML = '';
  alarms.forEach((alarm, index) => {
    const li = document.createElement('li');
    li.textContent = `${alarm.time} - ${alarm.label}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      alarms.splice(index, 1);
      displayAlarms();
    });

    const snoozeBtn = document.createElement('button');
    snoozeBtn.textContent = 'Snooze';
    snoozeBtn.classList.add('snooze-btn');
    snoozeBtn.addEventListener('click', () => snoozeAlarm(alarm.time));

    li.appendChild(deleteBtn);
    li.appendChild(snoozeBtn);
    alarmList.appendChild(li);
  });
}

// Check Alarms
function checkAlarms(currentTime) {
  const currentFormattedTime = currentTime.toTimeString().slice(0, 5);
  alarms.forEach((alarm) => {
    if (alarm.time === currentFormattedTime) {
      playAlarm(alarm.label);
    }
  });
}

// Play Alarm Sound with User Interaction Fix
function playAlarm(label) {
  alarmSound.currentTime = 0; // Reset the sound
  alarmSound.play().catch((error) => {
    console.log("Audio play was blocked by the browser:", error);
    alert(`Alarm: ${label} is ringing! Click OK to hear the sound.`);
    alarmSound.play(); // Try playing again after user interaction
  });
}

// Snooze Alarm
function snoozeAlarm(alarmTime) {
  const snoozeMinutes = 5;
  const [hours, minutes] = alarmTime.split(':').map(Number);

  const newAlarmTime = new Date();
  newAlarmTime.setHours(hours, minutes + snoozeMinutes);

  const newTime = `${newAlarmTime.getHours().toString().padStart(2, '0')}:${newAlarmTime
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  alarms.push({ time: newTime, label: 'Snoozed Alarm' });
  displayAlarms();
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
