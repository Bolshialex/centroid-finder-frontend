import {useEffect, useState} from "react";
import {getThumbnail} from "../../../api/apiFunctions.jsx"
import { useRouter } from "next/router";
const router = useRouter();
const videoName = router.query.video;
const [thumbnail, setThumbnail] = useState(null);

useEffect(() => {
  const loadThumbnail = async () => {
    const url = await getThumbnail(videoName);
    setThumbnail(url);
  };

  loadThumbnail();
}, []);

export default function page() {
  const [color, setColor] = useState("#ffffff");

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) {
      alert("Your browser does not support the EyeDropper API.");
      return;
    }

    const eyeDropper = new EyeDropper();
    try {
      const result = await eyeDropper.open();
      setColor(result.sRGBHex); // set picked color in state
    } catch (err) {
      console.error("Eyedropper canceled or failed:", err);
    }
  };

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <h1>Preview and Options</h1>
      <img src={thumbnail} alt={`${videoName} thumbnail`}></img>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <button onClick={handleEyeDropper}>
        Pick From Screen
      </button>

      <span>{color}</span>
    </div>
  );
}
