function SplitBarChart() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Split Bar-Chart';

  // Unique ID 
  this.id = 'split-bar-chart';
  
  // List of data sources to be used in visualisation
  this.sources = [];
  this.sourceIndex = 0;

  this.layout = {
    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: 0,
    rightMargin: width-30,
    topMargin: 50,
    bottomMargin: height+50,
    pad: 5,
    
    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw.
    numXTickLabels: 10,
    numYTickLabels: 8,
    
    posUpdate: function() {
      this.rightMargin = width-30;
      this.bottomMargin = height-30;
      this.plotWidth = this.rightMargin - this.leftMargin;
      this.midX = (this.plotWidth / 2) + this.leftMargin;
    },
  };

  // Default visualisation colours.
  this.leftSplitColour = color(255, 0 ,0);
  this.rightSplitColour = color(0, 255, 0);

  this.setup = function() {
    
    // Load the current source to display
    this.source = this.sources[this.sourceIndex];
    
    // Error check to see that source is loaded
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    
    // Font defaults.
    textSize(16);
    
    this.layout.leftMargin = 0;
  };

  this.destroy = function() {
  };

  this.draw = function() {

    // Draw split labels at the top of the plot.
    this.drawCategoryLabels();
    
    var lineHeight = (this.layout.bottomMargin - this.layout.topMargin) / this.source.data.getRowCount();
    
    for (var i = 0; i < this.source.data.getRowCount(); i++) {
      // Calculate the y position for each company.
      var lineY = (lineHeight * i) + this.layout.topMargin;
      
      // Create an object that stores data from the current row.
      var group = {
        // Convert strings to numbers.
        'name': this.source.data.getString(i, 0),
        'leftSplit': this.source.data.getNum(i, 1),
        'rightSplit': this.source.data.getNum(i, 2),
      };

      // Draw the group name in the left margin.
      fill(0);
      noStroke();
      textAlign('right', 'top');
      this.setLeftMargin(group.name);
      text(group.name,
           this.layout.leftMargin - this.layout.pad,
           lineY);

      // Draw leftsplit rectangle.
      fill(this.leftSplitColour);
      rect(this.layout.leftMargin,
           lineY,
           this.mapPercentToWidth(group.leftSplit),
           lineHeight - this.layout.pad);

      // Draw rightsplit rectangle.
      fill(this.rightSplitColour);
      rect(this.layout.rightMargin,
           lineY,
           -this.mapPercentToWidth(group.rightSplit),
           lineHeight - this.layout.pad);
    }

    // Draw 50% line
    stroke(150);
    strokeWeight(1);
    line(this.layout.midX,
         this.layout.topMargin,
         this.layout.midX,
         this.layout.bottomMargin);
    
    this.layout.posUpdate();
  };

  this.drawCategoryLabels = function() {
    fill(0);
    noStroke();
    textAlign('left', 'top');
    text(this.source.data.columns[1],
         this.layout.leftMargin,
         this.layout.topMargin-20);
    textAlign('center', 'top');
    text('50%',
         this.layout.midX,
         this.layout.topMargin-20);
    textAlign('right', 'top');
    text(this.source.data.columns[2],
         this.layout.rightMargin,
         this.layout.topMargin-20);
  };

  this.mapPercentToWidth = function(percent) {
    return map(percent,
               0,
               100,
               0,
               this.layout.plotWidth);
  };
  
  this.setLeftMargin = function(text) {
    if (this.layout.leftMargin < textWidth(text)) {
      this.layout.leftMargin = textWidth(text) + 20;
    }
  };
}
