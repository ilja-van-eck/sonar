if ('scrollRestoration' in history) {history.scrollRestoration = 'manual';}
document.addEventListener("DOMContentLoaded", function() {window.scrollTo(0, 0);});
window.onbeforeunload = function () {window.scrollTo(0, 0);};

gsap.config({
  nullTargetWarn: false,
});

//
// –––––– NAV STATES
//
const initNavStateToggle = () => {
  const navToggles = document.querySelectorAll("[data-nav-toggle]");
  if (navToggles.length > 0) {
    const toggleNavbar = () => {
      const navbarWrap = document.querySelector(".navbar_wrap");
      if (navbarWrap) {
        const isFullscreen = navbarWrap.getAttribute("fullscreen") === "true";
        navbarWrap.setAttribute("fullscreen", !isFullscreen);
      }
    };

    navToggles.forEach((navToggle) => {
      gsap.to(navToggle, {
        scrollTrigger: {
          trigger: navToggle,
          start: "top top+=5%",
          onEnter: toggleNavbar,
          onLeaveBack: toggleNavbar,
        },
      });
    });
  }
};

//
// –––––– MENU
//
const initNav = () => {
  let menuWrapper = document.querySelector(".menu_wrap");
  let navWrapper = document.querySelector(".navbar_wrap");
  let menuBgLines = menuWrapper.querySelectorAll(".line");
  let menuFade = menuWrapper.querySelectorAll("[data-menu-fade]");
  let menuLow = menuWrapper.querySelectorAll("[data-menu-low]");
  let navInnerBg;
  let navInnerBorder;
  let menuHeadings = menuWrapper.querySelectorAll(".h-h2");
  let navImg = navWrapper.querySelector(".img.is-white");
  let isDarkMode = navWrapper.getAttribute("mode") === "dark";
  let isFullscreen = navWrapper.getAttribute("fullscreen") === "true";
  let isMobile = window.innerWidth < 480;
  let menuOpen = false;
  function chunk(arr, size) {
    let result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(Array.from(arr).slice(i, i + size));
    }
    return result;
  }
  const menuBgLineChunks = chunk(menuBgLines, 5);
  gsap.set(menuHeadings, { y: "100%" });
  gsap.set(".lines-wrapper.is-menu", { y: "110%" });
  gsap.set(menuFade, { opacity: 0, y: "50%" });
  gsap.set(menuLow, { opacity: 0, y: "50%" });

  const menuAnimation = gsap.timeline({
    defaults: {
      ease: "expo.out",
      duration: 0.5,
    },
  });

  const openNav = () => {
    menuOpen = true;
    menuAnimation.clear();
    menuAnimation.progress(0);
    const lineChunckOpen = gsap.timeline();
    navInnerBorder = "efefeb";
    menuBgLineChunks.forEach((chunk, i) => {
      lineChunckOpen.to(
        chunk,
        {
          y: "0vh",
          duration: 0.8,
          ease: "power4.out",
          stagger: {
            amount: 0.1,
            from: "random",
          },
        },
        i * 0.15,
      );
    });
    menuAnimation
      .set(menuWrapper, {
        display: "block",
      })
      .to(menuBgLines, {
        y: "0vh",
        ease: "power4.out",
        duration: 0.8,
        stagger: { amount: 0.6, from: "start" },
        onStart: () => {
          menuBgLineChunks.forEach((chunk) => {
            chunk.forEach((line) => {
              gsap.set(line, {
                y: `${gsap.utils.random(100, 125)}vh`,
              });
            });
          });
        },
      })
      .to(
        ".page",
        {
          scale: 0.92,
          duration: 1,
        },
        0,
      )
      .to(
        ".nav_trigger",
        {
          height: "3.2rem",
          x: isMobile ? "2.2vw" : "0rem",
          duration: 0.5,
          ease: "power2.inout",
        },
        0,
      )
      .to(
        ".nav_line.is-top",
        {
          rotateZ: 45,
          y: "0.18rem",
        },
        0.1,
      )
      .to(
        ".nav_line.is-bottom",
        {
          rotateZ: -45,
          y: "-0.2rem",
        },
        0.1,
      )
      .to(
        menuHeadings,
        {
          y: "0%",
          stagger: 0.05,
          duration: 1,
        },
        "<+=0.4",
      )
      .to(
        menuFade,
        {
          y: "0%",
          opacity: 1,
          stagger: 0.05,
          duration: 0.6,
        },
        "<",
      )
      .to(
        menuLow,
        {
          y: "0%",
          opacity: 0.6,
          stagger: 0.05,
          delay: 0.05,
          duration: 0.6,
          clearProps: "opacity",
        },
        "<",
      )
      .to(
        ".navbar_inner",
        {
          background: isDarkMode ? "#000" : "transparent",
          color: "#efefeb",
        },
        "<-=0.1",
      )
      .to(
        navImg,
        {
          opacity: 1,
          duration: 0.3,
        },
        "<",
      )
      .to(
        ".nav_trigger",
        {
          height: "3.2rem",
          duration: 0.2,
        },
        "<",
      )
      .to(
        ".lines-wrapper.is-menu",
        {
          y: "0%",
          duration: 1,
        },
        "<+=0.2",
      );
  };

  const closeNav = () => {
    menuOpen = false;
    menuAnimation.clear();
    menuAnimation.progress(0);
    let innerBg;
    if (isDarkMode) {
      innerBg = "#181618";
    } else {
      innerBg = "efefeb";
    }
    menuAnimation
      .to(
        menuBgLines,
        {
          y: "100vh",
          duration: 0.5,
          overwrite: true,
          ease: "equalizerOut",
          stagger: { amount: 0.1, from: "random" },
        },
        0,
      )
      .to(
        ".page",
        {
          scale: 1,
          duration: 1.2,
          clearProps: "all"
        },
        0,
      )
      .to(
        ".navbar_inner",
        {
          borderColor: navInnerBorder,
          background: navInnerBg,
          clearProps: "all",
        },
        0,
      )
      .to(
        ".nav_trigger",
        {
          height: "2.4rem",
          x: isMobile ? "0vw" : "0rem",
          duration: 0.5,
          ease: "power2.inout",
        },
        0,
      )
      .to(
        ".nav_line.is-top",
        {
          rotateZ: 0,
          y: "0rem",
        },
        0.1,
      )
      .to(
        ".nav_line.is-bottom",
        {
          rotateZ: 0,
          y: "0rem",
        },
        0.1,
      )
      .to(
        menuHeadings,
        {
          y: "100%",
          duration: 0.6,
          stagger: 0.02,
        },
        0,
      )
      .to(
        [menuFade, menuLow],
        {
          y: "50%",
          opacity: 0,
          stagger: { each: 0.05, from: "end" },
          duration: 0.6,
        },
        0,
      )
      .to(
        navImg,
        {
          opacity: isDarkMode ? 1 : 0,
          duration: 0.3,
        },
        "<",
      )
      .to(
        ".nav_trigger",
        {
          borderColor: isDarkMode
            ? "#efefeb"
            : isFullscreen
              ? "efefeb"
              : "#181618",
          duration: 0.2,
        },
        0,
      )
      .to(
        ".nav_line",
        {
          background: isDarkMode
            ? "#efefeb"
            : isFullscreen
              ? "#efefeb"
              : "181618",
        },
        0,
      )
      .to(
        ".lines-wrapper.is-menu",
        {
          y: "110%",
          duration: 0.8,
        },
        0,
      )
      .set(menuWrapper, {
        display: "none",
      });
  };

  document.querySelector(".nav_trigger").addEventListener("click", () => {
    if (menuOpen) {
      isFullscreen = navWrapper.getAttribute("fullscreen") === "true";
      closeNav();
      navWrapper.classList.remove("open");
    } else {
      let navInner = document.querySelector(".navbar_inner");
      navInnerBg = getComputedStyle(navInner).backgroundColor;
      navInnerBorder = getComputedStyle(navInner).borderColor;
      navWrapper.classList.add("open");
      openNav();
    }
  });
};

//
// –––––– MARQUEES
//
const initMarquees = () => {
  function splitMarqueeText() {
    let marqueeSplit = new SplitType("[data-split-text]", {
      types: "words, chars",
    });
  }
  splitMarqueeText();

  // ————— MARQUEE
  const marqueeLoop = gsap.timeline({
    repeat: -1,
    paused: true,
    onComplete: () => {
      gsap.set(".marquee-panel", { xPercent: 0 });
    },
  });
  marqueeLoop.to(".marquee-panel", {
    xPercent: -100,
    duration: 40,
    ease: "none",
  });

  gsap.utils.toArray(".marquee").forEach((section, index) => {
    const marqueePanels = section.querySelectorAll(".marquee-bg__panel");
    let marqueeLetters = section.querySelectorAll(".char");

    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => marqueeLoop.play(),
      onEnterBack: () => marqueeLoop.play(),
    });

    const marqueeIntro = gsap.timeline({
      paused: true,
      defaults: {
        ease: "expo.out",
        duration: 1.5,
      },
      onStart: () => marqueeLoop.play(),
    });

    marqueeIntro
      .to(marqueePanels, {
        scale: 1.05,
        x: 0,
        overwrite: true,
        stagger: { each: 0.01 },
      })
      .to(
        ".marquee-bg",
        {
          scale: 1,
          x: "0%",
        },
        0,
      )
      .fromTo(
        marqueeLetters,
        { x: "300%", opacity: 1 },
        {
          x: "0%",
          opacity: 1,
          //ease: "power2.out",
          duration: 1,
          stagger: { each: 0.05 },
        },
        0,
      );

    ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      markers: false,
      onEnter: () => marqueeIntro.play(),
    });
  });
};

//
// –––––– FOOTER LINKS
//
const initFooterLinkHover = () => {
  const footerLinks = document.querySelectorAll(".ft_map-link");
  const changeOpacity = (hoveredElement, opacity) => {
    footerLinks.forEach((link) => {
      if (link !== hoveredElement) {
        link.style.opacity = opacity;
      }
    });
  };
  footerLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => changeOpacity(link, 0.3));
    link.addEventListener("mouseleave", () => changeOpacity(link, 1));
  });
};

//
// –––––– SOUND LINES
//
function startAnimation(wrapper) {
  wrapper.querySelectorAll("[data-sound-line]").forEach((element) => {
    element._isAnimating = true;
    animateSoundLine(element);
  });
}

function stopAnimation(wrapper) {
  wrapper.querySelectorAll("[data-sound-line]").forEach((element) => {
    element._isAnimating = false;
    gsap.killTweensOf(element);
  });
}

const animateSoundLine = (element) => {
  const minDuration = parseFloat(element.getAttribute("data-min-duration"));
  const maxDuration = parseFloat(element.getAttribute("data-max-duration"));
  const minDistance = parseFloat(element.getAttribute("data-min-distance"));
  const maxDistance = parseFloat(element.getAttribute("data-max-distance"));

  const duration = Math.random() * (maxDuration - minDuration) + minDuration;
  const distance = Math.random() * (maxDistance - minDistance) + minDistance;

  gsap.to(element, {
    x: `${distance}%`,
    duration: duration,
    ease: "power3.inOut",
    onComplete: () => {
      requestAnimationFrame(() => animateSoundLine(element));
    },
  });
};

document.querySelectorAll("[data-sound-line]").forEach((element) => {
  if (!element.closest(".lines-wrapper.is-work")) {
    animateSoundLine(element);
  }
});

const initGlobalFunctions = () => {
  initNav();
  initNavStateToggle();
  initMarquees();
};

const initDesktopFunctions = () => {
  initFooterLinkHover();
};

const initAll = () => {
  initGlobalFunctions();
  if (window.innerWidth >= 480) {
    initDesktopFunctions();
  } else {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 480) {
        initDesktopFunctions();
      }
    });
  }
};

//
// –––––– MIXTAPE MODAL IN NAV
//
function addModalEventListeners() {
  document.addEventListener("keydown", handleModalEscape);
  lenis.on("scroll", handleModalScroll);
  document.addEventListener("click", handleModalClick);
}

function removeModalEventListeners() {
  document.removeEventListener("keydown", handleModalEscape);
  lenis.off("scroll", handleModalScroll);
  document.removeEventListener("click", handleModalClick);
}

function handleModalEscape(event) {
  if (event.key === "Escape") {
    plModalTimeline.timeScale(1.4).reverse();
    removeModalEventListeners();
  }
}

function handleModalScroll() {
  plModalTimeline.timeScale(1.4).reverse();
  removeModalEventListeners();
}

function handleModalClick(event) {
  if (!plModal.contains(event.target)) {
    plModalTimeline.timeScale(1.4).reverse();
    removeModalEventListeners();
  }
}
const plModal = document.querySelector(".pl_modal");
const plModalTimeline = gsap.timeline({
  paused: true,
  reversed: true,
  onComplete: () => {
    addModalEventListeners();
  },
  onReverseComplete: () => {
    gsap.set(plModal, { display: "none" });
    removeModalEventListeners();
  },
});
plModalTimeline.set(plModal, { display: "flex" }).fromTo(
  plModal,
  { opacity: 0, yPercent: -10 },
  {
    opacity: 1,
    yPercent: 0,
    duration: 0.6,
    ease: "expo.out",
  },
);
document
  .querySelector(".pl_icon.is--toggle")
  .addEventListener("click", plToggle);
function plToggle() {
  if (plModalTimeline.reversed()) {
    plModalTimeline.timeScale(1).play();
  } else {
    plModalTimeline.timeScale(1.4).reverse();
  }
}

//
// –––––– MIXTAPE COUNT
//
function updateMixtapeCount() {
  const bioMap = JSON.parse(localStorage.getItem("bioMap") || "{}");
  const videoMap = JSON.parse(localStorage.getItem("videoMap") || "{}");
  const soundtracksMap = JSON.parse(
    localStorage.getItem("soundtrackMap") || "{}",
  );

  const totalCount =
    Object.keys(soundtracksMap).length +
    Object.keys(videoMap).length +
    Object.keys(bioMap).length;

  const countDivs = document.querySelectorAll("[data-pl-count]");
  countDivs.forEach((countDiv) => {
    countDiv.textContent = totalCount;
  });
}
updateMixtapeCount();
