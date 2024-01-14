document.addEventListener("DOMContentLoaded", function () {
  // Soundtracks
  document.querySelectorAll("[data-mixtape-sound]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const btnParent = this.parentElement;
      const audioElement = btnParent.previousElementSibling;
      if (audioElement && audioElement.hasAttribute("data-audio-id")) {
        const audioID = audioElement.getAttribute("data-audio-id");
        const audioSrc = audioElement.getAttribute("data-audio-src");

        const soundtracksMap = JSON.parse(
          localStorage.getItem("soundtrackMap") || "{}"
        );
        const wasEmpty = Object.keys(soundtracksMap).length === 0;
        if (
          wasEmpty &&
          Object.keys(
            JSON.parse(localStorage.getItem("soundtracksMap") || "{}")
          ).length === 0
        ) {
          plModalTimeline.play();
        }

        soundtracksMap[audioID] = audioSrc;
        localStorage.setItem("soundtrackMap", JSON.stringify(soundtracksMap));
        updateMixtapeCount();
      }
    });
  });

  // Add bio to mixtape
  document.querySelectorAll("[data-mixtape-bio]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const grandParentElement = this.parentElement.parentElement;
      const bioElement = grandParentElement.querySelector("[data-bio-id]");
      if (bioElement) {
        const bioID = bioElement.getAttribute("data-bio-id");
        const bioContent = bioElement.textContent;

        const bioMap = JSON.parse(localStorage.getItem("bioMap") || "{}");
        const wasEmpty = Object.keys(bioMap).length === 0;
        if (
          wasEmpty &&
          Object.keys(JSON.parse(localStorage.getItem("bioMap") || "{}"))
            .length === 0
        ) {
          plModalTimeline.play();
        }

        bioMap[bioID] = bioContent;
        localStorage.setItem("bioMap", JSON.stringify(bioMap));
        updateMixtapeCount();
      }
    });
  });

  // Add video to mixtape
  document.querySelectorAll("[data-mixtape-video]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const parent = this.parentElement.parentElement;
      const videoWrapper = parent.querySelector(".plyr");
      if (videoWrapper) {
        const videoId = videoWrapper.getAttribute("data-video-id");
        const videoSrc = videoWrapper.getAttribute("data-video-src");

        const videoMap = JSON.parse(localStorage.getItem("videoMap") || "{}");
        const wasEmpty = Object.keys(videoMap).length === 0;
        if (
          wasEmpty &&
          Object.keys(JSON.parse(localStorage.getItem("videoMap") || "{}"))
            .length === 0
        ) {
          plModalTimeline.play();
        }

        videoMap[videoId] = videoSrc;
        localStorage.setItem("videoMap", JSON.stringify(videoMap));
        updateMixtapeCount();
      }
    });
  });
});
