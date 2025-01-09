const getNearbyHexes = (
  row: number,
  col: number,
  rows: number,
  cols: number
) => {
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

// indexes of hexes connected to a side of a hex
const getHexConnectedToSide = (
  row: number,
  col: number,
  rows: number,
  cols: number,
  side: number
) => {
  const isOffset = row % 2 === 1;

  if (isOffset) {
    switch (side) {
      case 0: // Top-Right
        return row > 0 && col < cols - 1 ? [row - 1, col + 1] : null;
      case 1: // Right
        return col < cols - 1 ? [row, col + 1] : null;
      case 2: // Bottom-Right
        return row < rows - 1 && col < cols - 1 ? [row + 1, col + 1] : null;
      case 3: // Bottom-Left
        return row < rows - 1 && col > 0 ? [row + 1, col] : null;
      case 4: // Left
        return col > 0 ? [row, col - 1] : null;
      case 5: // Top-Left
        return row > 0 && col > 0 ? [row - 1, col] : null;
    }
  } else {
    switch (side) {
      case 0: // Top-Right
        return row > 0 && col < cols - 1 ? [row - 1, col] : null;
      case 1: // Right
        return col < cols - 1 ? [row, col + 1] : null;
      case 2: // Bottom-Right
        return row < rows - 1 && col < cols - 1 ? [row + 1, col] : null;
      case 3: // Bottom-Left
        return row < rows - 1 && col > 0 ? [row + 1, col - 1] : null;
      case 4: // Left
        return col > 0 ? [row, col - 1] : null;
      case 5: // Top-Left
        return row > 0 && col > 0 ? [row - 1, col - 1] : null;
    }
  }
};

export { getNearbyHexes, getHexConnectedToSide };
