let simulateClick = (element) => {
  console.log("simulateClick called on", element);
  let event = new Event("click", { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
};

let lastScrollY = window.scrollY;
let nativeScrollListener = () => {
  let currentScrollY = window.scrollY;
  let distance = Math.abs(currentScrollY - lastScrollY);
  if (distance > 20 || distance < 20) {
    let el = document.querySelector('[data-quickview="trigger"].active');
    console.log(
      "Before simulateClick on Scroll, active class present:",
      el && el.classList.contains("active")
    );
    simulateClick(el);
  }
  lastScrollY = currentScrollY;
};

let attachConditionalListeners = () => {
  let escKeyListener = (e) => {
    if (e.key === "Escape") {
      let el = document.querySelector('[data-quickview="trigger"].active');
      console.log(
        "Before simulateClick on Escape, active class present:",
        el && el.classList.contains("active")
      );
      simulateClick(el);
    }
  };

  document.addEventListener("keydown", escKeyListener);
  document.addEventListener("scroll", nativeScrollListener);

  return () => {
    document.removeEventListener("keydown", escKeyListener);
    document.removeEventListener("scroll", nativeScrollListener);
  };
};

document.addEventListener("DOMContentLoaded", function () {
  let triggers = document.querySelectorAll('[data-quickview="trigger"]');
  let removeConditionalListeners;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Trigger clicked", this);
      trigger.classList.add("active");

      let isQuickView = document.body.classList.contains("quickview");
      let item = this.closest('[data-quickview="item"]');
      let link = item
        .querySelector('[data-quickview="link"]')
        .getAttribute("href");
      let quickviewNav = document.querySelector("[data-quickview-nav]");
      let quickviewLink = quickviewNav.querySelector(".cta_link");

      if (isQuickView) {
        console.log("Closing quickview");
        document.body.classList.remove("quickview");
        trigger.classList.remove("active");
        if (removeConditionalListeners) {
          removeConditionalListeners();
        }
      } else {
        console.log("Opening quickview");
        let blockTop = this.getBoundingClientRect().top;
        let scrollY = window.pageYOffset || document.documentElement.scrollTop;
        let quartViewport = window.innerHeight / 4;
        let scrollTarget = Math.round(scrollY + blockTop - quartViewport);
        quickviewLink.href = link;

        lenis.scrollTo(scrollTarget, {
          duration: 0.6,
          lock: true,
          force: true,

          onComplete: () => {
            document.body.classList.add("quickview");
            setTimeout(() => {
              lastScrollY = window.scrollY; // Reset lastScrollY here after scrollTo animation
              removeConditionalListeners = attachConditionalListeners();
            }, 100);
          },
        });
      }
    });
  });

  let qvClose = document.querySelector(".qv-close");
  if (qvClose) {
    qvClose.addEventListener("click", function () {
      if (document.body.classList.contains("quickview")) {
        let activeTrigger = document.querySelector(
          '[data-quickview="trigger"].active'
        );
        console.log(
          "Before simulateClick on Close icon, active class present:",
          activeTrigger && activeTrigger.classList.contains("active")
        );

        simulateClick(activeTrigger);
      }
    });
  }
});

// document.addEventListener("DOMContentLoaded", function () {
//   let triggers = document.querySelectorAll('[data-quickview="trigger"]');
//   let removeConditionalListeners;

//   triggers.forEach((trigger) => {
//     trigger.addEventListener("click", function (e) {
//       e.preventDefault();

//       let isQuickView = document.body.classList.contains("quickview");
//       let item = this.closest('[data-quickview="item"]');
//       let link = item
//         .querySelector('[data-quickview="link"]')
//         .getAttribute("href");
//       let quickviewNav = document.querySelector("[data-quickview-nav]");
//       let quickviewLink = quickviewNav.querySelector(".cta_link");

//       if (isQuickView) {
//         document.body.classList.remove("quickview");
//         trigger.classList.remove("active");
//         window.removeEventListener("scroll", nativeScrollListener);
//         if (removeConditionalListeners) {
//           removeConditionalListeners();
//         }
//       } else {
//         trigger.classList.add("active");
//         let blockTop = this.getBoundingClientRect().top;
//         let scrollY = window.pageYOffset || document.documentElement.scrollTop;
//         let quartViewport = window.innerHeight / 4;
//         let scrollTarget = Math.round(scrollY + blockTop - quartViewport);
//         quickviewLink.href = link;

//         window.addEventListener("scroll", nativeScrollListener);
//         lastScrollY = window.scrollY;

//         lenis.scrollTo(scrollTarget, {
//           duration: 0.6,
//           lock: true,
//           force: true,

//           onComplete: () => {
//             document.body.classList.add("quickview");
//             removeConditionalListeners = attachConditionalListeners();
//           },
//         });
//       }
//     });
//   });
// });

// let qvClose = document.querySelector(".qv-close");
// qvClose.addEventListener("click", function () {
//   let activeCellTrigger = document.querySelector(".cell_trigger.active");
//   if (activeCellTrigger) {
//     activeCellTrigger.click();
//   }

//   let activeQuickviewTrigger = document.querySelector(
//     ".quickview-trigger.active"
//   );
//   if (activeQuickviewTrigger) {
//     activeQuickviewTrigger.click();
//   }
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const blocks = document.querySelectorAll("[data-quickview]");
//   let removeConditionalListeners;

//   blocks.forEach((block) => {
//     block.addEventListener("click", function (e) {
//       e.preventDefault();
//       const isQuickView = document.body.classList.contains("quickview");
//       let img = this.querySelector(".cell_img-wrap");

//       if (isQuickView) {
//         lenis.start();
//         document.body.classList.remove("quickview");
//         gsap.to(img, { autoAlpha: 1, duration: 0.6, ease: "expo.out" });

//         if (removeConditionalListeners) {
//           removeConditionalListeners();
//         }
//       } else {
//         const blockTop = this.getBoundingClientRect().top;
//         const scrollY =
//           window.pageYOffset || document.documentElement.scrollTop;
//         const halfViewportHeight = window.innerHeight / 2;
//         const scrollTarget = Math.round(
//           scrollY + blockTop - halfViewportHeight + 100
//         );
//         gsap.to(img, { autoAlpha: 0, duration: 0.6, ease: "expo.out" });

//         lenis.scrollTo(scrollTarget, {
//           duration: 0.6,
//           lock: true,
//           force: true,

//           onComplete: () => {
//             document.body.classList.add("quickview");
//             removeConditionalListeners = attachConditionalListeners();
//           }
//         });
//       }
//     });
//   });
// });
