import React from "react";

function page() {
  const handleClick = () => {};
  return (
    <div>
      <table className="styled-table">
        <tr>
          <th>Id</th>
          <th>Video Name</th>
          <th>Video Path</th>
          <th>Duration</th>
          <th>Start Process</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Ball.mp4</td>
          <td>/app/public/videos/Ball.mp4</td>
          <td>0</td>
          <td>
            <button className="proc-btn">Process Video</button>
          </td>
        </tr>
      </table>
    </div>
  );
}
//list of all videos in the directory, and a link to preview page of that video

export default page;
