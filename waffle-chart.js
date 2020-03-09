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
    
    // Load the current source to display
    this.source = this.sources[this.sourceIndex];
    
    // Error check to see that source is loaded
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    
    // Get the total number of rows
    this.total = this.source.data.getRowCount();
    
    // Sets a limit on the slider, more than 8 waffles per row is unreadable
    var sliderLim = 8;
    if (this.total < sliderLim) {
      // If the total is less than the limit, set the limit to the toal
      sliderLim = this.total;
    }
    
    // Create the slider, set its starting point to be the middle of the max and min values
    this.rowSlider = createSlider(1,
                                  sliderLim,
                                  Math.round(this.total/2),
                                  1);
    this.rowSlider.position(100, 100);
    
    // yMod is the amount of y position of the waffles is modified by
    // Used to implement the scrolling feature
    this.yMod = 0;
  };
  
  // Removes the slider when visual is deselected
  this.destroy = function() {
    this.rowSlider.remove();
  };

  this.draw = function() {
    
    // Draws title to screen
    this.drawTitle();
    
    // Creates an array to store the waffles
    var waffles = [];
    var total = this.total;
    
    var sliderVal = this.rowSlider.value();
    
    // Calculates the amount of waffles the can be displayed in rows of the same length
    // And calculates how many additional waffles must be drawn
    var mod = total % sliderVal;
		var per = total - mod;
		
    // Calculates the size of the waffles relative to the amount in each row
    var waffleDim = this.layout.plotWidth / (sliderVal + ((sliderVal-1) / 2));
    var xAlign = this.layout.leftMargin;
		var waffleX;
    
    // Sets the starting y value to draw from
    var waffleY = this.layout.topMargin;
    
    // Prevent overflow when one waffle is displayed
    if (waffleDim + (this.layout.marginSize) + this.layout.labelPad > height) {
      // Restricts the maximum waffle size to be less than the height of the window
      waffleDim = height - ((this.layout.marginSize*2) + (this.layout.labelPad*2));
      // Moves the waffle to the middle so that it isn't off to one side
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
                              waffleY + this.yMod,
                              waffleDim,
                              this.layout));
          waffleX += waffleDim * 1.5;
          }
          waffleY += waffleDim * 1.5;
        }
    }
    
		// Draws additional row
    waffleX = xAlign;
    var addRow = 0;
		for (var z = 0; z < mod; z++) {
			waffles.push(new Waffle(color(0, 0, 255, 180),
                            this.source.data.get(waffles.length, 0),
                            this.source.data.get(waffles.length, 1),
                            waffleX,
                            waffleY + this.yMod,
                            waffleDim,
                            this.layout));
      waffleX += waffleDim * 1.5;
      addRow = 1;
		}
    
    // Draws all the waffles added to the array
    for (var w = 0; w < total; w++) {
      waffles[w].draw();
    }
    
    // Detects current waffle dimensions means they flow off the bottom of the screen
    if (((per / sliderVal) + addRow) * (waffleDim * 1.5) > height) {
      // Detects users key press to allow them to scroll up and down
      if (keyIsDown(DOWN_ARROW)) {
        this.yMod -= 4;
      } else if (keyIsDown(UP_ARROW)) {
        this.yMod += 4;
      }
      // Constrains yMod so the user cannot scroll off the screen
      this.yMod = constrain(this.yMod, -((((per / sliderVal) + addRow) - 1) * (waffleDim * 1.5)), 0);
    }
    
    // Update the values of the location dependent variables
    this.layout.posUpdate();
  };
  
  // Taken from existing line graph code
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
