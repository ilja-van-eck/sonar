let isListOpen = false;
const soundtrackButton = document.querySelector("[data-soundtrack-button]");
const openState = document.querySelector(".st-open");
const originalParent = document.querySelector(".soundtrack-list");

function toggleList() {
  if (!isListOpen) {
    openState.style.display = "block";
    const state = Flip.getState(".st-list__inner");
    openState.appendChild(document.querySelector(".st-list__inner"));
    Flip.from(state, {
      absolute: true,
      duration: 1,
      ease: "expo.out",
      onStart: () => {
        gsap.to(".st-list__item", {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: { each: 0.1 },
        });
      },
    });
  } else {
    const state = Flip.getState(".st-list__inner");
    gsap.to(".st-list__item", {
      autoAlpha: 0,
      y: "50%",
      duration: 0.4,
      ease: "power2.in",
      stagger: { each: 0.05, from: "end" },
      onComplete: () => {
        originalParent.appendChild(document.querySelector(".st-list__inner"));
        Flip.from(state, {
          absolute: true,
          duration: 1,
          ease: "expo.out",
          onComplete: () => {
            openState.style.display = "none";
          },
        });
      },
    });
  }
  isListOpen = !isListOpen;
}
if (soundtrackButton) {
  soundtrackButton.addEventListener("click", toggleList);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && isListOpen) {
    toggleList();
  }
});

document.addEventListener("click", function (event) {
  if (isListOpen && !event.target.closest(".st-list__inner")) {
    toggleList();
  }
});

let players = [];
let currentPlaying = null;
let isDragging;

function createPlayer(audioElement, audioSrc) {
  let player = new Howl({
    src: [audioSrc],
    html5: true,
    onplay: () => {
      updateCurrentPlaying(player, audioElement);
    },
    onend: () => {
      resetPlayerUI(audioElement);
    },
  });

  player._audioElement = audioElement;
  attachPlayerEvents(player, audioElement);
  players.push(player);
  return player;
}

function updateCurrentPlaying(newPlayer, newAudioElement) {
  if (currentPlaying && currentPlaying !== newPlayer) {
    currentPlaying.pause();

    let prevAudioElement = currentPlaying._audioElement;
    let prevAudioLines = prevAudioElement.parentElement.querySelector(
      ".lines-wrapper.is-work",
    );
    let prevPlayBtn = prevAudioElement.querySelector(".audio-btn__wrap");
    prevPlayBtn.classList.remove("playing");
    stopAnimation(prevAudioLines);
  }
  currentPlaying = newPlayer;
  let newPlayBtn = newAudioElement.querySelector(".audio-btn__wrap");
  newPlayBtn.classList.add("playing");
  let newAudioLines = newAudioElement.parentElement.querySelector(
    ".lines-wrapper.is-work",
  );
  startAnimation(newAudioLines);
}

function attachPlayerEvents(player, audioElement) {
  let playBtn = audioElement.querySelector(".audio-btn__wrap");
  let progressBar = audioElement.querySelector(".audio-progress");
  let progressContainer = audioElement.querySelector(".audio-track");
  let linesWrapper = audioElement.parentElement.querySelector(
    ".lines-wrapper.is-work",
  );

  playBtn.addEventListener("click", () => {
    if (player.playing()) {
      player.pause();
      playBtn.classList.remove("playing");
      stopAnimation(linesWrapper);
    } else {
      player.play();
      playBtn.classList.add("playing");
      startAnimation(linesWrapper);
    }
  });

  player.on("play", () => {
    requestAnimationFrame(() => updateProgressBar(player, progressBar));
  });

  isDragging = false;

  progressContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateProgress(e, player, progressBar, progressContainer);
  });
  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      updateProgress(e, player, progressBar, progressContainer);
    }
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Add equivalent touch events for mobile browsers
  progressContainer.addEventListener("touchstart", (e) => {
    isDragging = true;
    updateProgress(e, player, progressBar, progressContainer);
  });
  document.addEventListener("touchmove", (e) => {
    if (isDragging) {
      updateProgress(e, player, progressBar, progressContainer);
    }
  });
  document.addEventListener("touchend", () => {
    isDragging = false;
  });
}

function updateProgress(e, player, progressBar, progressContainer) {
  let containerRect = progressContainer.getBoundingClientRect();
  let offsetX = (e.clientX || e.touches[0].clientX) - containerRect.left;
  let progress = offsetX / containerRect.width;
  progress = Math.max(0, Math.min(1, progress));

  progressBar.style.width = progress * 100 + "%";

  let seekTime = player.duration() * progress;
  player.seek(seekTime);
}

function updateProgressBar(player, progressBar) {
  if (!isDragging && player.playing()) {
    let progress = (player.seek() / player.duration()) * 100;
    progressBar.style.width = progress + "%";
    requestAnimationFrame(() => updateProgressBar(player, progressBar));
  }
}

function resetPlayerUI(audioElement) {
  let progressBar = audioElement.querySelector(".audio-progress");
  progressBar.style.width = "0%";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".audio-player").forEach((el) => {
    let audioSrc = el.getAttribute("data-audio-src");
    createPlayer(el, audioSrc);
  });
});
