import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import $ from "jquery";
import "./Canvas.css";

var colors = [
  "rgb(22, 23, 26)",
  "rgb(127, 6, 34)",
  "rgb(214, 36, 17)",
  "rgb(255, 132, 38)",
  "rgb(255, 209, 0)",
  "rgb(250, 253, 255)",
  "rgb(255, 128, 164)",
  "rgb(255, 38, 116)",
  "rgb(148, 33, 106)",
  "rgb(67, 0, 103)",
  "rgb(35, 73, 117)",
  "rgb(104, 174, 212)",
  "rgb(191, 255, 60)",
  "rgb(16, 210, 117)",
  "rgb(0, 120, 153)",
  "rgb(0, 40, 89)",
];

function Canvas(props) {
  const [enabled, setEnabled] = useState(true);
  const client = props.props.client;

  client.socket.on("resetCanvas", () => {
    setEnabled(true);
  });

  var paintedLines = [];
  var paintedLinesHistory = [[...paintedLines]];
  var color = useRef("rgb(0,0,0)");
  //   var [color, setColor] = useState("rgb(255,0,0)");

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const submitRef = useRef(null);
  const swSliderRef = useRef(null);

  const colorBtns = [];
  const colorBtnsGrid = (
    <div
      style={{
        // border: "solid 2px black",
        // width: "164px",
        // boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: "40px 40px",
        gridTemplateRows: "40px 40px 40px 40px 40px 40px 40px 40px",
      }}
    >
      {colorBtns}
    </div>
  );
  //   for (let r = 0; r < 255; r += 32) {
  //     for (let g = 0; g < 255; g += 32) {
  //       let c = `rgb(${r},${g},${0})`;
  //       colorBtns.push(
  //         <div
  //           onClick={() => {
  //             // setColor(c);
  //             color.current = c;
  //           }}
  //           onMouseOver={(e) => {
  //             e.target.style.border = "solid 2px white";
  //           }}
  //           onMouseOut={(e) => {
  //             e.target.style.border = "none";
  //           }}
  //           style={{
  //             height: "20px",
  //             width: "20px",
  //             margin: 0,
  //             padding: 0,
  //             backgroundColor: c,
  //           }}
  //         />
  //       );
  //     }
  //   }
  for (let c of colors) {
    colorBtns.push(
      <span
        onClick={() => {
          // setColor(c);
          color.current = c;
        }}
        onMouseOver={(e) => {
          e.target.style.border = "solid 2px white";
        }}
        onMouseOut={(e) => {
          e.target.style.border = "none";
        }}
        style={{
          height: "40px",
          width: "40px",
          cursor: "pointer",
          margin: 0,
          padding: 0,
          backgroundColor: c,
        }}
      />
    );
  }

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    submitRef.current.onclick = () => {
      submit();
    };

    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    canvas.oncontextmenu = function (e) {
      e.preventDefault();
      e.stopPropagation();
    };
    $([canvas]).mousedown(function (event) {
      switch (event.which) {
        case 1:
          context.strokeStyle = color.current;
          context.lineWidth = swSliderRef.current.value;
          break;
        case 3:
          context.strokeStyle = "#FFFFFF";
          break;
      }
    });
    $([canvas]).mouseup(function (event) {});
    // canvas.style.width = `600px`;
    // canvas.style.height = `800px`;

    const context = canvas.getContext("2d");
    // context.scale(2, 2);
    context.lineCap = "round";
    context.lineWidth = swSliderRef.current.value;
    contextRef.current = context;

    clear();
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    if (!enabled) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clear = () => {
    contextRef.current.fillStyle = "white";
    contextRef.current.fillRect(0, 0, 800, 600);
  };

  const submit = () => {
    let pngString = canvasRef.current.toDataURL();
    setEnabled(false);
    client.socket.emit("draw", pngString);
    client.socket.emit("finishedDrawing");
    clear();
  };

  return (
    <div>
      <Row>
        <Col>
          <canvas
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}
          />
        </Col>
        <Col id="canvas-settings">
          <Row>
            <div
              id="colour-header"
              className="noselect"
              style={{
                textShadow:
                  "-2px -2px 0 #000, 0 -2px 0 #000, 2px -2px 0 #000, 2px 0 0 #000, 2px 2px 0 #000, 0 2px 0 #000, -2px 2px 0 #000, -2px 0 0 #000",
              }}
            >
              Colour Picker:
            </div>
            <div style={{ margin: "inherit" }}>{colorBtnsGrid}</div>
          </Row>
          <br />
          <Row style={{ width: "15em" }}>
            <input
              ref={swSliderRef}
              type="range"
              min="2"
              max="66"
              step="4"
              class="slider"
              defaultValue="4"
            />
          </Row>
          <br />
          <br />
          <Row style={{ width: "15em" }}>
            <Button
              id="submit-btn"
              variant="outline-light"
              disabled={!enabled}
              ref={submitRef}
            >
              Submit drawing
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Canvas;
