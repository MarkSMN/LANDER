// Interactive control panel version with compositional placement modes
// Custom slider styling in CSS
var frontRectangles = [];
var middleRectangles = []; // NEW THIRD LAYER
var backRectangles = [];
var hueOffset = 0; // Random starting point in color wheel
var vanishingPoint = {x: 0, y: 0}; // Static vanishing point for shadows

// Auto pulse variables
var autoPulse = true;
var pulseStartPosition = 0;
var lastPulseTime = 0;

// Control parameters
var numBackSlider, numMiddleSlider, numFrontSlider; // Added middle slider
var backSizeSlider, middleSizeSlider, frontSizeSlider; // Added middle size slider
var cornerRadiusSlider;
var backGraySlider, middleGraySlider; // Added middle gray slider
var backDarknessSlider; // NEW: controls how dark the back layer is
var colorShiftSlider;
var placementModeSelect;
var shadowSlider;
var refreshButton;

// Antenna controls
var antennaDensitySlider; // Percentage of boxes that get antennas
var antennaLengthSlider; // Length multiplier relative to box size
var antennaSpeedSlider; // Rotation speed in RPM

// Add custom CSS for sliders and select
function addSliderStyles() {
  var style = createElement('style');
  style.html(`
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
    }
    
    /* Slider track */
    input[type="range"]::-webkit-slider-runnable-track {
      background: black;
      height: 1px;
    }
    
    input[type="range"]::-moz-range-track {
      background: black;
      height: 1px;
    }
    
    /* Slider thumb */
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      background: black;
      height: 12px;
      width: 12px;
      border-radius: 50%;
      margin-top: -5.5px;
    }
    
    input[type="range"]::-moz-range-thumb {
      background: black;
      height: 12px;
      width: 12px;
      border-radius: 50%;
      border: none;
    }
    
    /* Select dropdown styling */
    select {
      background: white;
      border: 2px solid black;
      padding: 4px 8px;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
    }
    
    /* Button styling */
    button {
      background: white;
      border: 2px solid black;
      padding: 6px 12px;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    button:hover {
      background: black;
      color: white;
    }
    
    select:hover {
      background: #f0f0f0;
    }
  `);
  style.parent(document.head);
}

function setup() {
  // Calculate canvas size based on window - fill entire viewport
  var canvasWidth = windowWidth;
  var canvasHeight = windowHeight;
  
  // Minimum width to fit controls in 2 rows
  var minWidth = 1000; // Less width needed now that we have 2 rows
  
  // Don't go smaller than minimum width
  if (canvasWidth < minWidth) {
    canvasWidth = minWidth;
  }
  
  createCanvas(canvasWidth, canvasHeight);
  pixelDensity(displayDensity()); // Match display pixel density for crisp rendering
  
  // Add custom slider styling
  addSliderStyles();
  
  // Create control panel - 9 COLUMNS
  // Column 1: Style dropdown
  // Columns 2-8: 2 sliders each (stacked vertically)
  // Column 9: Regenerate button
  
  var controlY1 = canvasHeight - 70; // Top row
  var controlY2 = canvasHeight - 35; // Bottom row
  var sliderWidth = 80;
  var columnWidth = 110; // Width of each column
  var fontSize = '11px';
  
  // Calculate centered starting position
  var totalColumns = 9;
  var totalWidth = (totalColumns - 1) * columnWidth;
  var startX = (canvasWidth - totalWidth) / 2;
  
  // COLUMN 1: Style dropdown (vertically centered, no label)
  var styleY = canvasHeight - 52; // Centered between the two rows
  placementModeSelect = createSelect();
  placementModeSelect.position(startX, styleY);
  placementModeSelect.option('Random');
  placementModeSelect.option('Rule of Thirds');
  placementModeSelect.option('Radial');
  placementModeSelect.option('Grid + Jitter');
  placementModeSelect.option('Symmetrical');
  placementModeSelect.option('Diagonal Bias');
  placementModeSelect.option('Center Cluster');
  placementModeSelect.option('Edge Focus');
  placementModeSelect.option('Horizontal Bands');
  placementModeSelect.option('Vertical Columns');
  placementModeSelect.option('Fibonacci Spiral');
  placementModeSelect.option('Corners Focus');
  placementModeSelect.option('X Pattern');
  placementModeSelect.option('Circle Ring');
  placementModeSelect.option('Scattered Clusters');
  placementModeSelect.option('Golden Ratio');
  placementModeSelect.style('width', '100px');
  placementModeSelect.changed(generateRectangles);
  
  // COLUMN 2: back elements (top) / back shade (bottom)
  createP('back elements').position(startX + columnWidth, controlY1).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  numBackSlider = createSlider(2, 25, 5);
  numBackSlider.position(startX + columnWidth, controlY1 + 15);
  numBackSlider.style('width', sliderWidth + 'px');
  numBackSlider.input(adjustBackCount);
  
  createP('back shade').position(startX + columnWidth, controlY2).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  backDarknessSlider = createSlider(0, 100, 40);
  backDarknessSlider.position(startX + columnWidth, controlY2 + 15);
  backDarknessSlider.style('width', sliderWidth + 'px');
  backDarknessSlider.input(updateBackColors);
  
  // COLUMN 3: middle elements (top) / middle brightness (bottom)
  createP('middle elements').position(startX + columnWidth * 2, controlY1).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  numMiddleSlider = createSlider(2, 25, 5);
  numMiddleSlider.position(startX + columnWidth * 2, controlY1 + 15);
  numMiddleSlider.style('width', sliderWidth + 'px');
  numMiddleSlider.input(adjustMiddleCount);
  
  createP('middle brightness').position(startX + columnWidth * 2, controlY2).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  middleGraySlider = createSlider(100, 220, 150);
  middleGraySlider.position(startX + columnWidth * 2, controlY2 + 15);
  middleGraySlider.style('width', sliderWidth + 'px');
  middleGraySlider.input(updateMiddleColors);
  
  // COLUMN 4: front elements (top) / color shift (bottom)
  createP('front elements').position(startX + columnWidth * 3, controlY1).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  numFrontSlider = createSlider(2, 25, 5);
  numFrontSlider.position(startX + columnWidth * 3, controlY1 + 15);
  numFrontSlider.style('width', sliderWidth + 'px');
  numFrontSlider.input(adjustFrontCount);
  
  createP('color shift').position(startX + columnWidth * 3, controlY2).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  colorShiftSlider = createSlider(0, 360, 0);
  colorShiftSlider.position(startX + columnWidth * 3, controlY2 + 15);
  colorShiftSlider.style('width', sliderWidth + 'px');
  colorShiftSlider.input(function() {
    updateBackColors();
    updateFrontColors();
  });
  
  // COLUMN 5: back size (top) / antenna density (bottom)
  createP('back size').position(startX + columnWidth * 4, controlY1).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  backSizeSlider = createSlider(100, 600, 400);
  backSizeSlider.position(startX + columnWidth * 4, controlY1 + 15);
  backSizeSlider.style('width', sliderWidth + 'px');
  backSizeSlider.input(updateBackSizes);
  
  createP('antenna density').position(startX + columnWidth * 4, controlY2).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  antennaDensitySlider = createSlider(0, 100, 30);
  antennaDensitySlider.position(startX + columnWidth * 4, controlY2 + 15);
  antennaDensitySlider.style('width', sliderWidth + 'px');
  antennaDensitySlider.input(regenerateAntennas);
  
  // COLUMN 6: middle size (top) / antenna length (bottom)
  createP('middle size').position(startX + columnWidth * 5, controlY1).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  middleSizeSlider = createSlider(75, 500, 300);
  middleSizeSlider.position(startX + columnWidth * 5, controlY1 + 15);
  middleSizeSlider.style('width', sliderWidth + 'px');
  middleSizeSlider.input(updateMiddleSizes);
  
  createP('antenna length').position(startX + columnWidth * 5, controlY2).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  antennaLengthSlider = createSlider(50, 200, 100);
  antennaLengthSlider.position(startX + columnWidth * 5, controlY2 + 15);
  antennaLengthSlider.style('width', sliderWidth + 'px');
  antennaLengthSlider.input(regenerateAntennas);
  
  // COLUMN 7: front size (top) / antenna RPM (bottom)
  createP('front size').position(startX + columnWidth * 6, controlY1).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  frontSizeSlider = createSlider(50, 400, 250);
  frontSizeSlider.position(startX + columnWidth * 6, controlY1 + 15);
  frontSizeSlider.style('width', sliderWidth + 'px');
  frontSizeSlider.input(updateFrontSizes);
  
  createP('antenna RPM').position(startX + columnWidth * 6, controlY2).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  antennaSpeedSlider = createSlider(1, 10, 3);
  antennaSpeedSlider.position(startX + columnWidth * 6, controlY2 + 15);
  antennaSpeedSlider.style('width', sliderWidth + 'px');
  
  // COLUMN 8: corner radius (top) / shadow offset (bottom)
  createP('corner radius').position(startX + columnWidth * 7, controlY1).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  cornerRadiusSlider = createSlider(0, 50, 10);
  cornerRadiusSlider.position(startX + columnWidth * 7, controlY1 + 15);
  cornerRadiusSlider.style('width', sliderWidth + 'px');
  
  createP('shadow offset').position(startX + columnWidth * 7, controlY2).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', fontSize);
  shadowSlider = createSlider(0, 30, 15);
  shadowSlider.position(startX + columnWidth * 7, controlY2 + 15);
  shadowSlider.style('width', sliderWidth + 'px');
  
  // COLUMN 9: Regenerate button (vertically centered, label inside button)
  var regenY = canvasHeight - 52; // Centered between the two rows
  refreshButton = createButton('regenerate');
  refreshButton.position(startX + columnWidth * 8, regenY);
  refreshButton.style('width', '100px');
  refreshButton.style('height', '24px');
  refreshButton.mousePressed(generateRectangles);
  
  generateRectangles();
}

function draw() {
  background(255/2);
  
  // Auto pulse: 0→360 over 10 sec, then 360→0 over 10 sec (20 sec total cycle)
  if (autoPulse) {
    var currentTime = millis();
    var cycleTime = (currentTime % 20000) / 1000; // 0-20 seconds in cycle
    
    if (cycleTime < 10) {
      // First 10 seconds: 0 → 360
      var shift = (cycleTime / 10) * 360;
      colorShiftSlider.value(shift);
    } else {
      // Next 10 seconds: 360 → 0
      var shift = ((20 - cycleTime) / 10) * 360;
      colorShiftSlider.value(shift);
    }
    
    // Manually trigger color updates
    updateBackColors();
    updateFrontColors();
  }
  
  var cornerRad = cornerRadiusSlider.value();
  
  var centerX = width / 2;
  var drawingHeight = height - 40; // Height minus control strip
  var centerY = drawingHeight / 2; // Center of drawable area
  
  // BACK LAYER - Draw drop shadows first
  for (var i = 0; i < backRectangles.length; i++) {
    var rectangle = backRectangles[i];
    drawDropShadow(rectangle, centerX, centerY, cornerRad);
  }
  
  // BACK LAYER - Draw tangent lines (BLACK)
  stroke(0);
  strokeWeight(2);
  for (var i = 0; i < backRectangles.length; i++) {
    var rectangle = backRectangles[i];
    var nextRectangle = backRectangles[(i + 1) % backRectangles.length];
    var tangents = calculateCommonTangents(rectangle, nextRectangle);
    for (var k = 0; k < tangents.length; k += 2) {
      var tangentA = tangents[k];
      var tangentB = tangents[k + 1];
      line(tangentA.x, tangentA.y, tangentB.x, tangentB.y);
    }
  }
  
  // BACK LAYER - Draw rectangles
  for (var i = 0; i < backRectangles.length; i++) {
    var rectangle = backRectangles[i];
    fill(rectangle.color);
    stroke(0);
    strokeWeight(2);
    rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height, cornerRad);
  }
  
  // BACK LAYER - Draw antennas
  drawLayerAntennas(backRectangles);
  
  // MIDDLE LAYER - Draw drop shadows first (NEW)
  for (var i = 0; i < middleRectangles.length; i++) {
    var rectangle = middleRectangles[i];
    drawDropShadow(rectangle, centerX, centerY, cornerRad);
  }
  
  // MIDDLE LAYER - Draw tangent lines (BLACK) (NEW)
  stroke(0);
  strokeWeight(2);
  for (var i = 0; i < middleRectangles.length; i++) {
    var rectangle = middleRectangles[i];
    var nextRectangle = middleRectangles[(i + 1) % middleRectangles.length];
    var tangents = calculateCommonTangents(rectangle, nextRectangle);
    for (var k = 0; k < tangents.length; k += 2) {
      var tangentA = tangents[k];
      var tangentB = tangents[k + 1];
      line(tangentA.x, tangentA.y, tangentB.x, tangentB.y);
    }
  }
  
  // MIDDLE LAYER - Draw rectangles (NEW)
  for (var i = 0; i < middleRectangles.length; i++) {
    var rectangle = middleRectangles[i];
    fill(rectangle.color);
    stroke(0);
    strokeWeight(2);
    rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height, cornerRad);
  }
  
  // MIDDLE LAYER - Draw antennas
  drawLayerAntennas(middleRectangles);
  
  // FRONT LAYER - Draw drop shadows first
  for (var i = 0; i < frontRectangles.length; i++) {
    var rectangle = frontRectangles[i];
    drawDropShadow(rectangle, centerX, centerY, cornerRad);
  }
  
  // FRONT LAYER - Draw tangent lines (BLACK)
  stroke(0);
  strokeWeight(2);
  for (var i = 0; i < frontRectangles.length; i++) {
    var rectangle = frontRectangles[i];
    var nextRectangle = frontRectangles[(i + 1) % frontRectangles.length];
    var tangents = calculateCommonTangents(rectangle, nextRectangle);
    for (var k = 0; k < tangents.length; k += 2) {
      var tangentA = tangents[k];
      var tangentB = tangents[k + 1];
      line(tangentA.x, tangentA.y, tangentB.x, tangentB.y);
    }
  }
  
  // FRONT LAYER - Draw rectangles
  for (var i = 0; i < frontRectangles.length; i++) {
    var rectangle = frontRectangles[i];
    fill(rectangle.color);
    stroke(0);
    strokeWeight(2);
    rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height, cornerRad);
  }
  
  // FRONT LAYER - Draw antennas
  drawLayerAntennas(frontRectangles);
}

function drawDropShadow(rectangle, centerX, centerY, cornerRad) {
  var shadowOffset = shadowSlider.value();
  
  var rectCenterX = rectangle.x + rectangle.width / 2;
  var rectCenterY = rectangle.y + rectangle.height / 2;
  
  // Calculate angle from vanishing point to rectangle center
  var angle = atan2(rectCenterY - vanishingPoint.y, rectCenterX - vanishingPoint.x);
  
  var shadowX = rectangle.x + cos(angle) * shadowOffset;
  var shadowY = rectangle.y + sin(angle) * shadowOffset;
  
  fill(0, 0, 0, 80);
  noStroke(); // Remove black stroke
  rect(shadowX, shadowY, rectangle.width, rectangle.height, cornerRad);
}

function generateRectangles() {
  backRectangles = [];
  middleRectangles = []; // NEW
  frontRectangles = [];
  
  // Set a new random vanishing point within the canvas
  var maxY = height - 40; // Drawing area height
  vanishingPoint = {
    x: random(width * 0.2, width * 0.8),
    y: random(maxY * 0.2, maxY * 0.8)
  };
  
  var numBack = numBackSlider.value();
  var numMiddle = numMiddleSlider.value(); // NEW
  var numFront = numFrontSlider.value();
  var backMaxSize = backSizeSlider.value();
  var middleMaxSize = middleSizeSlider.value(); // NEW
  var frontMaxSize = frontSizeSlider.value();
  var middleGrayValue = middleGraySlider.value(); // NEW
  var mode = placementModeSelect.value();
  
  // BACK LAYER
  for (var i = 0; i < numBack; i++) {
    var pos = generatePosition(mode, maxY, i, numBack);
    var x = pos.x;
    var y = pos.y;
    
    var sizeCategory = random();
    var sizeType;
    
    if (sizeCategory < 0.3) {
      sizeType = 'LARGE';
    } else if (sizeCategory < 0.6) {
      sizeType = 'MEDIUM';
    } else {
      sizeType = random() < 0.5 ? 'SMALL' : 'BEAM';
    }
    
    // Use color instead of gray
    var rectangleColor = color(x / width * 255, y / maxY * 255, 150);
    
    backRectangles.push({ 
      x: x, 
      y: y, 
      sizeType: sizeType,
      sizeRatioW: random(),
      sizeRatioH: random(),
      color: rectangleColor 
    });
  }
  
  // MIDDLE LAYER (NEW)
  for (var i = 0; i < numMiddle; i++) {
    var pos = generatePosition(mode, maxY, i, numMiddle);
    var x = pos.x;
    var y = pos.y;
    
    var sizeCategory = random();
    var sizeType;
    
    if (sizeCategory < 0.25) {
      sizeType = 'LARGE';
    } else if (sizeCategory < 0.55) {
      sizeType = 'MEDIUM';
    } else {
      sizeType = random() < 0.5 ? 'SMALL' : 'PANEL';
    }
    
    var grayVariation = random(-30, 30);
    var individualGray = constrain(middleGrayValue + grayVariation, 100, 220);
    var rectangleColor = color(individualGray, individualGray, individualGray);
    
    middleRectangles.push({ 
      x: x, 
      y: y, 
      sizeType: sizeType,
      sizeRatioW: random(),
      sizeRatioH: random(),
      grayVariation: grayVariation,
      color: rectangleColor 
    });
  }
  
  // FRONT LAYER
  for (var i = 0; i < numFront; i++) {
    var pos = generatePosition(mode, maxY, i, numFront);
    var x = pos.x;
    var y = pos.y;
    
    var sizeCategory = random();
    var sizeType;
    
    if (sizeCategory < 0.2) {
      sizeType = 'TINY';
    } else if (sizeCategory < 0.5) {
      sizeType = 'SMALL';
    } else if (sizeCategory < 0.8) {
      sizeType = 'MEDIUM';
    } else {
      sizeType = random() < 0.6 ? 'PANEL' : 'LARGE';
    }
    
    var rectangleColor = color(x / width * 255, y / maxY * 255, 150);
    
    frontRectangles.push({ 
      x: x, 
      y: y, 
      sizeType: sizeType,
      sizeRatioW: random(),
      sizeRatioH: random(),
      color: rectangleColor 
    });
  }
  
  updateBackSizes();
  updateMiddleSizes(); // NEW
  updateFrontSizes();
  updateBackColors(); // Apply darkness to back layer
  updateFrontColors();
  
  // Generate antennas for all layers
  generateAntennas();
}

function generatePosition(mode, maxY, index, total) {
  var x, y;
  var margin = 50;
  
  if (mode === 'Random') {
    x = random(margin, width - margin);
    y = random(margin, maxY - margin);
  } else if (mode === 'Rule of Thirds') {
    var gridX = [width * 0.333, width * 0.5, width * 0.667];
    var gridY = [maxY * 0.333, maxY * 0.5, maxY * 0.667];
    x = random(gridX) + random(-50, 50);
    y = random(gridY) + random(-50, 50);
  } else if (mode === 'Radial') {
    var angle = (index / total) * TWO_PI;
    var radius = min(width, maxY) * 0.3 + random(-50, 50);
    x = width/2 + cos(angle) * radius;
    y = maxY/2 + sin(angle) * radius;
  } else if (mode === 'Grid + Jitter') {
    var cols = floor(sqrt(total)) + 1;
    var cellW = (width - margin * 2) / cols;
    var cellH = (maxY - margin * 2) / cols;
    var col = index % cols;
    var row = floor(index / cols);
    x = margin + col * cellW + cellW/2 + random(-cellW * 0.3, cellW * 0.3);
    y = margin + row * cellH + cellH/2 + random(-cellH * 0.3, cellH * 0.3);
  } else if (mode === 'Symmetrical') {
    var halfTotal = ceil(total / 2);
    if (index < halfTotal) {
      x = random(margin, width/2 - margin);
      y = random(margin, maxY - margin);
    } else {
      var mirrorIdx = index - halfTotal;
      x = width - (random(margin, width/2 - margin));
      y = random(margin, maxY - margin);
    }
  } else if (mode === 'Diagonal Bias') {
    var t = index / total;
    x = lerp(margin, width - margin, t) + random(-100, 100);
    y = lerp(margin, maxY - margin, t) + random(-100, 100);
  } else if (mode === 'Center Cluster') {
    var radius = random(0, min(width, maxY) * 0.25);
    var angle = random(TWO_PI);
    x = width/2 + cos(angle) * radius;
    y = maxY/2 + sin(angle) * radius;
  } else if (mode === 'Edge Focus') {
    var edge = floor(random(4));
    if (edge === 0) { // top
      x = random(margin, width - margin);
      y = random(margin, maxY * 0.25);
    } else if (edge === 1) { // right
      x = random(width * 0.75, width - margin);
      y = random(margin, maxY - margin);
    } else if (edge === 2) { // bottom
      x = random(margin, width - margin);
      y = random(maxY * 0.75, maxY - margin);
    } else { // left
      x = random(margin, width * 0.25);
      y = random(margin, maxY - margin);
    }
  } else if (mode === 'Horizontal Bands') {
    var numBands = 3;
    var band = floor(random(numBands));
    var bandHeight = maxY / numBands;
    x = random(margin, width - margin);
    y = band * bandHeight + random(margin, bandHeight - margin);
  } else if (mode === 'Vertical Columns') {
    var numCols = 3;
    var col = floor(random(numCols));
    var colWidth = width / numCols;
    x = col * colWidth + random(margin, colWidth - margin);
    y = random(margin, maxY - margin);
  } else if (mode === 'Fibonacci Spiral') {
    var phi = (1 + sqrt(5)) / 2;
    var angle = index * 137.5 * (PI / 180);
    var radius = sqrt(index) * 20;
    x = width/2 + cos(angle) * radius;
    y = maxY/2 + sin(angle) * radius;
  } else if (mode === 'Corners Focus') {
    var corner = floor(random(4));
    var cornerDist = random(0, min(width, maxY) * 0.3);
    var cornerAngle = random(TWO_PI);
    if (corner === 0) { // top-left
      x = margin + cos(cornerAngle) * cornerDist;
      y = margin + sin(cornerAngle) * cornerDist;
    } else if (corner === 1) { // top-right
      x = width - margin + cos(cornerAngle) * cornerDist;
      y = margin + sin(cornerAngle) * cornerDist;
    } else if (corner === 2) { // bottom-right
      x = width - margin + cos(cornerAngle) * cornerDist;
      y = maxY - margin + sin(cornerAngle) * cornerDist;
    } else { // bottom-left
      x = margin + cos(cornerAngle) * cornerDist;
      y = maxY - margin + sin(cornerAngle) * cornerDist;
    }
  } else if (mode === 'X Pattern') {
    var t = index / total;
    if (random() < 0.5) {
      x = lerp(margin, width - margin, t) + random(-50, 50);
      y = lerp(margin, maxY - margin, t) + random(-50, 50);
    } else {
      x = lerp(width - margin, margin, t) + random(-50, 50);
      y = lerp(margin, maxY - margin, t) + random(-50, 50);
    }
  } else if (mode === 'Circle Ring') {
    var angle = (index / total) * TWO_PI + random(-0.3, 0.3);
    var radius = min(width, maxY) * 0.35;
    x = width/2 + cos(angle) * radius;
    y = maxY/2 + sin(angle) * radius;
  } else if (mode === 'Scattered Clusters') {
    var numClusters = 4;
    var cluster = floor(random(numClusters));
    var clusterCenters = [
      {x: width * 0.25, y: maxY * 0.25},
      {x: width * 0.75, y: maxY * 0.25},
      {x: width * 0.25, y: maxY * 0.75},
      {x: width * 0.75, y: maxY * 0.75}
    ];
    var center = clusterCenters[cluster];
    var clusterRadius = min(width, maxY) * 0.15;
    var angle = random(TWO_PI);
    var radius = random(0, clusterRadius);
    x = center.x + cos(angle) * radius;
    y = center.y + sin(angle) * radius;
  } else if (mode === 'Golden Ratio') {
    var phi = (1 + sqrt(5)) / 2;
    var t = index / total;
    x = lerp(margin, width - margin, t / phi) + random(-50, 50);
    y = lerp(margin, maxY - margin, (t * phi) % 1) + random(-50, 50);
  } else {
    x = random(margin, width - margin);
    y = random(margin, maxY - margin);
  }
  
  return {x: x, y: y};
}

function updateBackSizes() {
  var backMaxSize = backSizeSlider.value();
  
  for (var i = 0; i < backRectangles.length; i++) {
    var rect = backRectangles[i];
    var rectWidth, rectHeight;
    
    if (rect.sizeType === 'SMALL') {
      rectWidth = lerp(backMaxSize * 0.2, backMaxSize * 0.45, rect.sizeRatioW);
      rectHeight = lerp(backMaxSize * 0.2, backMaxSize * 0.45, rect.sizeRatioH);
    } else if (rect.sizeType === 'MEDIUM') {
      rectWidth = lerp(backMaxSize * 0.45, backMaxSize * 0.75, rect.sizeRatioW);
      rectHeight = lerp(backMaxSize * 0.35, backMaxSize * 0.65, rect.sizeRatioH);
    } else if (rect.sizeType === 'BEAM') {
      rectWidth = lerp(backMaxSize * 0.65, backMaxSize * 1.3, rect.sizeRatioW);
      rectHeight = lerp(35, backMaxSize * 0.35, rect.sizeRatioH);
    } else {
      rectWidth = lerp(backMaxSize * 0.65, backMaxSize * 1.05, rect.sizeRatioW);
      rectHeight = lerp(backMaxSize * 0.55, backMaxSize * 0.95, rect.sizeRatioH);
    }
    
    rect.width = rectWidth;
    rect.height = rectHeight;
  }
}

function updateMiddleSizes() { // NEW
  var middleMaxSize = middleSizeSlider.value();
  
  for (var i = 0; i < middleRectangles.length; i++) {
    var rect = middleRectangles[i];
    var rectWidth, rectHeight;
    
    if (rect.sizeType === 'SMALL') {
      rectWidth = lerp(middleMaxSize * 0.2, middleMaxSize * 0.48, rect.sizeRatioW);
      rectHeight = lerp(middleMaxSize * 0.2, middleMaxSize * 0.48, rect.sizeRatioH);
    } else if (rect.sizeType === 'MEDIUM') {
      rectWidth = lerp(middleMaxSize * 0.48, middleMaxSize * 0.8, rect.sizeRatioW);
      rectHeight = lerp(middleMaxSize * 0.4, middleMaxSize * 0.72, rect.sizeRatioH);
    } else if (rect.sizeType === 'PANEL') {
      rectWidth = lerp(middleMaxSize * 0.72, middleMaxSize * 1.4, rect.sizeRatioW);
      rectHeight = lerp(40, middleMaxSize * 0.4, rect.sizeRatioH);
    } else {
      rectWidth = lerp(middleMaxSize * 0.72, middleMaxSize * 1.12, rect.sizeRatioW);
      rectHeight = lerp(middleMaxSize * 0.64, middleMaxSize * 1.04, rect.sizeRatioH);
    }
    
    rect.width = rectWidth;
    rect.height = rectHeight;
  }
}

function updateFrontSizes() {
  var frontMaxSize = frontSizeSlider.value();
  
  for (var i = 0; i < frontRectangles.length; i++) {
    var rect = frontRectangles[i];
    var rectWidth, rectHeight;
    
    if (rect.sizeType === 'TINY') {
      rectWidth = lerp(frontMaxSize * 0.1, frontMaxSize * 0.22, rect.sizeRatioW);
      rectHeight = lerp(frontMaxSize * 0.1, frontMaxSize * 0.22, rect.sizeRatioH);
    } else if (rect.sizeType === 'SMALL') {
      rectWidth = lerp(frontMaxSize * 0.2, frontMaxSize * 0.48, rect.sizeRatioW);
      rectHeight = lerp(frontMaxSize * 0.2, frontMaxSize * 0.48, rect.sizeRatioH);
    } else if (rect.sizeType === 'MEDIUM') {
      rectWidth = lerp(frontMaxSize * 0.48, frontMaxSize * 0.8, rect.sizeRatioW);
      rectHeight = lerp(frontMaxSize * 0.4, frontMaxSize * 0.72, rect.sizeRatioH);
    } else if (rect.sizeType === 'PANEL') {
      rectWidth = lerp(frontMaxSize * 0.72, frontMaxSize * 1.4, rect.sizeRatioW);
      rectHeight = lerp(40, frontMaxSize * 0.4, rect.sizeRatioH);
    } else {
      rectWidth = lerp(frontMaxSize * 0.72, frontMaxSize * 1.12, rect.sizeRatioW);
      rectHeight = lerp(frontMaxSize * 0.64, frontMaxSize * 1.04, rect.sizeRatioH);
    }
    
    rect.width = rectWidth;
    rect.height = rectHeight;
  }
}

function adjustBackCount() {
  var targetCount = numBackSlider.value();
  var currentCount = backRectangles.length;
  var backMaxSize = backSizeSlider.value();
  var maxY = height - 40; // Drawing area height
  var mode = placementModeSelect.value();
  
  if (targetCount > currentCount) {
    for (var i = currentCount; i < targetCount; i++) {
      var pos = generatePosition(mode, maxY, i, targetCount);
      var x = pos.x;
      var y = pos.y;
      
      var sizeCategory = random();
      var sizeType;
      
      if (sizeCategory < 0.3) {
        sizeType = 'LARGE';
      } else if (sizeCategory < 0.6) {
        sizeType = 'MEDIUM';
      } else {
        sizeType = random() < 0.5 ? 'SMALL' : 'BEAM';
      }
      
      var rectangleColor = color(x / width * 255, y / maxY * 255, 150);
      
      backRectangles.push({ 
        x: x, 
        y: y, 
        sizeType: sizeType,
        sizeRatioW: random(),
        sizeRatioH: random(),
        color: rectangleColor 
      });
    }
    updateBackSizes();
  } else if (targetCount < currentCount) {
    backRectangles.splice(targetCount);
  }
}

function adjustMiddleCount() { // NEW
  var targetCount = numMiddleSlider.value();
  var currentCount = middleRectangles.length;
  var grayValue = middleGraySlider.value();
  var middleMaxSize = middleSizeSlider.value();
  var maxY = height - 40; // Drawing area height
  var mode = placementModeSelect.value();
  
  if (targetCount > currentCount) {
    for (var i = currentCount; i < targetCount; i++) {
      var pos = generatePosition(mode, maxY, i, targetCount);
      var x = pos.x;
      var y = pos.y;
      
      var sizeCategory = random();
      var sizeType;
      
      if (sizeCategory < 0.25) {
        sizeType = 'LARGE';
      } else if (sizeCategory < 0.55) {
        sizeType = 'MEDIUM';
      } else {
        sizeType = random() < 0.5 ? 'SMALL' : 'PANEL';
      }
      
      var grayVariation = random(-30, 30);
      var individualGray = constrain(grayValue + grayVariation, 100, 220);
      var rectangleColor = color(individualGray, individualGray, individualGray);
      
      middleRectangles.push({ 
        x: x, 
        y: y, 
        sizeType: sizeType,
        sizeRatioW: random(),
        sizeRatioH: random(),
        grayVariation: grayVariation,
        color: rectangleColor 
      });
    }
    updateMiddleSizes();
  } else if (targetCount < currentCount) {
    middleRectangles.splice(targetCount);
  }
}

function adjustFrontCount() {
  var targetCount = numFrontSlider.value();
  var currentCount = frontRectangles.length;
  var frontMaxSize = frontSizeSlider.value();
  var maxY = height - 40; // Drawing area height
  var mode = placementModeSelect.value();
  
  if (targetCount > currentCount) {
    for (var i = currentCount; i < targetCount; i++) {
      var pos = generatePosition(mode, maxY, i, targetCount);
      var x = pos.x;
      var y = pos.y;
      
      var sizeCategory = random();
      var sizeType;
      
      if (sizeCategory < 0.2) {
        sizeType = 'TINY';
      } else if (sizeCategory < 0.5) {
        sizeType = 'SMALL';
      } else if (sizeCategory < 0.8) {
        sizeType = 'MEDIUM';
      } else {
        sizeType = random() < 0.6 ? 'PANEL' : 'LARGE';
      }
      
      var rectangleColor = color(x / width * 255, y / maxY * 255, 150);
      
      frontRectangles.push({ 
        x: x, 
        y: y, 
        sizeType: sizeType,
        sizeRatioW: random(),
        sizeRatioH: random(),
        color: rectangleColor 
      });
    }
    updateFrontSizes();
  } else if (targetCount < currentCount) {
    frontRectangles.splice(targetCount);
  }
}

function updateBackColors() {
  var shiftAmount = colorShiftSlider.value();
  var darknessAmount = backDarknessSlider.value() / 100; // 0 to 1 scale
  var maxY = height - 40; // Drawing area height
  
  for (var i = 0; i < backRectangles.length; i++) {
    var rect = backRectangles[i];
    var x = rect.x;
    var y = rect.y;
    
    var baseR = x / width * 255;
    var baseG = y / maxY * 255;
    var baseB = 150;
    
    var shiftPercent = shiftAmount / 360;
    
    var finalR, finalG, finalB;
    
    if (shiftPercent < 0.33) {
      var t = shiftPercent * 3;
      finalR = lerp(baseR, baseG, t);
      finalG = lerp(baseG, baseB, t);
      finalB = lerp(baseB, baseR, t);
    } else if (shiftPercent < 0.67) {
      var t = (shiftPercent - 0.33) * 3;
      finalR = lerp(baseG, baseB, t);
      finalG = lerp(baseB, baseR, t);
      finalB = lerp(baseR, baseG, t);
    } else {
      var t = (shiftPercent - 0.67) * 3;
      finalR = lerp(baseB, baseR, t);
      finalG = lerp(baseR, baseG, t);
      finalB = lerp(baseG, baseB, t);
    }
    
    // Apply darkness by lerping towards black
    finalR = finalR * (1 - darknessAmount);
    finalG = finalG * (1 - darknessAmount);
    finalB = finalB * (1 - darknessAmount);
    
    rect.color = color(finalR, finalG, finalB);
  }
}

function updateMiddleColors() { // NEW
  var grayValue = middleGraySlider.value();
  for (var i = 0; i < middleRectangles.length; i++) {
    var rect = middleRectangles[i];
    var individualGray = constrain(grayValue + rect.grayVariation, 100, 220);
    rect.color = color(individualGray, individualGray, individualGray);
  }
}

function updateFrontColors() {
  var shiftAmount = colorShiftSlider.value();
  var maxY = height - 40; // Drawing area height
  
  for (var i = 0; i < frontRectangles.length; i++) {
    var rect = frontRectangles[i];
    var x = rect.x;
    var y = rect.y;
    
    var baseR = x / width * 255;
    var baseG = y / maxY * 255;
    var baseB = 150;
    
    var shiftPercent = shiftAmount / 360;
    
    if (shiftPercent < 0.33) {
      var t = shiftPercent * 3;
      rect.color = color(
        lerp(baseR, baseG, t),
        lerp(baseG, baseB, t),
        lerp(baseB, baseR, t)
      );
    } else if (shiftPercent < 0.67) {
      var t = (shiftPercent - 0.33) * 3;
      rect.color = color(
        lerp(baseG, baseB, t),
        lerp(baseB, baseR, t),
        lerp(baseR, baseG, t)
      );
    } else {
      var t = (shiftPercent - 0.67) * 3;
      rect.color = color(
        lerp(baseB, baseR, t),
        lerp(baseR, baseG, t),
        lerp(baseG, baseB, t)
      );
    }
  }
}

function calculateCommonTangents(rectangle1, rectangle2) {
  var tangentPoint1 = {
    x: rectangle1.x + rectangle1.width / 2,
    y: rectangle1.y + rectangle1.height / 2,
  };
  var tangentPoint2 = {
    x: rectangle2.x + rectangle2.width / 2,
    y: rectangle2.y + rectangle2.height / 2,
  };
  return [tangentPoint1, tangentPoint2];
}

// ANTENNA FUNCTIONS
function generateAntennas() {
  var density = antennaDensitySlider.value() / 100; // 0 to 1
  var lengthMultiplier = antennaLengthSlider.value() / 100; // 0.5 to 2
  
  // Generate antennas for all layers
  var allRects = [backRectangles, middleRectangles, frontRectangles];
  
  for (var layer of allRects) {
    for (var rect of layer) {
      // Decide if this rectangle gets an antenna based on density
      if (random() < density) {
        // 8 possible positions: 4 corners + 4 edge midpoints
        // All offset inside by 15px from the edge
        var offset = 15;
        var position = floor(random(8));
        var pivotX, pivotY;
        
        if (position === 0) { // top-left corner
          pivotX = rect.x + offset;
          pivotY = rect.y + offset;
        } else if (position === 1) { // top-center
          pivotX = rect.x + rect.width / 2;
          pivotY = rect.y + offset;
        } else if (position === 2) { // top-right corner
          pivotX = rect.x + rect.width - offset;
          pivotY = rect.y + offset;
        } else if (position === 3) { // right-center
          pivotX = rect.x + rect.width - offset;
          pivotY = rect.y + rect.height / 2;
        } else if (position === 4) { // bottom-right corner
          pivotX = rect.x + rect.width - offset;
          pivotY = rect.y + rect.height - offset;
        } else if (position === 5) { // bottom-center
          pivotX = rect.x + rect.width / 2;
          pivotY = rect.y + rect.height - offset;
        } else if (position === 6) { // bottom-left corner
          pivotX = rect.x + offset;
          pivotY = rect.y + rect.height - offset;
        } else { // left-center
          pivotX = rect.x + offset;
          pivotY = rect.y + rect.height / 2;
        }
        
        // Antenna length based on average of width and height
        var baseLength = (rect.width + rect.height) / 2;
        var antennaLength = baseLength * lengthMultiplier * random(0.8, 1.2);
        
        // Random starting angle
        var startAngle = random(TWO_PI);
        
        // Random direction: CW (-1) or CCW (1)
        var direction = random() < 0.5 ? 1 : -1;
        
        rect.antenna = {
          pivotX: pivotX,
          pivotY: pivotY,
          length: antennaLength,
          angle: startAngle,
          direction: direction
        };
      } else {
        rect.antenna = null;
      }
    }
  }
}

function regenerateAntennas() {
  // Just regenerate antennas without regenerating rectangles
  generateAntennas();
}

function drawLayerAntennas(layer) {
  var rpm = antennaSpeedSlider.value();
  var radiansPerFrame = (rpm * TWO_PI) / (60 * 60); // Convert RPM to radians per frame (assuming 60fps)
  
  for (var rect of layer) {
    if (rect.antenna) {
      var ant = rect.antenna;
      
      // Update angle
      ant.angle += radiansPerFrame * ant.direction;
      
      // Calculate end point
      var endX = ant.pivotX + cos(ant.angle) * ant.length;
      var endY = ant.pivotY + sin(ant.angle) * ant.length;
      
      // Draw antenna line with round cap (3pt stroke)
      stroke(0);
      strokeWeight(3);
      strokeCap(ROUND);
      line(ant.pivotX, ant.pivotY, endX, endY);
      
      // Draw pivot circle (dark gray with black stroke, 13px diameter)
      fill(100);
      stroke(0);
      strokeWeight(2);
      circle(ant.pivotX, ant.pivotY, 13);
      
      // Draw end cap circle
      fill(0);
      noStroke();
      circle(endX, endY, 6);
    }
  }
  
  // Reset stroke cap to default
  strokeCap(SQUARE);
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    var timestamp = year() + "-" + month() + "-" + day() + "_" + hour() + "-" + minute() + "-" + second();
    saveCanvas('lander_' + timestamp, 'png');
  } else {
    generateRectangles();
  }
}

function windowResized() {
  // Recalculate canvas size - fill entire viewport
  var canvasWidth = windowWidth;
  var canvasHeight = windowHeight;
  
  var minWidth = 1000;
  if (canvasWidth < minWidth) {
    canvasWidth = minWidth;
  }
  
  resizeCanvas(canvasWidth, canvasHeight);
  
  // Reposition controls - 9 COLUMNS
  var controlY1 = canvasHeight - 70;
  var controlY2 = canvasHeight - 35;
  var sliderWidth = 80;
  var columnWidth = 110;
  var fontSize = '11px';
  
  var totalColumns = 9;
  var totalWidth = (totalColumns - 1) * columnWidth;
  var startX = (canvasWidth - totalWidth) / 2;
  
  var styleY = canvasHeight - 52;
  var regenY = canvasHeight - 52;
  
  // Update all control positions
  var allParagraphs = selectAll('p');
  
  // Column 1: Style dropdown (no label)
  placementModeSelect.position(startX, styleY);
  
  // Column 2: back elements / back shade
  allParagraphs[0].position(startX + columnWidth, controlY1);
  numBackSlider.position(startX + columnWidth, controlY1 + 15);
  allParagraphs[1].position(startX + columnWidth, controlY2);
  backDarknessSlider.position(startX + columnWidth, controlY2 + 15);
  
  // Column 3: middle elements / middle brightness
  allParagraphs[2].position(startX + columnWidth * 2, controlY1);
  numMiddleSlider.position(startX + columnWidth * 2, controlY1 + 15);
  allParagraphs[3].position(startX + columnWidth * 2, controlY2);
  middleGraySlider.position(startX + columnWidth * 2, controlY2 + 15);
  
  // Column 4: front elements / color shift
  allParagraphs[4].position(startX + columnWidth * 3, controlY1);
  numFrontSlider.position(startX + columnWidth * 3, controlY1 + 15);
  allParagraphs[5].position(startX + columnWidth * 3, controlY2);
  colorShiftSlider.position(startX + columnWidth * 3, controlY2 + 15);
  
  // Column 5: back size / antenna density
  allParagraphs[6].position(startX + columnWidth * 4, controlY1);
  backSizeSlider.position(startX + columnWidth * 4, controlY1 + 15);
  allParagraphs[7].position(startX + columnWidth * 4, controlY2);
  antennaDensitySlider.position(startX + columnWidth * 4, controlY2 + 15);
  
  // Column 6: middle size / antenna length
  allParagraphs[8].position(startX + columnWidth * 5, controlY1);
  middleSizeSlider.position(startX + columnWidth * 5, controlY1 + 15);
  allParagraphs[9].position(startX + columnWidth * 5, controlY2);
  antennaLengthSlider.position(startX + columnWidth * 5, controlY2 + 15);
  
  // Column 7: front size / antenna RPM
  allParagraphs[10].position(startX + columnWidth * 6, controlY1);
  frontSizeSlider.position(startX + columnWidth * 6, controlY1 + 15);
  allParagraphs[11].position(startX + columnWidth * 6, controlY2);
  antennaSpeedSlider.position(startX + columnWidth * 6, controlY2 + 15);
  
  // Column 8: corner radius / shadow offset
  allParagraphs[12].position(startX + columnWidth * 7, controlY1);
  cornerRadiusSlider.position(startX + columnWidth * 7, controlY1 + 15);
  allParagraphs[13].position(startX + columnWidth * 7, controlY2);
  shadowSlider.position(startX + columnWidth * 7, controlY2 + 15);
  
  // Column 9: Regenerate button (no separate label)
  refreshButton.position(startX + columnWidth * 8, regenY);
  
  // Regenerate rectangles for new canvas size
  generateRectangles();
}
