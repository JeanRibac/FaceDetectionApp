import React from 'react';
// import './App.css';
import * as tf from "@tensorflow/tfjs"
import * as facemesh from "@tensorflow-models/facemesh"
import Webcam from "react-webcam"
import { drawMesh } from "./utils"

function App() {
  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8
    })
    setInterval(() => {
      detect(net)
    }, 10);
  }

  //detect function
  const detect = async (net) => {
    if (typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      //get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      //set video width/height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //set canvas width/height
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //make detections
      const face = await net.estimateFaces(video);
      // console.log(face);
      //get canvas context for drawing
      const context = canvasRef.current.getContext("2d");
      drawMesh(face, context)
    }
  }

  runFacemesh()
  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          marginTop: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          marginTop: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480
        }}
      />
    </div>
  );
}

export default App;
