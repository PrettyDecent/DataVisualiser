function LineGraphGradient() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Line Graph with Gradient';

  // Unique ID
  this.id = 'line-graph-gradient';
  
  // List of data sources to be used in visualisation
  this.sources = [];
  this.sourceIndex = 0;

  this.layout = {
    marginSize: 35,
    pad: 5,
    labelPad: 20,

    // Boolean to enable/disable background grid.
    grid: false,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 8,
    numYTickLabels: 8,
    
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

  this.setup = function() {
    
    this.source = this.sources[this.sourceIndex];
    
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    
    // Font defaults.
    textSize(16);
    textAlign('center', 'center');
    
    // Names for each axis.
    this.xAxisLabel = this.source.data.columns[0];
    this.yAxisLabel = this.source.units;

    // Set min and max years: assumes data is sorted by year.
    this.minYear = this.source.data.getNum(0, 'year');
    this.maxYear = this.source.data.getNum(this.source.data.getRowCount() - 1, 'year');

    // Find min and max temperature for mapping to canvas height.
    this.minTemperature = min(this.source.data.getColumn(1));
    this.maxTemperature = max(this.source.data.getColumn(1));

    // Find mean temperature to plot average marker.
    this.meanTemperature = mean(this.source.data.getColumn(1));

    // Count the number of frames drawn since the visualisation
    // started so that we can animate the plot.
    this.frameCount = 0;

    // Create sliders to control start and end years. Default to
    // visualise full range.
    this.startSlider = createSlider(this.minYear,
                                    this.maxYear - 1,
                                    this.minYear,
                                    1);

    this.endSlider = createSlider(this.minYear + 1,
                                  this.maxYear,
                                  this.maxYear,
                                  1);
  };

  this.destroy = function() {
    this.startSlider.remove();
    this.endSlider.remove();
  };

  this.draw = function() {
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    
    this.startSlider.position((this.layout.plotWidth / 2) - 100, 100);
    this.endSlider.position((this.layout.plotWidth / 2) + 100, 100);

    // Prevent slider ranges overlapping.
    if (this.startSlider.value() >= this.endSlider.value()) {
      this.startSlider.value(this.endSlider.value() - 1);
    }
    this.startYear = this.startSlider.value();
    this.endYear = this.endSlider.value();

    // Draw all y-axis tick labels.
    drawYAxisTickLabels(this.minTemperature,
                        this.maxTemperature,
                        this.layout,
                        this.mapTemperatureToHeight.bind(this),
                        1);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot average line.
    stroke(200);
    strokeWeight(1);
    line(this.layout.leftMargin,
         this.mapTemperatureToHeight(this.meanTemperature),
         this.layout.rightMargin,
         this.mapTemperatureToHeight(this.meanTemperature));

    // Plot all temperatures between startYear and endYear using the
    // width of the canvas minus margins.
    var previous;
    var numYears = this.endYear - this.startYear;
    var segmentWidth = this.layout.plotWidth / numYears;

    // Count the number of years plotted each frame to create
    // animation effect.
    var yearCount = 0;

    // Loop over all rows but only plot those in range.
    for (var i = 0; i < this.source.data.getRowCount(); i++) {

      // Create an object to store data for the current year.
      var current = {
        // Convert strings to numbers.
        'year': this.source.data.getNum(i, 'year'),
        'temperature': this.source.data.getNum(i, 1)
      };

      if (previous != null
          && current.year > this.startYear
          && current.year <= this.endYear) {

        // Draw background gradient to represent colour temperature of
        // the current year.
        noStroke();
        fill(this.mapTemperatureToColour(current.temperature));
        rect(this.mapYearToWidth(previous.year), this.layout.topMargin, segmentWidth, this.layout.bottomMargin - this.layout.topMargin);

        // Draw line segment connecting previous year to current
        // year temperature.
        stroke(0);
        line(this.mapYearToWidth(previous.year),
             this.mapTemperatureToHeight(previous.temperature),
             this.mapYearToWidth(current.year),
             this.mapTemperatureToHeight(current.temperature));

        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        if (yearCount % xLabelSkip == 0) {
          drawXAxisTickLabel(previous.year, this.layout,
                             this.mapYearToWidth.bind(this));
        }

        // When six or fewer years are displayed also draw the final
        // year x tick label.
        if ((numYears <= 6
             && yearCount == numYears - 1)) {
          drawXAxisTickLabel(current.year, this.layout,
                             this.mapYearToWidth.bind(this));
        }

        yearCount++;
      }

      // Stop drawing this frame when the number of years drawn is
      // equal to the frame count. This creates the animated effect
      // over successive frames.
      if (yearCount >= this.frameCount) {
        break;
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }

    // Count the number of frames since this visualisation
    // started. This is used in creating the animation effect and to
    // stop the main p5 draw loop when all years have been drawn.
    this.frameCount++;

    // Stop animation when all years have been drawn.
    if (this.frameCount >= numYears) {
      //noLoop();
    }
    
    this.layout.posUpdate();
  };

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapTemperatureToHeight = function(value) {
    return map(value,
               this.minTemperature,
               this.maxTemperature,
               this.layout.bottomMargin, // Lower temperature at bottom.
               this.layout.topMargin);   // Higher temperature at top.
  };

  this.mapTemperatureToColour = function(value) {
    var red =  map(value,
                   this.minTemperature,
                   this.maxTemperature,
                   0,
                   255);
    var blue = 255 - red;
    return color(red, 0, blue, 100);
  };
}