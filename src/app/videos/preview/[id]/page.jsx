"use client";

import { useEffect, useState } from "react";
import { getThumbnail } from "../../../api/apiFunctions";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const videoName = "Ball.mp4";
  const [thumbnail, setThumbnail] = useState(null);
  const [color, setColor] = useState("#ffffff");
  const [threshold, setThreshold] = useState(0);
  const [args, setArgs] = useState({ color: "#ffffff", threshold: 0 });
  useEffect(() => {
    const loadThumbnail = async () => {
      const url = await getThumbnail(videoName);
      setThumbnail(url);
    };
    loadThumbnail();
  }, []);

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

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <h1>Preview and Options</h1>
      <img src={thumbnail} alt={`${videoName} thumbnail`}></img>
      <input
        type="color"
        name="color"
        id="color"
        value={args.color}
        onChange={handleChange}
      />
      <div>
        <label htmlFor="threshold">Adjust threshold:</label>
        <input
          type="range"
          id="threshold"
          name="threshold"
          min="0"
          max="150"
          value={args.threshold}
          onChange={handleChange}
        />
        <p>Current Value: {args.threshold}</p>
        <p>Color Value: {args.color}</p>
      </div>
      <button onClick={handleEyeDropper}>Pick From Screen</button>
    </div>
  );
}
