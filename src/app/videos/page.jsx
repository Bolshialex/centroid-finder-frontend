"use client";
import React from "react";
import Link from "next/link";
import { getVideos } from "../api/apiFunctions";
import { useEffect, useState } from "react";
export default function Page() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (err) {
        console.error("Failed to fetch videos:", err.message);
      }
    };

    fetchVideos();
  }, []);

  const videoList = videos.map((video, index) => (
    <tr key={index}>
      <td>{video}</td>
      <td>
        <Link href={`/videos/preview/${encodeURIComponent(video)}`}>
          <button className="button">Preview Video</button>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div className="video-container">
      <div className="instructions">
        <h1>Video Processing Dashboard</h1>
        <p>
          Below is a list of all available videos stored on the server. You can
          preview each video before starting any processing task. Use the
          &quot;Preview Video&quot; button to open the video player and verify
          the file content, format, and duration.
        </p>
      </div>

      <table className="styled-table">
        {/* <thead>
          <tr>
            <th>Id</th>
            <th>Video Name</th>
            <th>Video Path</th>
            <th>Duration</th>
            <th>Start Process</th>
          </tr>
        </thead> */}
        <thead>
          <tr>
            <th>Video Name</th>
            <th>Preview</th>
          </tr>
        </thead>

        <tbody>{videoList}</tbody>
      </table>
    </div>
  );
}
//list of all videos in the directory, and a link to preview page of that video
