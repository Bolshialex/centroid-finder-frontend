"use client";
import {FaArrowRight} from "react-icons/fa";
import { useEffect, useState, useRef, use } from "react";
import { getThumbnail, startProcess } from "../../../api/apiFunctions";
import { useRouter } from "next/navigation";
import getCentroid from "./centroid"

export default function Page({ params }) {
  const router = useRouter();
  const video = decodeURIComponent(use(params).id);

  const [thumbnail, setThumbnail] = useState(null);

  const [args, setArgs] = useState({ color: "#ffffff", threshold: 150 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadThumbnail = async () => {
      const url = await getThumbnail(video);
      setThumbnail(url);
    };
    loadThumbnail();
  }, []);
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  //for binarization
  useEffect(() => {
    if (!thumbnail || !canvasRef.current) return;

    const img = new Image();

    // Enables CORS to avoid a tainted canvas without credentials (needed for canvas to work)
    img.crossOrigin = "Anonymous";

    img.src = thumbnail;
    img.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      //set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      //draw original image
      context.drawImage(img, 0, 0);

      //get image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const targetColor = hexToRgb(args.color);
      if (!targetColor) return;
      const threshold = parseInt(args.threshold);

      //each pixel is 4 bytes (rgba) so we increment by 4 (we only use the first 3)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate Euclidean distance
        const distance = Math.sqrt(
          Math.pow(r - targetColor.r, 2) +
            Math.pow(g - targetColor.g, 2) +
            Math.pow(b - targetColor.b, 2)
        );

        if (distance <= threshold) {
          //white
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          //black
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
        }
      }

      // put processed data back
      context.putImageData(imageData, 0, 0);

      //draw centroid
      const centroid = getCentroid(data, canvas.width, canvas.height);
      if (centroid) {
//-------------------------------------------------------draw emoji
        context.font = "40px Arial"; 
        context.textAlign = "center";
        context.textBaseline = "middle";
        // You can paste any emoji here: 🎯, 📍, ❌, 🤖
        context.fillText("🦎", centroid.x, centroid.y);
//-------------------------------------------------------draw jpg
        // const salamanderIcon = new Image();
        // salamanderIcon.src = "/sal.jpg"; // Must be in your public folder
        
        // // We must wait for the icon to load before drawing
        // salamanderIcon.onload = () => {
        //     const iconSize = 30; 
        //     // Draw image centered: (x - halfWidth, y - halfHeight)
        //     context.drawImage(
        //         salamanderIcon, 
        //         centroid.x - (iconSize / 2), 
        //         centroid.y - (iconSize / 2), 
        //         iconSize, 
        //         iconSize
        //     )
        //   }

//-------------------------------------------------------draw red circle with crosshair
        // const radius = 15;
        // context.beginPath();
        // context.strokeStyle = "red"; 
        // context.lineWidth = 3;
        // context.arc(centroid.x, centroid.y, radius, 0, Math.PI * 2);
        // const gap = 5;
        // context.moveTo(centroid.x - radius + gap, centroid.y);
        // context.lineTo(centroid.x + radius - gap, centroid.y);
        // context.moveTo(centroid.x, centroid.y - radius + gap);
        // context.lineTo(centroid.x, centroid.y + radius - gap);
        // context.stroke();
//-------------------------------------------------------draw a red dot
        // context.beginPath();
        // context.arc(centroid.x, centroid.y, 5, 0, Math.PI * 2);
        // context.fillStyle = "red";
        // context.fill();
        // context.closePath();
      }
    };
  }, [thumbnail, args]);
  const handleEyeDropper = async () => {
    if (!window.EyeDropper) {
      alert("Your browser does not support the EyeDropper API.");
      return;
    }
    
    const eyeDropper = new EyeDropper();
    try {
      const result = await eyeDropper.open();
      setArgs((prev) => ({ ...prev, color: result.sRGBHex })); // set picked color in state
    } catch (err) {
      console.error("Eyedropper canceled or failed:", err);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name == "color") {
      handleEyeDropper;
    }
    setArgs((prev) => ({ ...prev, [name]: value }));

    console.log(args);
  };

  const handleProcess = async () => {
    console.log("Process button clicked");
    try {
      const hexColor = args.color.replace("#", "");
      const threshold = args.threshold;
      console.log(
        `Starting process for ${video} with color ${hexColor} and threshold ${threshold}`
      );

      const response = await startProcess(video, hexColor, threshold);
      console.log("Process response:", response);

      if (response && response.jobId) {
        console.log("Redirecting to job status...");
        router.push(`/videos/jobs/${response.jobId}/status`);
      } else {
        console.warn("No jobId in response");
        alert("Process started but no Job ID returned.");
      }
    } catch (error) {
      console.error("Failed to start process:", error);
      alert(`Failed to start process: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="preview-container">
      <h1>Preview and Options</h1>
      <div className="img-container">
        <div>
          <h3>Basic</h3>
          {thumbnail && <img
            className="thumbnail"
            src={thumbnail}
            alt={`${video} thumbnail`}
          />}
        </div>
        <div>
          <h3>Binarized</h3>
          {thumbnail && <canvas className="thumbnail" ref={canvasRef} />}
        </div>
      </div>

      <form className="preview-form">
        <div className="input-container">
          <div className="input-sub-container">
            <label htmlFor="threshold">
              Adjust threshold: {args.threshold}
            </label>
            <input
              type="range"
              id="threshold"
              name="threshold"
              min="0"
              max="300"
              value={args.threshold}
              onChange={handleChange}
            />
          </div>
          <div className="input-sub-container">
            <p>Color Value: {args.color}</p>
            <div>
              <input
                type="color"
                name="color"
                id="color"
                value={args.color}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-btn">
          <button onClick={handleEyeDropper} className="btn" type="button">
            Pick From Screen
          </button>
          <button onClick={handleProcess} className="btn" type="button">
            Process Video
            <FaArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}
