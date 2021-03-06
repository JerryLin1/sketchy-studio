import React from "react";

export default class Countdown extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.startingTime = Date.now();
    this.secondsLeft = parseInt(this.props.time);
    this.interval = setInterval(() => {
      // deltaTime is in milliseconds
      this.deltaTime = Date.now() - this.startingTime;
      this.secondsLeft = Math.round(this.props.time - this.deltaTime / 1000);
      if (this.secondsLeft <= 0) {
        clearInterval(this.interval);
        this.secondsLeft = 0;
      }

      this.forceUpdate();
    }, 60 / 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { before, after } = this.props;

    return (
      <div className="countdown noselect" style={{textShadow: "-2px -2px 0 #000, 0 -2px 0 #000, 2px -2px 0 #000, 2px 0 0 #000, 2px 2px 0 #000, 0 2px 0 #000, -2px 2px 0 #000, -2px 0 0 #000",}}>
        {before} {this.secondsLeft} seconds {after}
      </div>
    );
  }
}
