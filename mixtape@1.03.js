function generateShareURL() {
  const base = window.location.origin + window.location.pathname;
  const soundtracksMap = JSON.parse(
    localStorage.getItem("soundtrackMap") || "{}",
  );
  const bioMap = JSON.parse(localStorage.getItem("bioMap") || "{}");
  const videoMap = JSON.parse(localStorage.getItem("videoMap") || "{}");
  const mixtapeDescription = localStorage.getItem("mixtapeDescription") || "";

  const params = new URLSearchParams();
  if (Object.keys(soundtracksMap).length > 0) {
    params.append(
      "soundtracks",
      encodeURIComponent(Object.keys(soundtracksMap).join("_")),
    );
  }
  if (Object.keys(bioMap).length > 0) {
    params.append("bios", encodeURIComponent(Object.keys(bioMap).join("_")));
  }
  if (Object.keys(videoMap).length > 0) {
    params.append(
      "videos",
      encodeURIComponent(Object.keys(videoMap).join("_")),
    );
  }
  if (mixtapeDescription) {
    params.append("description", encodeURIComponent(mixtapeDescription));
  }

  return `${base}?${params.toString()}`;
}

let generateLinkElements = document.querySelectorAll('[data-generate="link"]');
if (generateLinkElements.length > 0) {
  generateLinkElements.forEach((generateLink) => {
    generateLink.addEventListener("click", function () {
      let linkText = generateLink.querySelector('[data-generate="text"]');
      let linkSuccessText =
        generateLink.getAttribute("data-success") || "Link copied!";
      let shareUrl = generateShareURL();

      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          if (linkText) {
            linkText.textContent = linkSuccessText;
          }
        })
        .catch((err) => {
          console.warn("Failed to copy: ", err);
          if (linkText) {
            linkText.textContent = "Failed to copy link";
          }
        });
    });
  });
}

// Script for actual playlist page
function initializePlyrForElement(videoElement) {
  if (!window.plyrInstancesMap) {
    window.plyrInstancesMap = new Map();
  }
  const player = new Plyr(videoElement, {
    controls: ["play", "progress", "current-time"],
  });
  window.plyrInstancesMap.set(videoElement, player);
}

let videoMap = JSON.parse(localStorage.getItem("videoMap") || "{}");
let bioMap = JSON.parse(localStorage.getItem("bioMap") || "{}");
let soundtracksMap = JSON.parse(localStorage.getItem("soundtrackMap") || "{}");

function initSoundtracks(soundtracksMap) {
  const soundContainer = document.querySelector(".mixtape-sounds");
  const soundTemplate = soundContainer.querySelector(".mixtape-item");
  const soundContainerParent = soundContainer.parentElement;
  const emptyNotice = soundContainerParent.querySelector(
    "[data-mixtape-empty]",
  );

  const entries = Object.entries(soundtracksMap);
  if (entries.length === 0) {
    gsap.set(emptyNotice, { display: "block" });
    gsap.set(soundContainer, { display: "none" });
  } else {
    gsap.set(emptyNotice, { display: "none" });
    entries.forEach(([id, { src, name, project }]) => {
      soundTemplate.remove();
      const newItem = soundTemplate.cloneNode(true);

      const audioPlayer = newItem.querySelector(".audio-player");
      if (audioPlayer) {
        audioPlayer.setAttribute("data-audio-id", id);
        audioPlayer.setAttribute("data-audio-src", src);
        audioPlayer.setAttribute("data-audio-name", name);
        audioPlayer.setAttribute("data-audio-project", project);
        const nameEl = newItem.querySelector(".h-h5");
        const titleEl = newItem.querySelector(".eyebrow_14");
        if (nameEl) {
          nameEl.textContent = name;
        }
        if (titleEl) {
          titleEl.textContent = project;
        }
      }

      soundContainer.appendChild(newItem);
    });
    soundContainer.querySelectorAll(".audio-player").forEach((el) => {
      let audioSrc = el.getAttribute("data-audio-src");
      createPlayer(el, audioSrc);
    });
  }

  // Attach event listeners for individual removal
  soundContainer.querySelectorAll("[data-remove]").forEach((removeBtn) => {
    removeBtn.addEventListener("click", function () {
      const mixtapeItem = this.closest(".mixtape-item");
      if (mixtapeItem) {
        const audioId = mixtapeItem
          .querySelector(".audio-player")
          .getAttribute("data-audio-id");
        mixtapeItem.remove();
        currentPlaying.pause();
        let updatedSoundtracksMap = JSON.parse(
          localStorage.getItem("soundtrackMap") || "{}",
        );
        delete updatedSoundtracksMap[audioId];
        localStorage.setItem(
          "soundtrackMap",
          JSON.stringify(updatedSoundtracksMap),
        );
        updateMixtapeCount();

        if (Object.keys(updatedSoundtracksMap).length === 0) {
          gsap.set(emptyNotice, { display: "block" });
        }
      }
    });
  });

  // Attach event listener for 'remove all'
  const removeAllBtn = soundContainerParent.querySelector("[data-remove-all]");
  removeAllBtn.addEventListener("click", function () {
    soundContainer
      .querySelectorAll(".mixtape-item")
      .forEach((item) => item.remove());
    localStorage.setItem("soundtrackMap", "{}");
    updateMixtapeCount();
    gsap.set(emptyNotice, { display: "block" });
    if (currentPlaying) {
      currentPlaying.pause();
    }
  });
}

//
//

function initBios(bioMap) {
  const bioContainer = document.querySelector(".mixtape-bios");
  const bioTemplate = bioContainer.querySelector(".mixtape-item");
  const bioContainerParent = bioContainer.parentElement;
  const emptyNotice = bioContainerParent.querySelector("[data-mixtape-empty]");

  const entries = Object.entries(bioMap);
  if (entries.length === 0) {
    gsap.set(emptyNotice, { display: "block" });
    gsap.set(bioContainer, { display: "none" });
  } else {
    gsap.set(emptyNotice, { display: "none" });
    entries.forEach(([id, content]) => {
      bioTemplate.remove();
      const newItem = bioTemplate.cloneNode(true);

      const bioNameElement = newItem.querySelector("[data-bio-name]");
      const bioContentElement = newItem.querySelector("[data-bio-content]");
      if (bioNameElement && bioContentElement) {
        bioNameElement.textContent = id;
        bioContentElement.textContent = content;
      }

      bioContainer.appendChild(newItem);
    });
  }

  bioContainer.querySelectorAll("[data-remove]").forEach((removeBtn) => {
    removeBtn.addEventListener("click", function () {
      const mixtapeItem = this.closest(".mixtape-item");
      if (mixtapeItem) {
        const bioId = mixtapeItem.querySelector("[data-bio-name]").textContent;
        mixtapeItem.remove();
        delete bioMap[bioId];
        localStorage.setItem("bioMap", JSON.stringify(bioMap));
        updateMixtapeCount();
        if (Object.entries(bioMap).length === 0) {
          gsap.set(emptyNotice, { display: "block" });
        }
      }
    });
  });

  const removeAllBtn = bioContainerParent.querySelector("[data-remove-all]");
  removeAllBtn.addEventListener("click", function () {
    bioContainer
      .querySelectorAll(".mixtape-item")
      .forEach((item) => item.remove());
    localStorage.setItem("bioMap", "{}");
    updateMixtapeCount();
    gsap.set(emptyNotice, { display: "block" });
  });
}

//
//

function initVideos(videoMap) {
  const videoContainer = document.querySelector(".mixtape-vids");
  const videoTemplate = videoContainer.querySelector(".mixtape-item");
  const videoContainerParent = videoContainer.parentElement;
  const emptyNotice = videoContainerParent.querySelector(
    "[data-mixtape-empty]",
  );

  const entries = Object.entries(videoMap);
  if (entries.length === 0) {
    gsap.set(emptyNotice, { display: "block" });
    gsap.set(videoContainer, { display: "none" });
  } else {
    gsap.set(emptyNotice, { display: "none" });
    entries.forEach(([id, value]) => {
      videoTemplate.remove();
      const newItem = videoTemplate.cloneNode(true);

      const videoEmbed = newItem.querySelector(".mixtape-embed");
      const videoElement = newItem.querySelector(".plyr__video-embed");
      const videoWrap = newItem.querySelector(".vid-wrap");

      if (videoEmbed) {
        videoWrap.setAttribute("data-video-src", value);
        videoWrap.setAttribute("data-video-id", id);
        videoEmbed.setAttribute("title", id);
        videoEmbed.setAttribute(
          "src",
          `https://player.vimeo.com/video/${value}?loop=false&byline=false&portrait=false&title=false&transparent=0&gesture=media`,
        );
        initializePlyrForElement(videoElement);
      }

      videoContainer.appendChild(newItem);
    });
  }

  videoContainer.querySelectorAll("[data-remove]").forEach((removeBtn) => {
    removeBtn.addEventListener("click", function () {
      const mixtapeItem = this.closest(".mixtape-item");
      if (mixtapeItem) {
        const videoId = mixtapeItem
          .querySelector(".vid-wrap")
          .getAttribute("data-video-id");
        mixtapeItem.remove();
        delete videoMap[videoId];
        localStorage.setItem("videoMap", JSON.stringify(videoMap));
        updateMixtapeCount();
        if (Object.entries(videoMap).length === 0) {
          gsap.set(emptyNotice, { display: "block" });
        }
      }
    });
  });

  const removeAllBtn = videoContainerParent.querySelector("[data-remove-all]");
  removeAllBtn.addEventListener("click", function () {
    videoContainer
      .querySelectorAll(".mixtape-item")
      .forEach((item) => item.remove());
    localStorage.setItem("videoMap", "{}");
    updateMixtapeCount();
    gsap.set(emptyNotice, { display: "block" });
  });
}

// SAVE DESCRIPTION
const description = document.querySelector("[data-mixtape-description]");
const saveMixtapeDescription = () => {
  const textContent = description.textContent;
  localStorage.setItem("mixtapeDescription", textContent);
};
const savedDescription = localStorage.getItem("mixtapeDescription");
if (savedDescription) {
  description.textContent = savedDescription;
}

// Event listener for saving content on change
description.addEventListener("input", saveMixtapeDescription);

//
//
// POPULATING FROM URL
function populateSoundtracksFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const soundtrackIDsParam = urlParams.get("soundtracks");

  if (soundtrackIDsParam) {
    const soundtrackIDs = soundtrackIDsParam.split("_");
    const soundtracksMap = {};

    soundtrackIDs.forEach((id) => {
      const element = document.querySelector(
        `#soundtrack-ids [data-audio-id="${id}"]`,
      );
      if (element) {
        const audioSrc = element.getAttribute("data-audio-src");
        const audioName = element.getAttribute("data-audio-name");
        const audioProject = element.getAttribute("data-audio-project");
        soundtracksMap[id] = {
          src: audioSrc,
          name: audioName,
          project: audioProject,
        };
      }
    });

    if (Object.keys(soundtracksMap).length > 0) {
      localStorage.setItem("soundtrackMap", JSON.stringify(soundtracksMap));
    }
  }
}
function populateVideosFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoIDsParam = urlParams.get("videos");
  if (videoIDsParam) {
    const decodedVideoIDsParam = decodeURIComponent(videoIDsParam);
    const videoIDs = decodedVideoIDsParam.split("_");
    const videoMap = {};

    videoIDs.forEach((id) => {
      const element = document.querySelector(
        `#video-ids [data-video-id="${id}"]`,
      );
      if (element) {
        const videoSrc = element.getAttribute("data-video-src");
        videoMap[id] = videoSrc;
      }
    });

    if (Object.keys(videoMap).length > 0) {
      localStorage.setItem("videoMap", JSON.stringify(videoMap));
    }
  }
}
function populateBiosFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const bioIDsParam = decodeURIComponent(urlParams.get("bios"));

  if (bioIDsParam) {
    const bioIDs = bioIDsParam.split("_");
    const bioMap = {};

    bioIDs.forEach((id) => {
      const element = document.querySelector(`#bio-ids [data-bio-id="${id}"]`);
      if (element) {
        const bioContent = element.textContent;
        bioMap[id] = bioContent;
      }
    });

    if (Object.keys(bioMap).length > 0) {
      localStorage.setItem("bioMap", JSON.stringify(bioMap));
    }
  }
}
function populateDescriptionFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const descriptionParam = urlParams.get("description");

  if (descriptionParam) {
    const decodedDescription = decodeURIComponent(descriptionParam);
    localStorage.setItem("mixtapeDescription", decodedDescription);
    if (description) {
      description.textContent = decodedDescription;
    }
  }
}

// CALL ON PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
  populateSoundtracksFromURL();
  populateVideosFromURL();
  populateBiosFromURL();
  populateDescriptionFromURL();

  let updatedVideoMap = JSON.parse(localStorage.getItem("videoMap") || "{}");
  let updatedBioMap = JSON.parse(localStorage.getItem("bioMap") || "{}");
  let updatedSoundtracksMap = JSON.parse(
    localStorage.getItem("soundtrackMap") || "{}",
  );

  initSoundtracks(updatedSoundtracksMap);
  initBios(updatedBioMap);
  initVideos(updatedVideoMap);

  updateMixtapeCount();
});
