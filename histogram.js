function Histogram() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Histogram';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'histogram';
  
  // List of data sources to be used in visualisation
  this.sources = [];
  this.sourceIndex = 0;

  this.layout = {
    marginSize: 35,
    pad: 5,
    labelPad: 20,
    grid: true,

    // Number of axis tick labels to draw
    numXTickLabels: 10,
    numYTickLabels: 9,
    
    posUpdate: function() {
      // Locations of margin positions. Left and bottom have double margin
      // size due to axis and tick labels.
      this.rightMargin = width - this.marginSize;
      this.leftMargin = this.marginSize * 2;
      this.plotWidth = this.rightMargin - this.leftMargin - 9;
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
    
    // Labels for each axis.
    this.xAxisLabel = this.source.data.columns[0];
    if (makeTitle(this.source.data.columns[1]) == "Frequency") {
      this.yAxisLabel = "Frequency Density";
    } else {
      this.yAxisLabel = this.source.data.columns[1];
    }
    
    // If the histogram bars have variable widths, calculate and store them here
    this.barWidths = [];
    this.freqDensities = [];
    for (var z = 0; z < this.source.data.getRowCount(); z++) {
      if (dataIsInt(this.source.data.get(z, 0))) {
        // Get specified bar width
        this.barWidths.push(this.rangeType(this.source.data.get(z, 0)));
      } else {
        // If bar value is not int, set all widths to be equal
        this.barWidths.push(1);
      }
      // Calculate freqDensities
      this.freqDensities.push(this.source.data.getNum(z, 1) / this.barWidths[z]);
    }
    
    // Find min and max Y value for mapping to canvas height.
    var multFactor = 10;
    this.minYValue = 0;
    this.maxYValue = toNearestMult(max(this.freqDensities), multFactor, false);
    
    // Used to scale the width of each bar
    this.barSum = 0;
    for (var p = 0; p < this.barWidths.length; p++) {
      this.barSum += this.barWidths[p];
    }
  };

  this.draw = function() {
    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minYValue,
                        this.maxYValue,
                        this.layout,
                        this.mapYValueToHeight.bind(this),
                        1);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);
    
    // Loop over all rows and draw a bar for each.
    var bars = [];
    for (var i = 0; i < this.source.data.getRowCount(); i++) {
      
      var barX; 
      if (i < 1) {
        barX = this.layout.leftMargin;
      } else { 
        barX = bars[i-1].x + bars[i-1].w;
      }
      
      bars.push(new HistBar(color(0, 0, 255, 180),
                            this.source.data.get(i, 0),
                            barX,
                            this.mapYValueToHeight(this.freqDensities[i]),
                            this.layout.plotWidth * (this.barWidths[i] / this.barSum),
                            this.layout.bottomMargin - this.mapYValueToHeight(this.freqDensities[i]),
                            this.layout));

      bars[i].draw();
    }
    this.layout.posUpdate();
  };

  this.rangeType = function(source) {
    // If value is singular (i.e: 20) return value
    // If value is a range (i.e: 21-29) return the difference of the two values
    var lRange = "";
    var rRange = "0";
    var hyphen = false;
    for (var x = 0; x < source.length; x++) {
      if (source.charAt(x) == "-") {
        hyphen = true;
        rRange = "";
      }
      else {
        if (!hyphen) {
          lRange += source.charAt(x);
        } else {
          rRange += source.charAt(x);
        } 
      }
    }
    var range = abs(parseFloat(lRange) - parseFloat(rRange));
    // Return value to 2dp
    return Math.round( range * 100) / 100;
  };
  
  this.drawTitle = function() {
    push();
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(this.source.name,
         (this.layout.plotWidth / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
    pop();
  };

  this.mapXValueToWidth = function(value, xAxisStart, xAxisEnd) {
    return map(value,
               xAxisStart,
               xAxisEnd,
               this.layout.leftMargin,  // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapYValueToHeight = function(value) {
    return map(value,
               this.minYValue,
               this.maxYValue,
               this.layout.bottomMargin,   // Draw top-to-bottom from margin.
               this.layout.topMargin);
  };
}
