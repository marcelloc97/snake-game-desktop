export default class ScreenType {
  state = {
    name: String,
  };

  constructor(name) {
    this.state.name = name;
  }

  getName = () => {
    return this.state.name;
  };
}
