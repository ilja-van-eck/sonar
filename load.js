// ON PAGE LOAD
console.log("test");
let pageLoadWrap = document.querySelector(".load-lines");
let pageLoadLines = pageLoadWrap.querySelectorAll(".line");
if (!document.querySelector(".app").classList.contains("is-home")) {
  gsap.to(pageLoadLines, {
    y: "100vh",
    duration: 1,
    delay: 0.1,
    overwrite: true,
    ease: "expo.out",
    onComplete: () => {
      initAll();
      gsap.set(pageLoadWrap, { display: "none" });
    },
    stagger: { amount: 0.1, from: "random" },
  });
  gsap.from(".page", {
    scale: 0.92,
    duration: 0.9,
    delay: 0.1,
  });
} else {
  gsap.set(pageLoadWrap, { display: "none" });
}

// PAGE TRANSITION
document.addEventListener("DOMContentLoaded", function () {
  function chunk(arr, size) {
    let result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(Array.from(arr).slice(i, i + size));
    }
    return result;
  }
  const pageloadChunks = chunk(pageLoadLines, 5);
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.classList.contains("menu_link")) {
        let menuWrapper = document.querySelector(".menu_wrap");
        let menuFade = menuWrapper.querySelectorAll("[data-menu-fade]");
        let menuLow = menuWrapper.querySelectorAll("[data-menu-low]");
        e.preventDefault();
        let destination = this.getAttribute("href");
        const menuClick = gsap.timeline({
          defaults: {
            ease: "power3.out",
            duration: 0.6,
            onComplete: () => {
              window.location = destination;
            },
          },
        });
        menuClick
          .to(".menu_link h2", {
            y: "100%",
            stagger: { each: 0.05, from: "end" },
          })
          .to(
            ".navbar_inner",
            {
              y: "-150%",
            },
            0
          )
          .to(
            [menuFade, menuLow],
            {
              y: "50%",
              opacity: 0,
              stagger: { each: 0.05, from: "end" },
              duration: 0.6,
            },
            0
          )
          .to(
            ".lines-wrapper.is-menu",
            {
              y: "110%",
              duration: 0.6,
            },
            0
          );
      } else if (
        this.hostname === window.location.hostname &&
        !this.href.includes("#") &&
        this.target !== "_blank"
      ) {
        e.preventDefault();
        let destination = this.getAttribute("href");
        const loadAnimation = gsap.timeline({
          defaults: {
            ease: "expo.out",
            duration: 1,
          },
        });
        const lineChunkOpen = gsap.timeline();
        pageloadChunks.forEach((chunk, i) => {
          lineChunkOpen.to(
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
            i * 0.15
          );
        });
        loadAnimation
          .set(pageLoadWrap, {
            display: "flex",
          })
          .to(
            ".page",
            {
              scale: 0.92,
              duration: 0.9,
              delay: 0.1,
            },
            0
          )
          .to(
            pageLoadLines,
            {
              y: "0vh",
              duration: 0.8,
              ease: "power4.out",
              stagger: { amount: 0.6, from: "start" },
              onStart: () => {
                pageloadChunks.forEach((chunk) => {
                  chunk.forEach((line) => {
                    gsap.set(line, {
                      y: `${gsap.utils.random(100, 125)}vh`,
                    });
                  });
                });
              },
              onComplete: () => {
                window.location = destination;
              },
            },
            0
          );
      }
    });
  });

  // ON BACK BUTTON
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });
});
