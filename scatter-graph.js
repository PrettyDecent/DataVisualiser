function ScatterGraph() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Scatter Graph';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'scatter-graph';
  
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
      this.leftMargin = this.marginSize * 1.5;
      this.plotWidth = this.rightMargin - this.leftMargin;
      this.topMargin = this.marginSize;
      this.bottomMargin = height - this.marginSize * 2.5;
    }
  };
  
  // Graph properties.
  /*this.pad = 30;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;*/

  this.setup = function() {
    
    this.source = this.sources[this.sourceIndex];
    
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get data from the table object.
    var numJobs = this.source.data.getColumn(1);
    var propFemale = this.source.data.getColumn(2);
    var payGap = this.source.data.getColumn(3);

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    //
    // Use full 100% for x-axis (proportion of women in roles).
    var propFemaleMin = toNearestMult(min(propFemale), 10, true); //0
    var propFemaleMax = toNearestMult(max(propFemale), 10, false); //100

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.

    var payGapMin = -createRange(payGap);
    var payGapMax = createRange(payGap);

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);
    
    var colours = colourGen(this.source.data.getRowCount());

    // Draw the axes.
    this.drawCrossAxis(this.layout);
    this.drawCrossAxisLabels(this.source.data.columns[2], this.source.data.columns[3]);
    
    fill(255);
    stroke(0);
    strokeWeight(1);

    for (i = 0; i < this.source.data.getRowCount(); i++) {
      // Draw an ellipse for each point.
      x = map(propFemale[i], propFemaleMin, propFemaleMax, this.layout.leftMargin + this.layout.marginSize, this.layout.rightMargin - this.layout.marginSize);
      y = map(payGap[i], payGapMin, payGapMax, this.layout.bottomMargin - this.layout.marginSize, this.layout.topMargin + this.layout.marginSize);
      size = map(numJobs[i], numJobsMin, numJobsMax, this.layout.dotSizeMin, this.layout.dotSizeMax);
      push();
      strokeWeight(0);
      fill(colours[i]);
      ellipse(x, y, size);
      pop();
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
  
  this.drawCrossAxisLabels = function(xLabel, yLabel) {
    fill(0);
    noStroke();
    textAlign('center', 'center');
    textSize(18);
  
    // Draw y-axis label.
    text(makeTitle(yLabel),
         (this.layout.plotWidth / 2) + this.layout.marginSize - this.layout.pad,
         this.layout.bottomMargin + (this.layout.marginSize ));
  
    // Draw x-axis label.
    push();
    translate(this.layout.labelPad,
              (this.layout.bottomMargin / 2));
    rotate(- PI / 2);
    text(makeTitle(xLabel), 0, 0);
    pop();
  };
}
