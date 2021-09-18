import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import $ from "jquery";

function Canvas(props) {
  let pngsrc = "";
  const client = props.props.client;
  const isDescriber = props.props.isDescriber;
  var paintedLines = [];
  var paintedLinesHistory = [[...paintedLines]];

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const submitRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const color = "#000000";

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
          context.strokeStyle = color;
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
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;

    clear();
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
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
    client.socket.emit("draw", pngString);
    client.socket.emit("finishedDrawing");
    clear();
  };

  return (
    <div>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
      <Button ref={submitRef}>Submit</Button>
    </div>
  );
}

export default Canvas;
