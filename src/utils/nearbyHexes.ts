const nearbyHexes = (row: number, col: number, rows: number, cols: number) => {
  const nearby = [];
  const isOffset = row % 2 === 1;

  if (row > 0) {
    nearby.push([row - 1, col]); // Top
  }
  if (col > 0) {
    nearby.push([row, col - 1]); // Left
  }
  if (col < cols - 1) {
    nearby.push([row, col + 1]); // Right
  }
  if (row < rows - 1) {
    nearby.push([row + 1, col]); // Bottom
  }

  if (isOffset) {
    if (row > 0 && col < cols - 1) {
      nearby.push([row - 1, col + 1]); // Top-Right
    }
    if (row < rows - 1 && col < cols - 1) {
      nearby.push([row + 1, col + 1]); // Bottom-Right
    }
  } else {
    if (row > 0 && col > 0) {
      nearby.push([row - 1, col - 1]); // Top-Left
    }
    if (row < rows - 1 && col > 0) {
      nearby.push([row + 1, col - 1]); // Bottom-Left
    }
  }

  return nearby;
};

export default nearbyHexes;
