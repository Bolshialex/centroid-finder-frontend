"use client";

import { useEffect, useState } from "react";
import { getThumbnail } from "../../../api/apiFunctions";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

export default function Page() {
  const router = useRouter();
  const videoName = "Ball.mp4";
  const [thumbnail, setThumbnail] = useState(null);

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
    <div className="preview-container">
      <h1>Preview and Options</h1>
      <div className="img-container">
        <div>
          <h3>Basic</h3>
          <img src={thumbnail} alt={`${videoName} thumbnail`} />
        </div>
        <div>
          <h3>Binarized</h3>
          <img src={thumbnail} alt={`${videoName} thumbnail`} />
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
              max="150"
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
          <button className="btn" type="button">
            Process Video
            <FaArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}
