function Waffle(colour, label, total, x, y, size, layout) {
	this.layout = layout;
	this.colour = colour;
	this.label = label;
	this.perc = parseInt(total);
	this.x = x;
	this.y = y;
	this.size = size;
	this.textHeight = 0;
	
	// Draws one of the squares that makes up the waffle
	this.drawWaffleSquare = function(x, y, dim, col) {
		push();
    fill(col);
    strokeWeight(0);
    rectMode(CORNER);
    rect(x, y, dim, dim);
    pop();	
	};
	
	this.draw = function() {
		
		// Calculates the dimensions of one of the squares
		// One square is equal to the dim / 14.5 as the waffle is made up of 10 squares and 9 gaps of half a squares width
		var squareDim = this.size / 14.5;
		var squareX = this.x;
		var squareY = this.y;
		
		// The amount of squares to fill in stored
		// And the original colour is stored
		var filled = this.perc;
		var colour = this.colour;
		for (var y = 0; y < 10; y++) {
			squareX = this.x;
			squareY = this.y + ((squareDim * 1.5) * y);
			for (var x = 0; x < 10; x++) {
				squareX = this.x + ((squareDim * 1.5) * x);
				this.drawWaffleSquare(squareX, squareY, squareDim, colour);
				filled--;
				// For each filled square that is added, filled is reduced
				if (filled < 1) {
					// Once all filled squares are drawn, the remaining squares use a grey colour to indicate being unfilled
					colour = color(100, 100, 100, 100);
				}
			}
		}
		
		// Labels are constrained to prevent overlap
		drawConstrainedLabel(this.label, this.x, this.y + ((squareDim * 1.5) * 10) + layout.labelPad, this.size, (this.size/2) - layout.labelPad);
	};
}