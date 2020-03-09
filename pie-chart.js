function PieChart() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pie-Chart';
  
  //Unique ID
  this.id = 'pie-chart';
  
  // List of data sources to be used in visualisation
  this.sources = [];
  this.sourceIndex = null;
 
  this.layout = {
    x: width * 0.5,
    y: height * 0.55,
    diameter: width * 0.38,
    labelSpace: 30,
    
    posUpdate: function() {
      this.x = width * 0.5;
      this.y = height * 0.55;

      var inSize = 0.85;
      if (width < height) {
        this.diameter = width * inSize;
      } else {
        this.diameter = (height * inSize); // - 50;
      }
    }
  };
  
  this.setup = function() {
    this.layout.posUpdate();
    this.source = this.sources[this.sourceIndex];
    
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    // Create a select DOM element.
    this.select = createSelect();
    
    // Fill the select object with the options names.
    for (var i = 1; i < this.source.data.getColumnCount(); i++) {
      this.select.option(this.source.data.columns[i]);
    }
    this.resizeEvent();
  };

  this.destroy = function() {
    this.select.remove();
  };

  this.draw = function() {
    // Get the current option from the select item.
    var variantName = this.select.value();

    // Get the column of raw data for the currently selected item.
    var col = this.source.data.getColumn(variantName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.source.data.getColumn(0);

    // Colour to use for each category.
    var colours = colourGen(col.length);

    // Make a title.
    var title = this.source.name;
    // https://p5js.org/examples/form-pie-chart.html
    
    var angles = this.get_radians(col);
    var lastAngle = 0;
    var colour;

    for (var i = 0; i < labels.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, labels.length, 0, 255);
      }

      fill(colour);
      stroke(0);
      strokeWeight(1);

      arc(this.layout.x, this.layout.y,
          this.layout.diameter, this.layout.diameter,
          lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!

      if (labels) {
        this.makeLegendItem(labels[i], i, colour);
      }

      lastAngle += angles[i];
    }

    if (title) {
      noStroke();
      textAlign('center', 'center');
      textSize(24);
      text(title, this.layout.x, (this.layout.y * 0) + this.layout.labelSpace);
    }
    
    this.layout.posUpdate();
  };
  
  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  this.makeLegendItem = function(label, i, colour) {
    var x = this.layout.x + 50 + this.layout.diameter / 2;
    var y = this.layout.y + (this.layout.labelSpace * i) - this.layout.diameter / 3;
    var boxWidth = this.layout.labelSpace / 2;
    var boxHeight = this.layout.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill('black');
    noStroke();
    textAlign('left', 'center');
    textSize(12);
    text(makeTitle(label), x + boxWidth + 10, y + boxWidth / 2);
  };
  
  // Added function
  // The select object within p5.js behaves a bit strangely
  // So this function detects resizing and moves it to always be centered above the piechart
  this.resizeEvent = function() {
    // Position the select DOM element
    this.select.position(width * 0.5, this.layout.labelSpace * 5.2);
    this.select.center('horizontal');
  };
}

