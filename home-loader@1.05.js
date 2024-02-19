CustomEase.create("load", "0.46, 0.03, 0, 1");

lenis.stop();

let animations = [];
let animationElements = document.querySelectorAll("[data-loader-lottie]");

animationElements.forEach((el, index) => {
  let animation = lottie.loadAnimation({
    container: el,
    renderer: "canvas",
    loop: false,
    autoplay: false,
    path: el.getAttribute("data-animation-path"),
  });
  animations[index] = animation;

  animation.addEventListener("DOMLoaded", function () {
    let speed = parseFloat(el.getAttribute("data-animation-speed"));
    animation.setSpeed(speed);
  });

  animations.push(animation);
});

// Register variables
let page = document.querySelector(".page");
let loadWrapper = document.querySelector(".loader");
let loaderBottomItems = document.querySelectorAll("[data-load-bottom]");
let loaderLogoLeft = document.querySelector('[data-load-logo="left"]');
let loaderLogoCenter = document.querySelector('[data-load-logo="center"]');
let loaderLogoRight = document.querySelector('[data-load-logo="right"]');
let loaderBorder = document.querySelectorAll("[data-load-border]");
let loadHero = document.querySelector("[data-load-hero]");
let loadHeroOverlay = document.querySelector("[data-load-hero-overlay]");
let loadHeroBg = document.querySelector("[data-load-hero-bg]");
let loadHeroContent = document.querySelector("[data-load-hero-content]");
let loadHeroFade = document.querySelectorAll("[data-hero-fade]");
let loadCenterShape = document.querySelector("[data-load-center-x]");
let loadReveal = document.querySelector("[data-load-reveal]");
let loadPlaceholder = document.querySelector("[data-load-placeholder]");
let nav = document.querySelector(".navbar_wrap");
let pageloadTimeline;
const isMobile = window.innerWidth < 480;

// Page load timeline
pageloadTimeline = gsap.timeline({
  defaults: {
    ease: "load",
    duration: 0.6,
  },
  onComplete: () => {
    lenis.start();
    gsap.set(loadWrapper, { display: "none" });
    initAll();
  },
});

pageloadTimeline
  .to(loaderBottomItems, {
    opacity: 1,
    y: 0,
    stagger: { each: 0.1, from: "center" },
  })
  .to(
    "[data-load-logo]",
    {
      opacity: 1,
      stagger: { each: 0.1 },
    },
    0,
  )
  .add(() => {
    animations.forEach((animation, index) => {
      gsap.to(
        {},
        {
          delay: index * 0.15,
          onComplete: () => {
            animation.play();
          },
        },
      );
    });
  }, 0)
  .set(
    ".load-o__lottie",
    {
      visibility: "hidden",
    },
    1.7,
  )
  .to(
    loaderLogoLeft,
    {
      xPercent: -290,
      duration: 1,
    },
    ">+1.5",
  )
  .to(
    loaderLogoRight,
    {
      xPercent: 200,
      duration: 1,
    },
    "<",
  )
  .to(
    loaderLogoCenter,
    {
      xPercent: 96.5,
      duration: 1,
    },
    "<",
  )
  .to(
    loadCenterShape,
    {
      rotate: 160,
      duration: 0.8,
      onStart: () => {
        gsap.set(loadHero, { rotate: -20 });
        gsap.set(loadHeroBg, { rotate: 20, yPercent: -3, scale: 1.08 });
        gsap.set(loadHeroContent, { rotate: 20 });
      },
      onComplete: () => {
        gsap.set(loadReveal, { display: "none" });
        gsap.set(loadHero, { opacity: 1 });
      },
    },
    ">+=0.2",
  )
  .to(
    loaderBorder,
    {
      scaleX: isMobile ? 50 : 40,
      scaleY: isMobile ? 80 : 40,
      duration: 1.6,
      z: 1,
      stagger: { each: 0.01, from: "end" },
    },
    ">+0.2",
  )
  .to(
    loadHero,
    {
      width: "100vw",
      height: "100vh",
      rotate: 0,
      z: 1,
      duration: 1.6,
    },
    "<",
  )
  .to(
    loadHeroBg,
    {
      rotate: 0,
      yPercent: 0,
      scale: 1,
      duration: 1.6,
      z: 1,
    },
    "<",
  )
  .to(
    loadHeroContent,
    {
      rotate: 0,
      duration: 1.6,
      z: 1,
    },
    "<",
  )
  .to(
    loadHeroOverlay,
    {
      opacity: 0,
      duration: 1.6,
    },
    "<",
  )
  .to(
    "[data-load-reveal-vertical]",
    {
      scale: 0,
      duration: 0.1,
    },
    "<+=0.1",
  )
  .to(
    loaderBottomItems,
    {
      yPercent: 100,
      opacity: 0,
      stagger: { eacH: 0.05, from: "center" },
    },
    "<+=0.1",
  )
  .to(
    loadPlaceholder,
    {
      y: "0%",
      opacity: 1,
      duration: 0.8,
      ease: "expo.out",
    },
    ">",
  )
  .from(
    ".navbar_inner",
    {
      y: "-50%",
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
    },
    "<",
  )
  .from(
    loadHeroFade,
    {
      opacity: 0,
      y: "50%",
      duration: 1,
      stagger: 0.05,
      z: 1,
      ease: "expo.out",
    },
    ">-=0.6",
  );
