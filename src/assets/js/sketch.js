import './p5.sound';
import Fish from './fish';
import VT323 from '../fonts/VT323-Regular.ttf';
import background from '../img/background.jpg';

const canvas = {
  parent: document.querySelector('#canvas'),
  width: 600,
  height: 250,
};

const elements = [
  {
    image: require('../img/fishTile_075.png'),
    obj: null,
    points: 5,
    sound: require('../sound/confirmation_003.ogg'),
  },
  {
    image: require('../img/fishTile_076.png'),
    obj: null,
    points: 1,
    sound: require('../sound/confirmation_001.ogg'),
  },
  {
    image: require('../img/fishTile_080.png'),
    obj: null,
    points: 1,
    sound: require('../sound/confirmation_001.ogg'),
  },
  {
    image: require('../img/fishTile_092.png'),
    obj: null,
    points: -1,
    sound: require('../sound/back_003.ogg'),
  },
  {
    image: require('../img/fishTile_100.png'),
    obj: null,
    points: -5,
    sound: require('../sound/error_007.ogg'),
  },
];

let screen = 0;


const sketch = (s) => {
  let font;
  let bestScore;

  const getBest = () => {
    if (localStorage.getItem('bestScore') !== null) {
      return localStorage.bestScore;
    }
    return 0;
  };

  let bgImage;

  s.preload = () => {
    elements.forEach((el) => {
      s.loadImage(el.image, (img) => {

        el.obj = new Fish(img, canvas.width, canvas.height, s);
        el.image = img;
      });
      el.sound = s.loadSound(el.sound);
    });

    font = s.loadFont(VT323);

    bestScore = getBest();

    bgImage = s.loadImage(background);
  };

  let cursorImg;

  s.setup = () => {

    const myCanvas = s.createCanvas(canvas.width, canvas.height);
    myCanvas.parent('canvas');

    s.cursor(s.CROSS);
    cursorImg = s.loadImage(require('../img/narwhal.png'));
  };

  const start = () => {
    s.background(bgImage);

    s.fill('#FFF');
    s.textFont(font);
    s.textAlign(s.CENTER, s.CENTER);
    s.textSize(30);
    s.text('Ready to eat some fish?', 300, 35);

    s.textSize(15);
    s.text('Eat as much fish as you can in 1 minute', 300, 65);

    let i = 0;
    let x;
    let y;

    elements.forEach((el) => {
      i += 1;
      x = i * 35 + 180;
      y = 105;

      s.image(el.image, x, y, 25, 25);
      s.textAlign(s.LEFT);
      s.text(el.points, x + 8, y + 40);
    });

    s.textFont('Georgia');
    s.textSize(13);
    s.text('🏆', 20, 24);
    s.textFont(font);
    s.textSize(20);
    s.text(`Best: ${bestScore}`, 40, 20);

    s.noStroke();
    s.rectMode(s.CENTER);
    s.fill(0, 0, 0, 150);
    s.rect(300, 205, 110, 40);

    s.textAlign(s.CENTER, s.CENTER);
    s.textSize(20);
    s.fill('#FFF');
    s.text('START', 286, 203);
    s.textSize(20);
    s.textFont('Georgia');
    s.text('🦈', 330, 207);
  };


  let cx = s.width / 2;
  let cy = s.height / 2;


  let globalPoints = 0;

  let countdown = 59;


  const game = () => {
    s.imageMode(s.CORNER);
    s.background(bgImage);
    s.imageMode(s.CENTER);

    cx = s.lerp(cx, s.mouseX, 0.02);
    cy = s.lerp(cy, s.mouseY, 0.02);


    elements.forEach(({ obj, points, sound }) => {

      s.push();
      obj.display();
      s.pop();


      const { x, y } = obj.getPos();


      if (s.int(s.dist(cx, cy, x, y)) < 35) {

        globalPoints += points;
        if (globalPoints <= 0) {
          globalPoints = 0;
        }


        obj.reset();

        if (Math.sign(points) === -1) {
          s.background(255, 0, 0, 90);
        }


        sound.play();
      }
    });


    s.imageMode(s.CENTER);
    s.image(cursorImg, cx, cy);


    s.textAlign(s.LEFT);
    s.textFont(font);
    s.textSize(20);
    s.fill('#FFF');
    s.text(`POINTS: ${globalPoints}`, 20, 24);
    s.textSize(15);

    if (globalPoints > bestScore) bestScore = globalPoints;
    s.text(`BEST: ${bestScore}`, 20, 45);


    s.textAlign(s.RIGHT);
    s.textSize(20);
    s.text(`00:${countdown < 10 ? `0${countdown}` : countdown}`, 580, 24);
  };


  const gameOver = () => {
    s.imageMode(s.CORNER);
    s.background(bgImage);
    s.fill('#FFF');
    s.textFont(font);
    s.textAlign(s.CENTER, s.CENTER);
    s.textSize(30);
    s.text('GAME OVER!', 300, 85);

    s.textSize(15);
    s.text(`${globalPoints} points, not bad!`, 300, 115);
    s.text('Fancy another game?', 300, 130);

    s.textAlign(s.LEFT);
    s.textFont('Georgia');
    s.textSize(13);
    s.text('🏆', 20, 24);
    s.textFont(font);
    s.textSize(20);
    s.text(`Best: ${bestScore}`, 40, 20);

    s.noStroke();
    s.rectMode(s.CENTER);
    s.fill(0, 0, 0, 90);
    s.rect(300, 175, 110, 40);

    s.textAlign(s.CENTER, s.CENTER);
    s.textSize(20);
    s.fill('#FFF');
    s.text('START', 286, 173);
    s.textSize(20);
    s.textFont('Georgia');
    s.text('🦈', 330, 177);
  };


  s.draw = () => {
    switch (screen) {
      case 1:
        game();
        break;
      case 2:
        gameOver();
        break;
      default:
        start();
    }
  };


  const setCountdown = () => {

    const interval = setInterval(() => {
      countdown -= 1;

      if (countdown === 0) {
        clearInterval(interval);

        screen = 2;

        localStorage.bestScore = bestScore;
      }
    }, 1000);
  };

  s.mousePressed = () => {

    if (screen === 0) {
      screen = 1;

      setCountdown();

    } else if (screen === 2) {

      countdown = 59;

      globalPoints = 0;

      bestScore = localStorage.bestScore;

      screen = 1;

      setCountdown();
    }
  };
};

export default sketch;
