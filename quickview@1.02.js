let simulateClick = (element) => {
  let event = new Event("click", { bubbles: true, cancelable: true });
  element.dispatchEvent(event);

  let quickviewWraps = document.querySelectorAll(".qv_item");
  quickviewWraps.forEach((el) => {
    const videoWrapper = el.querySelector(
      ".plyr.plyr--full-ui.plyr--video.plyr--vimeo",
    );
    const player = plyrInstancesMap.get(videoWrapper);
    player.pause();
  });
};

let lastScrollY = window.scrollY;
let nativeScrollListener = () => {
  let currentScrollY = window.scrollY;
  let distance = Math.abs(currentScrollY - lastScrollY);
  if (distance > 20 || distance < 20) {
    let el = document.querySelector('[data-quickview="trigger"].active');
    simulateClick(el);
  }
  lastScrollY = currentScrollY;
};

let attachConditionalListeners = () => {
  let escKeyListener = (e) => {
    if (e.key === "Escape") {
      let el = document.querySelector('[data-quickview="trigger"].active');
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
      trigger.classList.add("active");

      let isQuickView = document.body.classList.contains("quickview");
      let item = this.closest('[data-quickview="item"]');
      let link = item
        .querySelector('[data-quickview="link"]')
        .getAttribute("href");
      let quickviewNav = document.querySelector("[data-quickview-nav]");
      let quickviewLink = quickviewNav.querySelector(".cta_link");

      if (isQuickView) {
        document.body.classList.remove("quickview");
        trigger.classList.remove("active");
        if (removeConditionalListeners) {
          removeConditionalListeners();
        }
      } else {
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
          '[data-quickview="trigger"].active',
        );
        simulateClick(activeTrigger);
      }
    });
  }
});
