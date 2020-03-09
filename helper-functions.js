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

// Added function
// Rounds values to the nearest multiple of another value
// Can round up or down
function toNearestMult(value, mult, down) {
  // Makes value an integer
  round = Math.floor(value);
  // Reduces / Increases value until it is a multiple of the specified mult
  if (down) {
    while (round % mult != 0) {
      round--;
    }
  } else {
    while (round % mult != 0) {
      round++;
    }
  }
  // Returns modified value
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

// Added function
// Reads the header of a column and detects if units are specified within brackets
function getUnits(header) {
  // Runs through all chars in the header
  for (var x = 0; x < header.length; x++) {
    if (header.charAt(x-1) == "(") {
      var units = "";
      // Once opening bracket is detected it starts adding values to the units var
      do
      {
        units = units + header.charAt(x);
        x++;
      } while (header.charAt(x) != ")");
      // Returns units once closing bracket is detected
      return units;
    }
  }
  return "";
}

// Added function
// Checks if data is int returns boolean value
function dataIsInt(source) {
  var item = parseInt(source);
  return !isNaN(item);
}

// Added function
// Constrains a specified string of text to a certain width
// Used to ensure that text does not overlap and is still readable
function drawConstrainedLabel(label, xLoc, yLoc, objWidth, lineMax) {
  // Capitilises the first letter of every word
	var labelTitle = makeTitle(label);
		
	// Break the title into an array of words
	var words = [];
	var word = "";
	for (var x = 0; x < labelTitle.length; x++) {
    //If the char is not a space it is added to the current word
		if (labelTitle.charAt(x) != " ") {
			word += labelTitle.charAt(x);
		} else {
      // When a space is detected the current word is completed,
      // added to the words array and new word is started
			words.push(word);
			word = "";
		}
	}
  // Adds the last word to the array
	words.push(word);
	
	// A similar approach for constructing the lines
	var lines = [];
	var line = "";
  
  // The textSize is set so textWidth() can accurately return the width of the string
  push();
  textSize(18);
	for (var y = 0; y < words.length; y++) {
    // If the word can be added without exceeding the width limit it is added to the current line
		if (textWidth(line) + textWidth(words[y]) + 1 < objWidth) {
			line += words[y] + " ";
		} else {
      // If not, the current line is ended and a new one is started
			if (line != "") {
				lines.push(line.slice(0, line.length-1));
			}
      // The word that failed the check is the first in the new lne
			line = words[y] + " ";
		}
	}
  // Adds the last line to the array
	lines.push(line.slice(0, line.length-1));
  pop();
  
  // If lines are too deep, (i.e: They overlap with text below them) remove lines and add ellipses
  if (lines.length * 18 > lineMax) {
    while (lines.length * 18 > lineMax) {
      lines.pop();
    }
    lines[lines.length-1] += "...";
  }
  
	// Draw all lines to screen
	for (var z = 0; z < lines.length; z++) {
		push();
      strokeWeight(0);
			textAlign('center', 'center');
			fill(0);
			textSize(18);
			text(lines[z],
					 xLoc + (objWidth / 2),
					 yLoc + ((z)*18));
		pop();
	}
  
	return lines.length;
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

// Added function
// Modifies the leftMargin property so that labels on the y-axis can fit within the graph
function setLeftMargin(layout, text) {
  if (layout.leftMargin < textWidth(text) + layout.labelPad + 20) {
    layout.leftMargin = textWidth(text) + layout.labelPad + 20;
  }
}

// Modified function
// Takes the labels and sets a new leftMargin based on their width
function drawYAxisTickLabels(min, max, layout, mapFunction, decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = (range / layout.numYTickLabels);
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

// Added function
// Capitalises the first letter of every word
function makeTitle(text) {
  var title = text;
  // The first letter is capitalised
  title = title.charAt(0).toUpperCase() + title.substring(1);
  // Every other letter is capitalised by detecting a space before that letter
  for (var x = 3; x < title.length; x++) {
    if (title.charAt(x) == " ") {
      title = title.substring(0, x+1) + title.charAt(x+1).toUpperCase() + title.substring(x+2);
    }
  }
  return title;
}


// Added function
// To meet the requirement of colours for display in the bubble chart and pie chart
// A dictionary of a colour hexes so that a variety of colour is displayed
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

  // Returns an array of these colours of a length specified in the function call
  var someColours = [];
  for (var x = 0; x < n; x++) {
    someColours.push(allColours[keys[x]]);
  }
  return someColours;
}

