function WaffleChart() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Waffle Chart';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'waffle-chart';
  
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
      this.leftMargin = this.marginSize;
      this.plotWidth = this.rightMargin - this.leftMargin;
      this.topMargin = this.marginSize;
      this.bottomMargin = height - this.marginSize * 2.5;
      this.plotHeight = this.bottomMargin - this.topMargin;
    }
  };

  this.setup = function() {
    
    this.source = this.sources[this.sourceIndex];
    
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    
    this.total = this.source.data.getRowCount();
    
    this.rowSlider = createSlider(1,
                                  this.total,
                                  Math.round(this.total/2),
                                  1);
    this.rowSlider.position(100, 100);
    
    // Used to scale the width of each bar
    /*
    this.barSum = 0;
    for (var p = 0; p < this.barWidths.length; p++) {
      this.barSum += this.barWidths[p];
    }
    */
  };
  
  this.destroy = function() {
    this.rowSlider.remove();
  };

  this.draw = function() {
    // Draw the title above the plot.
    this.drawTitle();
    
    var waffles = [];
    var total = this.total;
    
    var sliderVal = this.rowSlider.value();
    
    var mod = total % sliderVal;
		var per = total - mod;
    
    /*
    fill(255, 0, 0);
    ellipse(this.layout.leftMargin, 200, 10);
    ellipse(this.layout.rightMargin, 200, 10);
    */
		
    var waffleDim = this.layout.plotWidth / (sliderVal + ((sliderVal-1) / 2));
    var xAlign = this.layout.leftMargin;
		var waffleX;
    var waffleY = this.layout.topMargin;
    
    // Investigate Y coordinate options
    if (waffleDim + (this.layout.marginSize) + this.layout.labelPad > height) {
      waffleDim = height - ((this.layout.marginSize*2) + (this.layout.labelPad*2));
      xAlign = (width / 2) - (waffleDim / 2);
		}
    
		// Draws number of rows divisible by slider value
    if (per > 0) {
      for (var y = 0; y < (per / sliderVal); y++) {
        waffleX = xAlign;
        for (var x = 0; x < sliderVal; x++) {
          waffles.push(new Waffle(color(0, 0, 255, 180),
                              this.source.data.get(waffles.length, 0),
                              this.source.data.get(waffles.length, 1),
                              waffleX,
                              waffleY,
                              waffleDim,
                              this.layout));
          waffleX += waffleDim * 1.5;
          }
          waffleY += waffleDim * 1.5;
        }
    }
    
		// Draws additional row
    waffleX = xAlign;
		for (var z = 0; z < mod; z++) {
			waffles.push(new Waffle(color(0, 0, 255, 180),
                            this.source.data.get(waffles.length, 0),
                            this.source.data.get(waffles.length, 1),
                            waffleX,
                            waffleY,
                            waffleDim,
                            this.layout));
      waffleX += waffleDim * 1.5;
		}
    for (var w = 0; w < total; w++) {
      waffles[w].draw();
    }
    this.layout.posUpdate();
  };
  
  this.drawTitle = function() {
    push();
    fill(0);
    noStroke();
    textAlign('center', 'center');

    textSize(16);
    text(this.source.name,
         (this.layout.plotWidth / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
    pop();
  };
}
