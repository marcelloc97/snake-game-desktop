export default class Player {
  constructor(
    gameOpts = {
      WIDTH: 0,
      HEIGHT: 0,
      ctx: null,
    },
    color = "#0d5959",
    position = {
      x: Math.floor(Math.random() * 35),
      y: Math.floor(Math.random() * 35),
    },
    velocity = 1
  ) {
    this.state.gameOpts = gameOpts;

    this.state.headPos = position;
    this.state.color = color;
    this.state.vel = velocity;
  }

  state = {
    vel: 1, // player's velocity
    headPos: {
      // player's head position
      x: Math.floor(Math.random() * 35),
      y: Math.floor(Math.random() * 35),
    },
    bodyPos: {
      // player body position
      x: 1,
      y: 0,
    },
    trail: [], // his tail pixels
    tail: 2, // quantity of tails
    lost: false, // if touched his body
    score: 0,
    highscore: this.score,
    color: "#0d5959",

    gameOpts: {},
  };

  setVelocity(vel) {
    this.state.vel = vel;
  }
  setHeadPosition(x, y) {
    this.state.headPos = {
      x,
      y,
    };
  }
  setBodyPosition(x, y) {
    this.state.bodyPos = {
      x,
      y,
    };
  }
  setColor(color = "#0d5959") {
    this.state.color = color;
  }
  setScore(score) {
    this.state.score = score;
  }
  setHighscore(highscore) {
    this.state.highscore = highscore;
  }

  getScore() {
    return this.state.score;
  }
  getHighscore() {
    return this.state.highscore;
  }

  move(obj) {
    const { WIDTH, HEIGHT } = this.state.gameOpts;

    // Snake Logic P1
    this.state.headPos.x += this.state.bodyPos.x;
    this.state.headPos.y += this.state.bodyPos.y;

    // Arena Wrap
    if (this.state.headPos.x < 0) {
      this.state.headPos.x = WIDTH - 1;
    }
    if (this.state.headPos.x > WIDTH - 1) {
      this.state.headPos.x = 0;
    }
    if (this.state.headPos.y < 0) {
      this.state.headPos.y = HEIGHT - 1;
    }
    if (this.state.headPos.y > HEIGHT - 1) {
      this.state.headPos.y = 0;
    }
  }

  checkCollision(obj) {
    if (obj) {
      this.state.tail++;
      this.state.score++;
    }
  }

  reset() {
    const { WIDTH, HEIGHT } = this.state.gameOpts;
    if (this.state.lost) {
      this.state.tail = 2;
      this.state.headPos = {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
      };
      this.state.score = 0;
      this.state.bodyPos = { x: 1, y: 0 };
      this.state.lost = false;
    }
  }

  draw() {
    const ctx = this.state.gameOpts.ctx;
    const { color, trail, tail, lost, headPos, score, highscore } = this.state;

    ctx.fillStyle = color;
    for (var i = 0; i < trail.length; i++) {
      ctx.fillRect(trail[i].x, trail[i].y, 1, 1);
    }

    trail.push({ x: headPos.x, y: headPos.y });
    while (trail.length > tail) {
      trail.shift();
    }
  }
}
