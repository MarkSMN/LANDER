// Interactive control panel version with compositional placement modes
// Custom slider styling in CSS
var frontRectangles = [];
var backRectangles = [];
var hueOffset = 0; // Random starting point in color wheel

// Control parameters
var numBackSlider, numFrontSlider;
var backSizeSlider, frontSizeSlider;
var cornerRadiusSlider;
var backGraySlider;
var colorShiftSlider;
var placementModeSelect;
var shadowSlider;

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
      border: 1px solid black;
      padding: 2px 4px;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 9px;
      cursor: pointer;
    }
  `);
  style.parent(document.head);
}

function setup() {
  var canvas = createCanvas(900, 1040); // Added 40px for control strip
  canvas.parent('main'); // Parent canvas to the main container
  
  // Add custom slider styling
  addSliderStyles();
  
  // Get canvas position on page for control positioning
  var canvasX = canvas.elt.offsetLeft;
  var canvasY = canvas.elt.offsetTop;
  
  // Create control panel across bottom - CENTERED
  var controlY = canvasY + 1005; // Position in bottom strip relative to canvas
  var sliderWidth = 80;
  var spacing = 100; // Horizontal spacing between controls
  
  // Calculate total width needed for all controls (now 9 controls)
  var totalControlWidth = (spacing * 8) + sliderWidth; // 8 gaps + 1 final control width
  var startX = canvasX + (width - totalControlWidth) / 2; // Center the controls relative to canvas
  
  // Placement mode dropdown (NEW - positioned first)
  createP('placement').position(startX, controlY).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', '9px');
  placementModeSelect = createSelect();
  placementModeSelect.position(startX, controlY + 15);
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
  placementModeSelect.style('width', sliderWidth + 'px');
  placementModeSelect.changed(generateRectangles);
  
  // Number of back rectangles
  createP('back elements').position(startX + spacing, controlY).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', '9px');
  numBackSlider = createSlider(2, 25, 5);
  numBackSlider.position(startX + spacing, controlY + 15);
  numBackSlider.style('width', sliderWidth + 'px');
  numBackSlider.input(adjustBackCount);
  
  // Number of front rectangles
  createP('front elements').position(startX + spacing * 2, controlY).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', '9px');
  numFrontSlider = createSlider(2, 25, 5);
  numFrontSlider.position(startX + spacing * 2, controlY + 15);
  numFrontSlider.style('width', sliderWidth + 'px');
  numFrontSlider.input(adjustFrontCount);
  
  // Back layer max size
  createP('back max size').position(startX + spacing * 3, controlY).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', '9px');
  backSizeSlider = createSlider(100, 600, 400);
  backSizeSlider.position(startX + spacing * 3, controlY + 15);
  backSizeSlider.style('width', sliderWidth + 'px');
  backSizeSlider.input(updateBackSizes);
  
  // Front layer max size
  createP('front max size').position(startX + spacing * 4, controlY).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', '9px');
  frontSizeSlider = createSlider(50, 400, 250);
  frontSizeSlider.position(startX + spacing * 4, controlY + 15);
  frontSizeSlider.style('width', sliderWidth + 'px');
  frontSizeSlider.input(updateFrontSizes);
  
  // Corner radius
  createP('corner radius').position(startX + spacing * 5, controlY).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', '9px');
  cornerRadiusSlider = createSlider(0, 50, 10);
  cornerRadiusSlider.position(startX + spacing * 5, controlY + 15);
  cornerRadiusSlider.style('width', sliderWidth + 'px');
  
  // Shadow offset
  createP('shadow offset').position(startX + spacing * 6, controlY).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', '9px');
  shadowSlider = createSlider(0, 30, 15);
  shadowSlider.position(startX + spacing * 6, controlY + 15);
  shadowSlider.style('width', sliderWidth + 'px');
  
  // Back layer gray value
  createP('back layer gray').position(startX + spacing * 7, controlY).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', '9px');
  backGraySlider = createSlider(100, 220, 180);
  backGraySlider.position(startX + spacing * 7, controlY + 15);
  backGraySlider.style('width', sliderWidth + 'px');
  backGraySlider.input(updateBackColors);
  
  // Color shift
  createP('color shift').position(startX + spacing * 8, controlY).style('color', 'black').style('margin', '0').style('font-family', 'Helvetica, Arial, sans-serif').style('font-size', '9px');
  colorShiftSlider = createSlider(0, 360, 0);
  colorShiftSlider.position(startX + spacing * 8, controlY + 15);
  colorShiftSlider.style('width', sliderWidth + 'px');
  colorShiftSlider.input(updateFrontColors);
  
  generateRectangles();
}

function draw() {
  background(255/2);
  
  var cornerRad = cornerRadiusSlider.value();
  
  var centerX = width / 2;
  var centerY = 500; // Center of drawable area (1000/2)
  
  // BACK LAYER - Draw drop shadows first
  for (var i = 0; i < backRectangles.length; i++) {
    var rectangle = backRectangles[i];
    drawDropShadow(rectangle, centerX, centerY, cornerRad);
  }
  
  // BACK LAYER - Draw tangent lines (WHITE)
  stroke(255);
  strokeWeight(1);
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
  
  // BACK LAYER - Draw rectangles with BLACK stroke
  stroke(0);
  strokeWeight(1);
  for (var i = 0; i < backRectangles.length; i++) {
    var rectangle = backRectangles[i];
    fill(rectangle.color);
    rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height, cornerRad);
  }
  
  // Draw back rectangle fills again (on top of lines)
  for (var i = 0; i < backRectangles.length; i++) {
    var rectangle = backRectangles[i];
    fill(rectangle.color);
    stroke(0);
    strokeWeight(1);
    rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height, cornerRad);
  }
  
  // FRONT LAYER - Draw drop shadows first
  for (var i = 0; i < frontRectangles.length; i++) {
    var rectangle = frontRectangles[i];
    drawDropShadow(rectangle, centerX, centerY, cornerRad);
  }
  
  // FRONT LAYER - Draw tangent lines (BLACK)
  stroke(0);
  strokeWeight(1);
  for (var i = 0; i < frontRectangles.length; i++) {
    var rectangle = frontRectangles[i];
    var nextRectangle = frontRectangles[(i + 1) % frontRectangles.length];
    var tangents = calculateCommonTangents(rectangle, nextRectangle);
    for (var k = 0; k < tangents.length; k += 2) {
      var tangentA = tangents[k];
      var tangentB = tangents[k + 1];
      line(tangentA.x, tangentA.y, tangentB.x, tangentB.y);
    }
    fill(rectangle.color);
    rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height, cornerRad);
  }
  
  // Draw front rectangle fills again (on top of lines)
  for (var i = 0; i < frontRectangles.length; i++) {
    var rectangle = frontRectangles[i];
    fill(rectangle.color);
    rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height, cornerRad);
  }
  
  // Draw white control strip at bottom - MOVED TO END TO STAY ON TOP
  fill(255);
  noStroke();
  rect(0, 1000, width, 40);
}

function drawDropShadow(rectangle, centerX, centerY, cornerRad) {
  // Calculate rectangle center
  var rectCenterX = rectangle.x + rectangle.width / 2;
  var rectCenterY = rectangle.y + rectangle.height / 2;
  
  // Calculate direction vector from rectangle to canvas center
  var dirX = centerX - rectCenterX;
  var dirY = centerY - rectCenterY;
  
  // Normalize direction and multiply by shadow slider value
  var distance = sqrt(dirX * dirX + dirY * dirY);
  if (distance > 0) {
    var shadowAmount = shadowSlider.value();
    dirX = (dirX / distance) * shadowAmount;
    dirY = (dirY / distance) * shadowAmount;
  }
  
  // Draw shadow offset toward center
  fill(0);
  stroke(0);
  strokeWeight(1);
  rect(rectangle.x + dirX, rectangle.y + dirY, rectangle.width, rectangle.height, cornerRad);
}

// NEW: Generate position based on placement mode
function generatePosition(mode, maxY, index, total) {
  var x, y;
  
  switch(mode) {
    case 'Random':
      x = random(width);
      y = random(maxY);
      break;
      
    case 'Rule of Thirds':
      // Cluster around 1/3 and 2/3 grid intersections
      var gridPoints = [
        {x: width/3, y: maxY/3},
        {x: width*2/3, y: maxY/3},
        {x: width/3, y: maxY*2/3},
        {x: width*2/3, y: maxY*2/3},
        {x: width/2, y: maxY/2} // center as 5th point
      ];
      var targetPoint = gridPoints[floor(random(gridPoints.length))];
      x = targetPoint.x + randomGaussian(0, 80);
      y = targetPoint.y + randomGaussian(0, 80);
      break;
      
    case 'Radial':
      // Arrange in circular pattern from center
      var angle = (index / total) * TWO_PI;
      var radius = random(100, 400);
      x = width/2 + cos(angle) * radius;
      y = maxY/2 + sin(angle) * radius;
      break;
      
    case 'Grid + Jitter':
      // Regular grid with random offset
      var cols = ceil(sqrt(total));
      var rows = ceil(total / cols);
      var gridX = (index % cols) / cols * width;
      var gridY = floor(index / cols) / rows * maxY;
      x = gridX + random(-50, 50);
      y = gridY + random(-50, 50);
      break;
      
    case 'Symmetrical':
      // Mirror across vertical center axis
      if (index % 2 === 0) {
        x = random(0, width/2);
      } else {
        x = width - (backRectangles[index-1]?.x || random(0, width/2));
      }
      y = random(maxY);
      break;
      
    case 'Diagonal Bias':
      // Favor diagonal from top-left to bottom-right
      var t = random();
      x = lerp(0, width, t) + randomGaussian(0, 60);
      y = lerp(0, maxY, t) + randomGaussian(0, 60);
      break;
      
    case 'Center Cluster':
      // Cluster toward center with gaussian distribution
      x = width/2 + randomGaussian(0, width/5);
      y = maxY/2 + randomGaussian(0, maxY/5);
      break;
      
    case 'Edge Focus':
      // Push elements toward edges
      if (random() < 0.5) {
        x = random() < 0.5 ? random(0, width*0.25) : random(width*0.75, width);
      } else {
        x = random(width);
      }
      if (random() < 0.5) {
        y = random() < 0.5 ? random(0, maxY*0.25) : random(maxY*0.75, maxY);
      } else {
        y = random(maxY);
      }
      break;
      
    case 'Horizontal Bands':
      // Create horizontal stripe pattern
      var numBands = 3;
      var bandHeight = maxY / numBands;
      var band = floor(random(numBands));
      x = random(width);
      y = band * bandHeight + random(bandHeight) * 0.8 + bandHeight * 0.1;
      break;
      
    case 'Vertical Columns':
      // Create vertical column pattern
      var numCols = 4;
      var colWidth = width / numCols;
      var col = floor(random(numCols));
      x = col * colWidth + random(colWidth) * 0.8 + colWidth * 0.1;
      y = random(maxY);
      break;
      
    case 'Fibonacci Spiral':
      // Approximate Fibonacci spiral from center
      var phi = 1.618033988749895; // Golden ratio
      var theta = index * 137.5 * (PI / 180); // Golden angle in radians
      var r = 20 * sqrt(index);
      x = width/2 + r * cos(theta);
      y = maxY/2 + r * sin(theta);
      break;
      
    case 'Corners Focus':
      // Cluster in the four corners
      var corners = [
        {x: width * 0.15, y: maxY * 0.15},
        {x: width * 0.85, y: maxY * 0.15},
        {x: width * 0.15, y: maxY * 0.85},
        {x: width * 0.85, y: maxY * 0.85}
      ];
      var corner = corners[floor(random(corners.length))];
      x = corner.x + randomGaussian(0, 60);
      y = corner.y + randomGaussian(0, 60);
      break;
      
    case 'X Pattern':
      // Two diagonal lines forming an X
      if (random() < 0.5) {
        // Top-left to bottom-right diagonal
        var t1 = random();
        x = lerp(0, width, t1) + randomGaussian(0, 40);
        y = lerp(0, maxY, t1) + randomGaussian(0, 40);
      } else {
        // Top-right to bottom-left diagonal
        var t2 = random();
        x = lerp(width, 0, t2) + randomGaussian(0, 40);
        y = lerp(0, maxY, t2) + randomGaussian(0, 40);
      }
      break;
      
    case 'Circle Ring':
      // Arrange in a ring/donut shape
      var angle2 = random(TWO_PI);
      var ringRadius = random(200, 350);
      x = width/2 + cos(angle2) * ringRadius;
      y = maxY/2 + sin(angle2) * ringRadius;
      break;
      
    case 'Scattered Clusters':
      // Multiple random cluster points
      var clusterPoints = [
        {x: width * 0.25, y: maxY * 0.3},
        {x: width * 0.75, y: maxY * 0.3},
        {x: width * 0.5, y: maxY * 0.6},
        {x: width * 0.2, y: maxY * 0.8},
        {x: width * 0.8, y: maxY * 0.8}
      ];
      var cluster = clusterPoints[floor(random(clusterPoints.length))];
      x = cluster.x + randomGaussian(0, 70);
      y = cluster.y + randomGaussian(0, 70);
      break;
      
    case 'Golden Ratio':
      // Divide canvas using golden ratio
      var goldenX = [width * 0.382, width * 0.618];
      var goldenY = [maxY * 0.382, maxY * 0.618];
      var gx = goldenX[floor(random(2))];
      var gy = goldenY[floor(random(2))];
      x = gx + randomGaussian(0, 60);
      y = gy + randomGaussian(0, 60);
      break;
      
    default:
      x = random(width);
      y = random(maxY);
  }
  
  // Constrain to canvas bounds
  x = constrain(x, 0, width);
  y = constrain(y, 0, maxY);
  
  return {x: x, y: y};
}

function generateRectangles() {
  backRectangles = [];
  frontRectangles = [];
  
  // Pick a random 90-degree slice of the color wheel
  hueOffset = random(360);
  
  var numBack = numBackSlider.value();
  var numFront = numFrontSlider.value();
  var backMaxSize = backSizeSlider.value();
  var frontMaxSize = frontSizeSlider.value();
  var grayValue = backGraySlider.value();
  var maxY = 1000;
  var mode = placementModeSelect.value();
  
  // Generate back layer rectangles with varied sizes
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
    
    // Add individual variation to each rectangle's gray value
    var grayVariation = random(-30, 30);
    var individualGray = constrain(grayValue + grayVariation, 100, 220);
    var rectangleColor = color(individualGray, individualGray, individualGray);
    
    backRectangles.push({ 
      x: x, 
      y: y, 
      sizeType: sizeType,
      sizeRatioW: random(),
      sizeRatioH: random(),
      grayVariation: grayVariation,
      color: rectangleColor 
    });
  }
  
  // Calculate actual sizes based on current max size
  updateBackSizes();
  
  // Generate front layer rectangles with varied sizes
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
    
    // Original position-based RGB gradient
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
  
  // Calculate actual sizes based on current max size
  updateFrontSizes();
}

function updateBackSizes() {
  var backMaxSize = backSizeSlider.value();
  
  for (var i = 0; i < backRectangles.length; i++) {
    var rect = backRectangles[i];
    var rectWidth, rectHeight;
    
    if (rect.sizeType === 'LARGE') {
      rectWidth = lerp(backMaxSize * 0.5, backMaxSize, rect.sizeRatioW);
      rectHeight = lerp(backMaxSize * 0.4, backMaxSize * 0.9, rect.sizeRatioH);
    } else if (rect.sizeType === 'MEDIUM') {
      rectWidth = lerp(backMaxSize * 0.24, backMaxSize * 0.5, rect.sizeRatioW);
      rectHeight = lerp(backMaxSize * 0.2, backMaxSize * 0.5, rect.sizeRatioH);
    } else if (rect.sizeType === 'SMALL') {
      rectWidth = lerp(backMaxSize * 0.08, backMaxSize * 0.24, rect.sizeRatioW);
      rectHeight = lerp(backMaxSize * 0.08, backMaxSize * 0.24, rect.sizeRatioH);
    } else { // BEAM
      rectWidth = lerp(backMaxSize * 0.3, backMaxSize * 0.8, rect.sizeRatioW);
      rectHeight = lerp(20, 60, rect.sizeRatioH);
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
      rectWidth = lerp(20, frontMaxSize * 0.2, rect.sizeRatioW);
      rectHeight = lerp(20, frontMaxSize * 0.32, rect.sizeRatioH);
    } else if (rect.sizeType === 'SMALL') {
      rectWidth = lerp(frontMaxSize * 0.2, frontMaxSize * 0.48, rect.sizeRatioW);
      rectHeight = lerp(frontMaxSize * 0.2, frontMaxSize * 0.48, rect.sizeRatioH);
    } else if (rect.sizeType === 'MEDIUM') {
      rectWidth = lerp(frontMaxSize * 0.48, frontMaxSize * 0.8, rect.sizeRatioW);
      rectHeight = lerp(frontMaxSize * 0.4, frontMaxSize * 0.72, rect.sizeRatioH);
    } else if (rect.sizeType === 'PANEL') {
      rectWidth = lerp(frontMaxSize * 0.72, frontMaxSize * 1.4, rect.sizeRatioW);
      rectHeight = lerp(40, frontMaxSize * 0.4, rect.sizeRatioH);
    } else { // LARGE
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
  var grayValue = backGraySlider.value();
  var backMaxSize = backSizeSlider.value();
  var maxY = 1000;
  var mode = placementModeSelect.value();
  
  if (targetCount > currentCount) {
    // Add new elements to the end
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
      
      // Add gray variation for new elements
      var grayVariation = random(-30, 30);
      var individualGray = constrain(grayValue + grayVariation, 100, 220);
      var rectangleColor = color(individualGray, individualGray, individualGray);
      
      backRectangles.push({ 
        x: x, 
        y: y, 
        sizeType: sizeType,
        sizeRatioW: random(),
        sizeRatioH: random(),
        grayVariation: grayVariation,
        color: rectangleColor 
      });
    }
    updateBackSizes();
  } else if (targetCount < currentCount) {
    // Remove elements from the end
    backRectangles.splice(targetCount);
  }
}

function adjustFrontCount() {
  var targetCount = numFrontSlider.value();
  var currentCount = frontRectangles.length;
  var frontMaxSize = frontSizeSlider.value();
  var maxY = 1000;
  var mode = placementModeSelect.value();
  
  if (targetCount > currentCount) {
    // Add new elements to the end
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
      
      // Original position-based RGB gradient
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
    // Remove elements from the end
    frontRectangles.splice(targetCount);
  }
}

function updateBackColors() {
  // Update back layer colors while preserving individual variation
  var grayValue = backGraySlider.value();
  for (var i = 0; i < backRectangles.length; i++) {
    var rect = backRectangles[i];
    // Apply the stored variation to the new gray value
    var individualGray = constrain(grayValue + rect.grayVariation, 100, 220);
    rect.color = color(individualGray, individualGray, individualGray);
  }
}

function updateFrontColors() {
  // Update front layer colors by shifting RGB values
  var shiftAmount = colorShiftSlider.value();
  var maxY = 1000;
  
  for (var i = 0; i < frontRectangles.length; i++) {
    var rect = frontRectangles[i];
    var x = rect.x;
    var y = rect.y;
    
    // Calculate base RGB from position
    var baseR = x / width * 255;
    var baseG = y / maxY * 255;
    var baseB = 150;
    
    // Apply shift by rotating which channel gets which value
    var shiftPercent = shiftAmount / 360;
    
    if (shiftPercent < 0.33) {
      // Original: R=x, G=y, B=150
      var t = shiftPercent * 3;
      rect.color = color(
        lerp(baseR, baseG, t),
        lerp(baseG, baseB, t),
        lerp(baseB, baseR, t)
      );
    } else if (shiftPercent < 0.67) {
      // Mid shift: R=y, G=150, B=x
      var t = (shiftPercent - 0.33) * 3;
      rect.color = color(
        lerp(baseG, baseB, t),
        lerp(baseB, baseR, t),
        lerp(baseR, baseG, t)
      );
    } else {
      // Full shift: R=150, G=x, B=y
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

// Press 's' to save, any other key to regenerate
function keyPressed() {
  if (key === 's' || key === 'S') {
    var timestamp = year() + "-" + month() + "-" + day() + "_" + hour() + "-" + minute() + "-" + second();
    saveCanvas('lander_' + timestamp, 'png');
  } else {
    generateRectangles();
  }
}
