// --------------------------------------------------------------------
// Data processing helper functions.
// --------------------------------------------------------------------
function sum(data) {
  var total = 0;

  // Ensure that data contains numbers and not strings.
  data = stringsToNumbers(data);

  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }

  return total;
}

function mean(data) {
  var total = sum(data);

  return total / data.length;
}

function sliceRowNumbers(row, start=0, end) {
  var rowData = [];

  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }

  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }

  return rowData;
}

function stringsToNumbers(array) {
  return array.map(Number);
}

function toNearestMult(value, mult, down) {
  round = Math.floor(value);
  if (down) {
    while (round % mult != 0) {
      round--;
    }
  } else {
    while (round % mult != 0) {
      round++;
    }
  }
  return round;
}

function createRange(value) {
  var valMin = Math.abs(min(value));
  var valMax = Math.abs(max(value));
  var range;
    
  if (valMin < valMax) {
    range = toNearestMult(valMax, 10, false);
  } else {
    range = toNearestMult(valMin, 10, true);
  }
  return range;
}

// --------------------------------------------------------------------
// Plotting helper functions
// --------------------------------------------------------------------

function drawAxis(layout, colour=0) {
  stroke(color(colour));

  // x-axis
  line(layout.leftMargin,
       layout.bottomMargin,
       layout.rightMargin,
       layout.bottomMargin);

  // y-axis
  line(layout.leftMargin,
       layout.topMargin,
       layout.leftMargin,
       layout.bottomMargin);
}

function drawAxisLabels(xLabel, yLabel, layout) {
  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Draw x-axis label.
  text(makeTitle(xLabel),
       (layout.plotWidth / 2) + layout.leftMargin,
       layout.bottomMargin + (layout.marginSize * 1.5));

  // Draw y-axis label.
  push();
  translate(layout.labelPad,
            layout.bottomMargin / 2);
  rotate(- PI / 2);
  text(makeTitle(yLabel), 0, 0);
  pop();
}

this.setLeftMargin = function(layout, text) {
  if (layout.leftMargin < textWidth(text) + layout.labelPad + 20) {
    layout.leftMargin = textWidth(text) + layout.labelPad + 20;
  }
};

function drawYAxisTickLabels(min, max, layout, mapFunction, decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;
  var setMargin = false;

  fill(0);
  noStroke();
  textAlign('right', 'center');
  
  // Draw all axis tick labels and grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + (i * yTickStep);
    var y = mapFunction(value);
    
    
    //Sets the margin width based on the text width
    if (!setMargin) {
      setLeftMargin(layout, value.toFixed(decimalPlaces));
      if (i == layout.numYTickLabels) {
        setMargin = true;
        i = 0;
      }
    } else {
      // Add tick label.
      text(value.toFixed(decimalPlaces),
           layout.leftMargin - 2,
           y);
  
      if (layout.grid) {
        // Add grid line.
        stroke(200);
        line(layout.leftMargin, y, layout.rightMargin, y);
      }
    }
  }
}

function drawXAxisTickLabel(value, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var x = mapFunction(value);

  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Add tick label.
  text(value,
       x,
       layout.bottomMargin + layout.marginSize / 2);

  if (layout.grid) {
    // Add grid line.
    stroke(220);
    line(x,
         layout.topMargin,
         x,
         layout.bottomMargin);
  }
}

// --------------------------------------------------------------------
// Plotting visual/UI functions
// --------------------------------------------------------------------

function makeTitle(text) {
  var title = text;
  title = title.charAt(0).toUpperCase() + title.substring(1);
  for (var x = 3; x < title.length; x++) {
    if (title.charAt(x) == " ") {
      title = title.substring(0, x+1) + title.charAt(x+1).toUpperCase() + title.substring(x+2);
    }
  }
  return title;
}

function colourGen(n) {
  var allColours = {
    red: "#ff0000",
    blue: "#0000ff",
    green: "#008000",
    purple: "#800080",
    orange: "#ffa500",
    navy: "#000080",
    cyan: "#00ffff",
    yellow: "#ffff00",
    aqua: "#00ffff",
    magenta: "#ff00ff",
    maroon: "#800000",
    pink: "#ffc0cb",
    violet: "#800080",
    olive: "#808000",
    black: "#000000",
    brown: "#a52a2a",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    indigo: "#4b0082",
    beige: "#f5f5dc",
    khaki: "#f0e68c",
    azure: "#f0ffff",
    lightblue: "#add8e6",
    lightcyan: "#e0ffff",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    silver: "#c0c0c0",
  };
  var keys = Object.keys(allColours);

  var someColours = [];
  for (var x = 0; x < n; x++) {
    someColours.push(allColours[keys[x]]);
  }
  return someColours;
}

