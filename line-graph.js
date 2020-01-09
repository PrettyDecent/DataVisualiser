function LineGraph() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Line Graph';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'line-graph';
  
  // List of data sources to be used in visualisation
  this.sources = [];
  this.sourceIndex = 0;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: 35,
    pad: 5,
    labelPad: 20,

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
    
    posUpdate: function() {
      // Locations of margin positions. Left and bottom have double margin
      // size due to axis and tick labels.
      this.rightMargin = width - this.marginSize;
      this.leftMargin = this.marginSize * 2;
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
    
    // Font defaults.
    textSize(16);
    
    // Names for each axis.
    this.xAxisLabel = this.source.data.columns[0];
    this.yAxisLabel = this.source.units;

    // Set min and max years: assumes data is sorted by date.
    this.startYear = this.source.data.getNum(0, 0);
    this.endYear = this.source.data.getNum(this.source.data.getRowCount() - 1, 0);

    // Find min and max pay gap for mapping to canvas height.
    this.minPayGap = toNearestMult(min(this.source.data.getColumn(1)), 10, true);
    this.maxPayGap = toNearestMult(max(this.source.data.getColumn(1)), 10, false);
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minPayGap,
                        this.maxPayGap,
                        this.layout,
                        this.mapPayGapToHeight.bind(this),
                        1);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    var previous;
    var numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.source.data.getRowCount(); i++) {

      // Create an object to store data for the current year.
      var current = {
        // Convert strings to numbers.
        'year': this.source.data.getString(i, 0),
        'dependent': this.source.data.getNum(i, 1)
      };

      if (previous != null) {
        // Draw line segment connecting previous year to current
        // year pay gap.
        stroke(0);
        
        //console.log(this.mapYearToWidth(current.year));
        line(this.mapYearToWidth(previous.year), this.mapPayGapToHeight(previous.dependent), this.mapYearToWidth(current.year), this.mapPayGapToHeight(current.dependent));
        
        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        if (i % xLabelSkip == 0) {
          drawXAxisTickLabel(previous.year, this.layout,
                             this.mapYearToWidth.bind(this));
        }
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }
    
    this.layout.posUpdate();
  };

  this.drawTitle = function() {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(this.source.name,
         (this.layout.plotWidth / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
  };

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,  // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapPayGapToHeight = function(value) {
    return map(value,
               this.minPayGap,
               this.maxPayGap,
               this.layout.bottomMargin,   // Draw top-to-bottom from margin.
               this.layout.topMargin);
  };
}