# Compositional Generator

An interactive generative art tool built with p5.js that creates abstract compositions using rectangles, drop shadows, and connecting lines.

## Features

- **16 Placement Modes**: Choose from various compositional strategies including:
  - Random, Rule of Thirds, Radial, Grid + Jitter
  - Symmetrical, Diagonal Bias, Center Cluster, Edge Focus
  - Horizontal Bands, Vertical Columns, Fibonacci Spiral
  - Corners Focus, X Pattern, Circle Ring, Scattered Clusters, Golden Ratio

- **Real-time Controls**:
  - Adjust number of elements (back and front layers)
  - Control maximum size for each layer
  - Modify corner radius
  - Adjust shadow offset depth
  - Change back layer grayscale values
  - Shift front layer colors

- **Interactive Features**:
  - Press any key to regenerate with new random arrangement
  - Press 'S' to save current composition as PNG
  - All controls update in real-time

## Usage

1. Open `index.html` in a web browser
2. Use the dropdown and sliders at the bottom to adjust the composition
3. Press any key (except 'S') to generate a new composition with the current settings
4. Press 'S' to save your composition

## Files

- `index.html` - Main HTML file
- `sketch.js` - p5.js sketch containing all the generative logic
- Uses p5.js from CDN (no installation required)

## Technical Details

- Built with p5.js
- Canvas size: 900x1040 pixels
- Two layered system: back layer (grayscale) and front layer (color)
- Drop shadows dynamically point toward canvas center
- Connecting lines drawn between consecutive elements

## License

Feel free to use and modify for your own projects!
