function BubbleChart() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Bubble Chart';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'bubble-chart';
  
  // List of data sources to be used in visualisation
  this.sources = [];
  this.sourceIndex = 0;

  this.layout = {
    marginSize: 35,
    pad: 5,
    labelPad: 20,
    dotSizeMin: 15,
    dotSizeMax: 40,
    
    posUpdate: function() {
      // Locations of margin positions. Left and bottom have double margin
      // size due to axis and tick labels.
      this.rightMargin = width - this.marginSize;
      this.leftMargin = this.marginSize * 2.5;
      this.plotWidth = this.rightMargin - this.leftMargin;
      this.topMargin = this.marginSize;
      this.bottomMargin = height - this.marginSize * 2.5;
    }
  };

  this.setup = function() {
    this.source = this.sources[this.sourceIndex];
    
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }
  };

  this.draw = function() {

    // Get data from the table object.
    var groups = this.source.data.getColumn(0);
    var dotValue = this.source.data.getColumn(1);
    var xValue = this.source.data.getColumn(2);
    var yValue = this.source.data.getColumn(3);
    
    // Convert numerical data from strings to numbers.
    xValue = stringsToNumbers(xValue);
    yValue = stringsToNumbers(yValue);
    dotValue = stringsToNumbers(dotValue);

    // Set ranges for axes.
    var xValueMin = toNearestMult(min(xValue), 10, true); //0
    var xValueMax = toNearestMult(max(xValue), 10, false); //100
    var xUnits = getUnits(this.source.data.columns[2]);

    // For y-axis (pay gap) use a symmetrical axis 
    var yValueMin = -createRange(yValue);
    var yValueMax = createRange(yValue);
    var yUnits = getUnits(this.source.data.columns[3]);

    // Find smallest and largest values to scale the size of the dots.
    var dotValueMin = min(dotValue);
    var dotValueMax = max(dotValue);
    
    // Generate unique colours for the dots
    var colours = colourGen(this.source.data.getRowCount());

    // Draw the axes.
    this.drawCrossAxis();
    this.drawArrowAxis(this.layout.leftMargin,
                       this.layout.rightMargin,
                       this.layout.bottomMargin + (this.layout.marginSize),
                       this.layout.bottomMargin + (this.layout.marginSize));
    this.drawArrowAxis(this.layout.leftMargin - (this.layout.marginSize),
                       this.layout.leftMargin - (this.layout.marginSize),
                       this.layout.topMargin,
                       this.layout.bottomMargin);
    this.drawArrowAxisLabels(xValueMin, yValueMin, this.source.data.columns[2], this.source.data.columns[3], xValueMax, yValueMax, xUnits, yUnits);
    
    var dots = [];
    
    for (i = 0; i < this.source.data.getRowCount(); i++) {
      // Create a dot for each point.
      x = map(xValue[i], xValueMin, xValueMax, this.layout.leftMargin + this.layout.marginSize, this.layout.rightMargin - this.layout.marginSize);
      y = map(yValue[i], yValueMin, yValueMax, this.layout.bottomMargin - this.layout.marginSize, this.layout.topMargin + this.layout.marginSize);
      size = map(dotValue[i], dotValueMin, dotValueMax, this.layout.dotSizeMin, this.layout.dotSizeMax);
      name = groups[i];
      dots.push(new Bubble(colours[i], name, x, y, size, this.layout));
    }
    
    // Draw all the dots
    for (y = 0; y < dots.length; y++) {
      dots[y].draw();
    }
    // Draw all dot labels seperately to make text appear over dots
    for (z = 0; z < dots.length; z++) {
      dots[z].drawLabels();
    }
    
    this.layout.posUpdate();
  };
  
  this.drawCrossAxis = function() {
    stroke(200);

    // x-axis
    line(this.layout.leftMargin,
         this.layout.bottomMargin / 2,
         this.layout.rightMargin,
         this.layout.bottomMargin / 2);
  
    // y-axis
    line(this.layout.rightMargin / 2,
         this.layout.topMargin,
         this.layout.rightMargin / 2,
         this.layout.bottomMargin);
  };
  
  this.drawArrowAxis = function() {
    stroke(150);
    // X-axis
    // Line
    line(this.layout.leftMargin,
         this.layout.bottomMargin + (this.layout.marginSize),
         this.layout.rightMargin,
         this.layout.bottomMargin + (this.layout.marginSize));
    // Arrow left
    triangle(this.layout.leftMargin,
             this.layout.bottomMargin + (this.layout.marginSize),
             this.layout.leftMargin + 10,
             this.layout.bottomMargin + (this.layout.marginSize) + 6,
             this.layout.leftMargin + 10,
             this.layout.bottomMargin + (this.layout.marginSize) - 6);
    // Arrow right
    triangle(this.layout.rightMargin,
             this.layout.bottomMargin + (this.layout.marginSize),
             this.layout.rightMargin - 10,
             this.layout.bottomMargin + (this.layout.marginSize) - 6,
             this.layout.rightMargin - 10,
             this.layout.bottomMargin + (this.layout.marginSize) + 6);
    
    // Y-axis
    // Line
    line(this.layout.leftMargin - (this.layout.marginSize),
         this.layout.topMargin,
         this.layout.leftMargin - (this.layout.marginSize),
         this.layout.bottomMargin);
    // Arrow top
    triangle(this.layout.leftMargin - (this.layout.marginSize),
             this.layout.topMargin,
             this.layout.leftMargin - (this.layout.marginSize) - 6,
             this.layout.topMargin + 10,
             this.layout.leftMargin - (this.layout.marginSize) + 6,
             this.layout.topMargin + 10);
    // Arrow bottom
    triangle(this.layout.leftMargin - (this.layout.marginSize),
             this.layout.bottomMargin,
             this.layout.leftMargin - (this.layout.marginSize) - 6,
             this.layout.bottomMargin - 10,
             this.layout.leftMargin - (this.layout.marginSize) + 6,
             this.layout.bottomMargin - 10);  
  };
  
  this.drawArrowAxisLabels = function(xMinLabel, yMinLabel, xMidLabel, yMidLabel, xMaxLabel, yMaxLabel, xUnits, yUnits) {
    noStroke();
    textAlign('center', 'center');
    textSize(18);
    var xMinTitle = xMinLabel +""+ xUnits;
    var yMinTitle = yMinLabel +""+ yUnits;
    var xMidTitle = makeTitle(xMidLabel);
    var yMidTitle = makeTitle(yMidLabel);
    var xMaxTitle = xMaxLabel +""+ xUnits;
    var yMaxTitle = yMaxLabel +""+ yUnits;
    
    // Draw rectangle backgounds for the labels
    push();
    fill(255);
    rectMode(CENTER);
    // X Label rectangle
    rect(this.layout.rightMargin / 2,
         this.layout.bottomMargin + (this.layout.marginSize), textWidth(xMidTitle) + 20, 18);
    
    // Y Label rectangle
    rect(this.layout.leftMargin - (this.layout.marginSize),
        (this.layout.bottomMargin / 2), 18, textWidth(yMidTitle) + 20);
    pop();
  
    // X-axis labels
    fill(0);
    // Min Label
    text(xMinTitle,
         this.layout.leftMargin + textWidth(xMinTitle),
         this.layout.bottomMargin + (this.layout.labelPad));
    // Mid Label
    text(xMidTitle,
         this.layout.rightMargin / 2,
         this.layout.bottomMargin + (this.layout.marginSize));
    // Max Label
    text(xMaxTitle,
         this.layout.rightMargin - textWidth(xMaxTitle),
         this.layout.bottomMargin + (this.layout.labelPad));
  
    // Y-axis labels
    // Min Label
    push();
    translate(this.layout.leftMargin - (this.layout.labelPad * 2.5),
              this.layout.bottomMargin - (textWidth(yMinTitle) / 2));
    rotate(-(PI / 2));
    text(yMinTitle, 0, 0);
    pop();
    push();
    // Mid Label
    translate(this.layout.leftMargin - (this.layout.marginSize),
             (this.layout.bottomMargin / 2));
    rotate(-(PI / 2));
    text(yMidTitle, 0, 0);
    pop();
    // Max Label
    push();
    translate(this.layout.leftMargin - (this.layout.labelPad * 2.5),
              this.layout.topMargin + (textWidth(yMaxTitle) / 2));
    rotate(-(PI / 2));
    text(yMaxTitle, 0, 0);
    pop();
  };
}
