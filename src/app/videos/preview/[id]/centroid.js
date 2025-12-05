
export default function getCentroid(data, width, height) {
  // We track the running champion (largest group found)
  let maxGroup = { size: 0, sumX: 0, sumY: 0 };
  
  // A secondary array to keep track of pixels we've already counted
  // size is width * height (1 byte per pixel)
  const visited = new Uint8Array(width * height); 

  const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

  //find groups
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      
      const i = y * width + x;
      const rgbaIndex = i * 4;

      // if pixel is white (255) AND not visited yet
      if (data[rgbaIndex] === 255 && visited[i] === 0) {
        let currentSize = 0;
        let currentSumX = 0;
        let currentSumY = 0;
        
        const stack = [{x, y}];
        visited[i] = 1;

        while (stack.length > 0) {
          const { x: cx, y: cy } = stack.pop();

          currentSize++;
          currentSumX += cx;
          currentSumY += cy;

          // check neighbors
          for (let d = 0; d < directions.length; d++) {
            const newX = cx + directions[d][0];
            const newY = cy + directions[d][1];

            // check bounds
            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
              const ni = newY * width + newX;
              
              if (data[ni * 4] === 255 && visited[ni] === 0) {
                 visited[ni] = 1; 
                 stack.push({ x: newX, y: newY });
              }
            }
          }
        }
        
        if (currentSize > maxGroup.size) {
          maxGroup = { size: currentSize, sumX: currentSumX, sumY: currentSumY };
        }
      }
    }
  }

  //calculate centroid
  if (maxGroup.size > 0) {
    return {
      x: Math.floor(maxGroup.sumX / maxGroup.size),
      y: Math.floor(maxGroup.sumY / maxGroup.size)
    };
  }
  
  return null; // no white pixels found
}