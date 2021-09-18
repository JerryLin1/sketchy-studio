import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import $ from "jquery";
import "./Canvas.css";

function Canvas(props) {
    const [enabled, setEnabled] = useState(true);
    const client = props.props.client;
    const isDescriber = props.props.isDescriber;

    client.socket.on("resetCanvas", () => {
        setEnabled(true)
    })

    var paintedLines = [];
    var paintedLinesHistory = [[...paintedLines]];
    window.color = "rgb(0,0,0)";
    //   var [color, setColor] = useState("rgb(255,0,0)");

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const submitRef = useRef(null);

    const colorBtns = [];
    const colorBtnsGrid = (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "20px 20px 20px 20px 20px 20px 20px 20px",
                gridTemplateRows: "20px 20px 20px 20px 20px 20px 20px 20px",
            }}
        >
            {colorBtns}
        </div>
    );
    for (let r = 0; r < 255; r += 32) {
        for (let g = 0; g < 255; g += 32) {
            let c = `rgb(${r},${g},${100})`;
            colorBtns.push(
                <div
                    onClick={() => {
                        // setColor(c);
                        window.color = c;
                    }}
                    onMouseOver={(e) => {
                        e.target.style.border = "solid 2px white";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.border = "none";
                    }}
                    style={{
                        height: "20px",
                        width: "20px",
                        margin: 0,
                        padding: 0,
                        backgroundColor: c,
                    }}
                />
            );
        }
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
                    context.strokeStyle = window.color;
                    break;
                case 3:
                    context.strokeStyle = "#FFFFFF";
                    break;
            }
        });
        $([canvas]).mouseup(function (event) { });
        // canvas.style.width = `600px`;
        // canvas.style.height = `800px`;

        const context = canvas.getContext("2d");
        // context.scale(2, 2);
        context.lineCap = "round";
        context.lineWidth = 5;
        contextRef.current = context;

        clear();
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        if (!enabled) return;
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
                <Col id = "canvas-settings">
                    <div id = "colour-header">Colour Picker:</div>
                    {colorBtnsGrid}
                    <Button id = "submit-btn" disabled = {!enabled} ref={submitRef}>Submit drawing</Button>

                </Col>
            </Row>


        </div>
    );
}

export default Canvas;
