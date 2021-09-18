import React from "react";
import Sketch from "react-p5";

let Paint = (props) => {
  // sw = strokeweight = pen width
  let swSliderWrapper = React.useRef(null);
  let colorPickerWrapper = React.useRef(null);

  var swSlider;
  var colorPicker;

  var linesToReceive = [];
  // linesToDraw every frame. This array is iterated over, drawn, and cleared every frame
  var linesToDraw = [];
  var paintedLines = [];
  var paintedLinesHistory = [[...paintedLines]];

  var canUndo = true;
  var canRedo = true;
  var undoLevel = 0;

  const setup = (p5, canvasParentRef) => {
    // Disable right click
    for (let element of document.getElementsByClassName("p5Canvas")) {
      element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    let canvas = p5.createCanvas(600, 400);
    canvas.parent(canvasParentRef);

    swSlider = p5.createSlider(2, 14, 4, 4);
    swSlider.parent(swSliderWrapper.current);

    colorPicker = p5.createColorPicker(0x000000);
    colorPicker.parent(colorPickerWrapper.current);

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
    // Left mouse button draws
    if (p5.mouseIsPressed) {
      if (undoLevel < 0) {
        paintedLinesHistory = paintedLinesHistory.slice(0, undoLevel);
      }
      undoLevel = 0;

      if (p5.mouseButton === p5.LEFT) {
        let line = new Line(
          p5.pmouseX,
          p5.pmouseY,
          p5.mouseX,
          p5.mouseY,
          swSlider.value(),
          colorPicker.value()
        );
        drawLine(line);
        props.props.client.socket.emit("draw", line);
      }
      // Right mouse button erases
      else if (p5.mouseButton === p5.RIGHT) {
        let line = new Line(
          p5.pmouseX,
          p5.pmouseY,
          p5.mouseX,
          p5.mouseY,
          swSlider.value(),
          250
        );
        drawLine(line);
        props.props.client.socket.emit("draw", line);
      }
    }

    // ctrl + z = undo
    if (
      canUndo === true &&
      p5.keyIsPressed === true &&
      p5.keyIsDown(17) &&
      p5.keyIsDown(90)
    ) {
      if (
        paintedLinesHistory.length - 1 + undoLevel > 0 &&
        paintedLinesHistory.length - 1 + undoLevel < paintedLinesHistory.length
      ) {
        undoLevel--;
        undoHistoryLevel();
      }

      canUndo = false;
    }
    if (canUndo === false && !p5.keyIsDown(90)) {
      canUndo = true;
    }

    // ctrl + y = redo
    if (
      canRedo === true &&
      p5.keyIsPressed === true &&
      p5.keyIsDown(17) &&
      p5.keyIsDown(89)
    ) {
      if (
        paintedLinesHistory.length - 1 + undoLevel >= 0 &&
        paintedLinesHistory.length - 1 + undoLevel <
          paintedLinesHistory.length - 1
      ) {
        undoLevel++;
        undoHistoryLevel();
      }
      canRedo = false;
    }
    if (canRedo === false && !p5.keyIsDown(89)) {
      canRedo = true;
    }
    function undoHistoryLevel() {
      if (
        paintedLinesHistory.length - 1 + undoLevel >= 0 &&
        paintedLinesHistory.length - 1 + undoLevel < paintedLinesHistory.length
      ) {
        p5.clear();
        paintedLines = [];
        for (let line of paintedLinesHistory[
          paintedLinesHistory.length - 1 + undoLevel
        ]) {
          linesToDraw.push(line);
        }
      }
    }

    for (let line of linesToDraw) {
      drawLine(line);
    }
    linesToDraw = [];

    function drawLine(line) {
      paintedLines.push(line);
      p5.strokeWeight(line.sw);
      p5.stroke(line.c);
      p5.line(line.x1, line.y1, line.x2, line.y2);
    }
  };

  const mouseReleased = (p5) => {
    paintedLinesHistory.push([...paintedLines]);
  };
  return (
    <div id="canvas">
      <Sketch setup={setup} draw={draw} mouseReleased={mouseReleased} />
      <span
        style={{ dislpay: "inline" }}
        id="swSliderWrapper"
        ref={swSliderWrapper}
      />
      <span
        style={{ display: "inline" }}
        id="colorPickerWrapper"
        ref={colorPickerWrapper}
      />
    </div>
  );
};
// sw = strokeWeight
// c = color
function Line(x1, y1, x2, y2, sw, c) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.sw = sw;
  this.c = c;
}
// function Color(r, g, b, a) {
//   this.r = r;
//   this.g = g;
//   this.b = b;
//   this.a = a;
//   this.value = `rgba(${r},${g},${b},${a})`;
// }

export default Paint;
