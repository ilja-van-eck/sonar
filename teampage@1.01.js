const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

class DragScroll {
  constructor(obj) {
    this.el = document.querySelector(obj.el);
    this.wrap = this.el.querySelector(obj.wrap);
    this.items = this.el.querySelectorAll(obj.item);
    this.init();
  }

  init() {
    this.progress = 0;
    this.oldProgress = 0;
    this.speed = 0;
    this.oldX = 0;
    this.x = 0;
    this.playrate = 0;
    this.actualMargin = 0.5;
    this.innerElements = Array.from(this.items).map((item) =>
      item.querySelector(".team-slide__inner"),
    );

    this.bindings();
    this.events();
    this.calculate();
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
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  calculate() {
    let multiplier;
    if (window.innerWidth < 480) {
      multiplier = 2.45;
    } else {
      multiplier = 1.63;
    }

    this.marginOffset = 0.25 * window.innerWidth;
    this.wrapWidth = this.items[0].clientWidth * this.items.length;
    this.wrap.style.width = `${this.wrapWidth}px`;
    this.maxScroll =
      this.wrapWidth - this.el.clientWidth + multiplier * this.marginOffset;
    this.viewportWidth = this.el.clientWidth;
    this.itemWidth = this.items[0].clientWidth;
  }

  handleWheel(e) {
    this.progress += e.deltaY;
    this.move();
  }

  handleTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragging = true;
    this.startX = e.clientX || e.touches[0].clientX;
    setTimeout(() => {
      this.el.classList.add("dragging");
    }, 100);
  }

  handleTouchMove(e) {
    if (!this.dragging) return false;
    e.stopPropagation();
    const x = e.clientX || e.touches[0].clientX;
    this.progress += (this.startX - x) * 1.4;
    this.startX = x;
    this.move();
  }

  handleTouchEnd(e) {
    e.stopPropagation();
    setTimeout(() => {
      this.dragging = false;
      this.el.classList.remove("dragging");
    }, 100);
  }

  handleClick(e) {
    if (this.dragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  move() {
    this.progress = clamp(this.progress, 0, this.maxScroll);
  }

  events() {
    window.addEventListener("resize", this.calculate);
    window.addEventListener("wheel", this.handleWheel);

    this.el.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);

    window.addEventListener("mousedown", this.handleTouchStart);
    window.addEventListener("mousemove", this.handleTouchMove);
    window.addEventListener("mouseup", this.handleTouchEnd);
    document.body.addEventListener("mouseleave", this.handleTouchEnd);

    this.items.forEach((item) => {
      item.addEventListener("click", this.handleClick);
    });
  }

  raf() {
    this.x = lerp(this.x, this.progress, 0.1);
    this.playrate = this.x / this.maxScroll;
    this.wrap.style.transform = `translate3d(${-this.x}px, 0, 0)`;
    this.speed = Math.min(100, this.oldX - this.x);
    this.oldX = this.x;

    // calc margin
    const newMargin = 0.5 + Math.abs(this.speed) * 0.2;
    this.actualMargin = lerp(this.actualMargin, newMargin, 0.1);
    this.actualMargin = clamp(this.actualMargin, 0.5, 2);

    // apply new margin
    this.items.forEach((item, index) => {
      item.style.marginRight = `${this.actualMargin}vw`;
    });

    const direction = this.progress > this.oldProgress ? 1 : 1;
    const rotationSpeed = Math.abs(this.speed) * 0.2;
    const rotationAngle = clamp(rotationSpeed * direction, -15, 15);

    this.innerElements.forEach((element) => {
      element.style.transform = `rotateY(${rotationAngle}deg)`;
    });
    this.oldProgress = this.progress;
  }
}

const scroll = new DragScroll({
  el: ".slider",
  wrap: ".slider-wrapper",
  item: ".slider-item",
});

const animateScroll = () => {
  requestAnimationFrame(animateScroll);
  scroll.raf();
};
animateScroll();
