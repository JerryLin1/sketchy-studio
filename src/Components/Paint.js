import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";

function sketch(p5) {
  p5.setup = () => {
      p5.createCanvas(600, 400);
      p5.background(250);
      p5.strokeWeight(5);
  };

  p5.draw = () => {
    if (p5.mouseIsPressed) {
        console.log("owei")
        p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
    }
    
  };

  p5.mouseDown = () => {
    
  };
}

function Paint() {
  return <ReactP5Wrapper sketch={sketch} />;
}

export default Paint;
