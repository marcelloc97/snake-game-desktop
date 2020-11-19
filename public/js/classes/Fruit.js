export default class Fruit {
  constructor(ctx, x, y, color) {
    this.state.ctx = ctx;

    if (x) this.state.position.x = x;

    if (y) this.state.position.y = y;

    if (color) this.state.color = color;
  }

  state = {
    ctx: null,
    color: "#AA0000",
    position: {
      x: Math.floor(Math.random() * 35),
      y: Math.floor(Math.random() * 35),
    },
  };

  reset() {
    this.state.position = {
      x: Math.floor(Math.random() * 35),
      y: Math.floor(Math.random() * 35),
    };
  }

  draw() {
    this.state.ctx.fillStyle = this.state.color;
    this.state.ctx.fillRect(this.state.position.x, this.state.position.y, 1, 1);
  }
}
