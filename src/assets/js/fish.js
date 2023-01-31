
class Fish {
  constructor(img, width, height, sk, opts = {}) {

    this.el = img;

    this.sk = sk;


    this.opts = {
      speed: 1,
      ...opts,
    };


    this.bounds = {
      width,
      height,
    };


    this.state = {
      x: 0,
      y: 0,
      realX: 0,
      realY: 0,
      flags: {
        reverse: false,
      },
    };


    this.init();
  }


  init() {
    const { state } = this;
    const { height } = this.bounds;
    const { sk } = this;

    this.state.y = sk.random(0, height);


    const randX = sk.random([0, 1]);


    if (randX === 1) {

      state.flags.reverse = true;


      const { xMax, yMin, yMax } = this.getRange();


      state.x = xMax;


      state.y = sk.random(yMin, yMax);
    }


    this.opts.speed = sk.random(2, 4);
  }


  display() {

    this.animate();

    const { x, y } = this.state;
    const { width, height } = this.bounds;
    const { sk } = this;


    if (this.state.flags.reverse) {
      sk.translate(width / 2, height / 2);
      sk.scale(-1, 1);
      sk.image(this.el, x, y);
    } else {
      sk.image(this.el, x, y);
    }
  }


  animate() {
    const { state } = this;
    const { opts } = this;
    const { sk } = this;
    const {
      xMin, xMax, yMin, yMax,
    } = this.getRange();


    state.x += opts.speed;


    if (!state.flags.reverse && state.x > xMax) {
      state.flags.reverse = true;


      this.setPosition(true);
    }


    if (state.flags.reverse && state.x > xMin) {
      state.flags.reverse = false;

      this.setPosition(false);
    }


    state.realX = sk.map(state.x, xMin, xMax, 0, this.bounds.width + this.el.width);
    state.realY = sk.map(state.y, yMin, yMax, 0, this.bounds.height - this.el.height);
  }


  setPosition(r) {
    const { state } = this;
    const { sk } = this;
    const {
      xMin, xMax, yMin, yMax,
    } = this.getRange();


    if (r) {
      state.y = sk.random(yMin, yMax);
      state.x = xMax;
      this.opts.speed = sk.random(2, 4);
    } else {
      state.y = sk.random(yMin, yMax);

      state.x = xMin;
      this.opts.speed = sk.random(2, 4);
    }
  }


  getRange() {
    const { width, height } = this.bounds;
    const { reverse } = this.state.flags;


    if (reverse) {
      return ({
        xMin: (width / 2),
        xMax: -width / 2 - this.el.width,
        yMin: -height / 2,
        yMax: (height / 2) - this.el.height,
      });
    }


    return ({
      xMin: 0,
      xMax: width + this.el.width,
      yMin: 0,
      yMax: height - this.el.height,
    });
  }


  reset() {
    const { state } = this;
    const { height } = this.bounds;
    const { sk } = this;


    this.state.y = sk.random(0, height);


    const randX = sk.random([0, 1]);


    if (randX === 1) {

      state.flags.reverse = true;


      const { xMax, yMin, yMax } = this.getRange();


      state.x = xMax;


      state.y = sk.random(yMin, yMax);
    } else {
      state.flags.reverse = false;


      state.x = -this.el.width;
    }


    this.opts.speed = sk.random(2, 4);
  }


  getPos() {
    return {
      x: this.state.realX,
      y: this.state.realY,
    };
  }
}

export default Fish;
