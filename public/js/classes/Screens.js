import ScreenType from "./ScreenType.js";

export default class Screens {
  state = {
    name: String,
    type: ScreenType,
    render: "",
  };

  constructor(name, type) {
    this.state.name = name;
    this.state.type = type;
  }

  // Getters and Setters
  getName = () => {
    return this.state.name;
  };

  getType = () => {
    return this.state.type;
  };

  getRender = () => {
    return this.state.render;
  };

  setRender = (fn) => {
    this.state.render = fn;
  };
}
