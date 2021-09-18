import React from "react";
import Sketch from "react-p5";

let Paint = (props) => {
  var linesToReceive = [];

  // linesToDraw every frame. This array is iterated over, drawn, and cleared every frame
  var linesToDraw = [];
  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    let canvas = p5.createCanvas(600, 400);
    canvas.parent(canvasParentRef);

    p5.background(250);
    p5.strokeWeight(5);

    setInterval(() => {
      if (linesToReceive.length > 0) {
        linesToDraw.push(linesToReceive[0]);
        linesToReceive.splice(0, 1);
      }
    }, 5);
    props.props.client.socket.on("draw", (line) => {
      // linesToReceive will delay the drawing. Would be cool during voting phase to see drawing progress? 
      // linesToReceive.push(line);
      linesToDraw.push(line);
    });
  };
  const draw = (p5) => {
    // Local client is drawing
    if (p5.mouseIsPressed) {
      let line = new Line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
      drawLine(line);
      props.props.client.socket.emit("draw", line);
    }

    for (let i = 0; i < linesToDraw.length; i++) {
      let line = linesToDraw[i];
      drawLine(line);
    }

    function drawLine(line) {
      p5.line(line.x1, line.y1, line.x2, line.y2);
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};
function Line(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
}

export default Paint;
