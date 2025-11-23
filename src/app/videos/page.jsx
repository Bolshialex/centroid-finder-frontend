import React from "react";
import Link from "next/link";

function page() {
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
        <thead>
          <tr>
            <th>Id</th>
            <th>Video Name</th>
            <th>Video Path</th>
            <th>Duration</th>
            <th>Start Process</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Ball.mp4</td>
            <td>/app/public/videos/vBall.mp4</td>
            <td>0</td>
            <td>
              <Link href={`/videos/preview/Ball.mp4`}>
                <button className="proc-btn">Preview Video</button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
//list of all videos in the directory, and a link to preview page of that video

export default page;
