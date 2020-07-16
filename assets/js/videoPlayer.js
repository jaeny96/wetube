const videoContainer = document.getElementById("jsVideoPlayer");
let videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayBtn");
const volumeBtn = document.getElementById("jsVolumeBtn");
const expandBtn = document.getElementById("jsExpandBtn");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class= "fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class= "fas fa-play"></i>';
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.innerHTML = '<i class = "fas fa-volume-up"></i>';
  } else {
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
}

function goExpandClick() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullScreen) {
    videoContainer.webkitRequestFullScreen();
  } else if (videoContainer.msRequestFullScreen) {
    videoContainer.msRequestFullScreen();
  }
  expandBtn.innerHTML = '<i class = "fas fa-compress"></i>';
  expandBtn.removeEventListener("click", goExpandClick);
  expandBtn.addEventListener("click", goExitClick);
}

function goExitClick() {
  expandBtn.innerHTML = '<i class = "fas fa-expand"></i>';
  expandBtn.addEventListener("click", goExpandClick);
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullScreen) {
    document.webkitExitFullScreen();
  } else if (document.msExitFullScreen) {
    document.msExitFullScreen();
  }
}

const formatDate = seconds => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
  currentTime.innerHTML = formatDate(videoPlayer.currentTime);
}

function setTotalTime() {
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 1000);
}

function handelEnded() {
  videoPlayer.currentTime = 0;
}

function init() {
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  expandBtn.addEventListener("click", goExpandClick);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("ended", handelEnded);
}

if (videoContainer) {
  init();
}
