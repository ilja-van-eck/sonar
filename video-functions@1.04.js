document.addEventListener("DOMContentLoaded", () => {
  let screenSize = window.innerWidth;
  let page = document.querySelector(".page").getAttribute("data-page");

  function removeDuplicateScripts() {
    const scripts = document.querySelectorAll(
      'script[src*="player.vimeo.com/api/player.js"]',
    );
    const srcSet = new Set();

    scripts.forEach((script) => {
      if (srcSet.has(script.src)) {
        script.parentNode.removeChild(script);
      } else {
        srcSet.add(script.src);
      }
    });
  }

  const videoPlayers = Array.from(
    document.querySelectorAll(".plyr__video-embed"),
  );
  const plyrInstancesMap = new Map();

  if (page === "work") {
    if (screenSize > 991) {
      videoPlayers.forEach((video) => {
        const player = new Plyr(video, {
          controls: ["play", "progress", "current-time", "mute", "fullscreen"],
        });
        plyrInstancesMap.set(video, player);
      });
      window.plyrInstancesMap = plyrInstancesMap;
    }
  } else {
    videoPlayers.forEach((video) => {
      const player = new Plyr(video, {
        controls: ["play", "progress", "current-time", "mute", "fullscreen"],
      });
      plyrInstancesMap.set(video, player);
    });
    window.plyrInstancesMap = plyrInstancesMap;
  }

  //removeDuplicateScripts();

  //
  //
  //

  const initVideoPreview = () => {
    let hoverScaleZ = 5;
    let activeElement = null;
    const hoverScalePreview = gsap.timeline({
      defaults: { ease: "expo.out", duration: 0.8 },
      onComplete: () => (activeElement = null),
    });

    function hoverScaleEnter(e) {
      if (window <= 479) return;
      const target = e.currentTarget;
      const info = target.querySelector(".bd_item-info");
      const img = target.querySelector(".hover-preview__img");
      const vidWrap = target.querySelector(".vid-wrap");
      const videoWrapper = target.querySelector(
        ".plyr.plyr--full-ui.plyr--video.plyr--vimeo",
      );
      const player = plyrInstancesMap.get(videoWrapper);
      hoverScaleZ++;
      const enterTimeline = gsap.timeline({
        defaults: { ease: "expo.out", duration: 0.8 },
      });
      enterTimeline
        .to(target, { scaleX: 1.4, scaleY: 1.15, zIndex: hoverScaleZ })
        .to(info, { scaleX: 0.714, scaleY: 0.869 }, 0)
        .to(vidWrap, { scaleX: 1, scaleY: 1.15 }, 0)
        .to(
          img,
          {
            autoAlpha: 0,
            scaleX: 1,
            duration: 0.4,
            onStart: () => {
              player.muted = true;
              player.volume = 0;
              player.play();
            },
          },
          0,
        );
    }

    function hoverScaleLeave(e) {
      const target = e.currentTarget;
      const info = target.querySelector(".bd_item-info");
      const img = target.querySelector(".hover-preview__img");
      const vidWrap = target.querySelector(".vid-wrap");
      const videoWrapper = target.querySelector(
        ".plyr.plyr--full-ui.plyr--video.plyr--vimeo",
      );
      const player = plyrInstancesMap.get(videoWrapper);
      const leaveTimeline = gsap.timeline({
        defaults: { ease: "expo.out", duration: 0.8 },
      });
      leaveTimeline
        .to([target, info, vidWrap], {
          scaleX: 1,
          scaleY: 1,
          onStart: () => {
            player.pause();
            player.volume = 1;
          },
        })
        .to(
          img,
          { scaleX: 1.2, autoAlpha: 1, duration: 0.2, overwrite: true },
          0,
        );
    }
    document.querySelectorAll("[data-hover-scale]").forEach((item) => {
      item.addEventListener("mouseenter", hoverScaleEnter);
      item.addEventListener("mouseleave", hoverScaleLeave);
    });

    // -------- LARGE PREVIEW IMAGE WITH VIDEO
    const largePreviewItems = gsap.utils.toArray('[data-preview="full-bleed"]');
    largePreviewItems.forEach((item, index) => {
      let img = item.querySelector('[data-preview="img"]');
      let icon = item.querySelector('[data-preview="icon"]');
      let gradient = item.querySelector('[data-preview="gradient"]');
      const videoWrapper = item.querySelector(
        ".plyr.plyr--full-ui.plyr--video.plyr--vimeo",
      );
      const player = plyrInstancesMap.get(videoWrapper);

      item.addEventListener("mouseenter", () => {
        const largePreviewIn = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.inOut", duration: 0.6 },
        });
        largePreviewIn
          .to(gradient, { opacity: 0 })
          .fromTo(
            icon,
            { scale: 0, rotate: -90 },
            { scale: 1, rotate: 0, ease: "expo.out" },
            0,
          )
          .to(
            img,
            {
              opacity: 0,
              ease: "ease",
              onStart: () => {
                player.muted = true;
                player.volume = 0;
                player.play();
              },
            },
            0,
          );
        largePreviewIn.play();
      });

      item.addEventListener("mouseleave", () => {
        const largePreviewOut = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.inOut", duration: 0.6, overwrite: true },
        });
        largePreviewOut
          .to(gradient, { opacity: 1 })
          .to(icon, { scale: 0, rotate: -90, ease: "expo.out" }, 0)
          .to(
            img,
            {
              opacity: 1,
              ease: "ease",
              duration: 0.2,
              onComplete: () => {
                player.pause();
                player.currentTime = 0;
                player.volume = 1;
              },
            },
            0,
          );
        largePreviewOut.play();
      });
    });
  };

  const initParallaxColumns = () => {
    let colItems = document.querySelectorAll(".three-col_item");
    if (colItems.length > 0) {
      colItems[0].classList.add("is--active");
      colItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          const bgImage = item.querySelector(".bg-img");
          const videoWrapper = item.querySelector(
            ".plyr.plyr--full-ui.plyr--video.plyr--vimeo",
          );
          const player = plyrInstancesMap.get(videoWrapper);
          if (player) {
            player.muted = true;
            player.volume = 0;
            player.play();
          }
          gsap.to(bgImage, {
            opacity: 0,
            duration: 0.2,
            delay: 0.7,
          });
          document.querySelectorAll(".three-col_item").forEach((otherItem) => {
            otherItem.classList.remove("is--active");
          });
          item.classList.add("is--active");
        });
        item.addEventListener("mouseleave", () => {
          const videoWrapper = item.querySelector(
            ".plyr.plyr--full-ui.plyr--video.plyr--vimeo",
          );
          const player = plyrInstancesMap.get(videoWrapper);
          const bgImage = item.querySelector(".bg-img");

          if (player && !player.paused) {
            player.pause();
          }
          gsap.to(bgImage, {
            opacity: 1,
            duration: 0.1,
            overwrite: true,
          });
        });
      });
    }
  };

  if (screenSize >= 480) {
    initVideoPreview();
    initParallaxColumns();
  }
});
