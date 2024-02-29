const lerp = (t, e, s) => (1 - s) * t + s * e,
  clamp = (t, e, s) => Math.max(e, Math.min(t, s));
class DragScroll {
  constructor(t) {
    (this.el = document.querySelector(t.el)),
      (this.wrap = this.el.querySelector(t.wrap)),
      (this.items = this.el.querySelectorAll(t.item)),
      (this.isDragging = false),
      (this.touchStartX = 0),
      (this.touchStartY = 0),
      this.init();
  }
  init() {
    (this.progress = 0),
      (this.oldProgress = 0),
      (this.speed = 0),
      (this.oldX = 0),
      (this.x = 0),
      (this.playrate = 0),
      (this.actualMargin = 0.5),
      (this.innerElements = Array.from(this.items).map((t) =>
        t.querySelector(".team-slide__inner"),
      )),
      this.bindings(),
      this.events(),
      this.calculate(),
      this.raf();
  }
  bindings() {
    [
      "events",
      "calculate",
      "handleWheel",
      "move",
      "raf",
      "handleTouchStart",
      "handleTouchMove",
      "handleTouchEnd",
      "handleClick",
      "handleKeyDown",
    ].forEach((t) => {
      this[t] = this[t].bind(this);
    });
  }
  calculate() {
    let t;
    (t = window.innerWidth < 480 ? 2.45 : 1.63),
      (this.marginOffset = 0.25 * window.innerWidth),
      (this.wrapWidth = this.items[0].clientWidth * this.items.length),
      (this.wrap.style.width = `${this.wrapWidth}px`),
      (this.maxScroll =
        this.wrapWidth - this.el.clientWidth + t * this.marginOffset),
      (this.viewportWidth = this.el.clientWidth),
      (this.itemWidth = this.items[0].clientWidth);
  }
  handleWheel(t) {
    (this.progress += t.deltaY + t.deltaX), this.move();
  }
  //   handleTouchStart(t) {
  //     console.log(t);
  //     t.preventDefault(),
  //       t.stopPropagation(),
  //       (this.dragging = !0),
  //       (this.startX = t.clientX || t.touches[0].clientX),
  //       (this.startY = t.clientY || t.touches[0].clientY),
  //       setTimeout(() => {
  //         this.el.classList.add("dragging");
  //       }, 200);
  //   }
  handleTouchStart(t) {
    console.log(t);
    t.preventDefault(),
      t.stopPropagation(),
      (this.dragging = !0),
      (this.startX = t.clientX || t.touches[0].clientX),
      (this.startY = t.clientY || t.touches[0].clientY),
      (this.touchStartX = this.startX), // Set start X position
      (this.touchStartY = this.startY), // Set start Y position
      (this.isDragging = false), // Reset dragging state
      setTimeout(() => {
        this.el.classList.add("dragging");
      }, 200);
  }
  handleTouchMove(t) {
    if (!this.dragging) return !1;
    this.isDragging = true; // // //
    t.stopPropagation();
    let e = t.clientX || t.touches[0].clientX,
      s = t.clientY || t.touches[0].clientY,
      i = this.startX - e,
      h = this.startY - s;
    (this.progress += Math.abs(i) > Math.abs(h) ? 1.6 * i : 1.6 * h),
      (this.startX = e),
      (this.startY = s),
      this.move();
  }
  //   handleTouchEnd(t) {
  //     t.stopPropagation(),
  //       setTimeout(() => {
  //         (this.dragging = !1), this.el.classList.remove("dragging");
  //       }, 210);
  //   }
  handleTouchEnd(t) {
    t.stopPropagation();
    const touchEndX = t.changedTouches[0].clientX;
    const touchEndY = t.changedTouches[0].clientY;
    const distanceMoved = Math.sqrt(
      Math.pow(touchEndX - this.touchStartX, 2) +
        Math.pow(touchEndY - this.touchStartY, 2),
    );

    if (!this.isDragging || distanceMoved < 10) {
      const clickedElement = document.elementFromPoint(touchEndX, touchEndY);
      const linkElement = clickedElement.closest(".team-slide__inner");
      if (linkElement) {
        linkElement.click();
      }
    }

    setTimeout(() => {
      (this.dragging = !1), this.el.classList.remove("dragging");
    }, 210);
  }
  handleClick(t) {
    this.dragging && (t.preventDefault(), t.stopPropagation());
  }
  handleKeyDown(t) {
    "ArrowRight" === t.key
      ? ((this.progress += 250), this.move())
      : "ArrowLeft" === t.key && ((this.progress -= 250), this.move());
  }
  move() {
    this.progress = clamp(this.progress, 0, this.maxScroll);
  }
  events() {
    window.addEventListener("resize", this.calculate),
      window.addEventListener("wheel", this.handleWheel),
      this.el.addEventListener("touchstart", this.handleTouchStart),
      window.addEventListener("touchmove", this.handleTouchMove),
      window.addEventListener("touchend", this.handleTouchEnd),
      window.addEventListener("mousedown", this.handleTouchStart),
      window.addEventListener("mousemove", this.handleTouchMove),
      window.addEventListener("mouseup", this.handleTouchEnd),
      document.body.addEventListener("mouseleave", this.handleTouchEnd),
      document.addEventListener("keydown", this.handleKeyDown.bind(this)),
      this.items.forEach((t) => {
        t.addEventListener("click", this.handleClick);
      });
  }
  raf() {
    const lerpFactor = window.innerWidth < 480 ? 0.2 : 0.1;
    (this.x = lerp(this.x, this.progress, lerpFactor)),
      (this.playrate = this.x / this.maxScroll),
      (this.wrap.style.transform = `translate3d(${-this.x}px, 0, 0)`),
      (this.speed = Math.min(100, this.oldX - this.x)),
      (this.oldX = this.x);
    let t = 0.5 + 0.2 * Math.abs(this.speed);
    (this.actualMargin = lerp(this.actualMargin, t, 0.1)),
      (this.actualMargin = clamp(this.actualMargin, 0.5, 2)),
      this.items.forEach((t, e) => {
        t.style.marginRight = `${this.actualMargin}vw`;
      });
    let e = (this.progress, this.oldProgress, 1),
      s = 0.2 * Math.abs(this.speed),
      i = clamp(s * e, -15, 15);
    this.innerElements.forEach((t) => {
      t.style.transform = `rotateX(0deg) rotateY(${i}deg) rotateZ(0.001deg)`;
    }),
      (this.oldProgress = this.progress);
  }
}
const scroll = new DragScroll({
    el: ".slider",
    wrap: ".slider-wrapper",
    item: ".slider-item",
  }),
  animateScroll = () => {
    requestAnimationFrame(animateScroll), scroll.raf();
  };
animateScroll();
