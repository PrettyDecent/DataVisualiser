function Waffle(colour, label, total, x, y, size, layout) {
	this.layout = layout;
	this.colour = colour;
	this.label = label;
	this.total = total;
	this.x = x;
	this.y = y;
	this.size = size;
	this.textHeight = 0;
	
	this.drawWaffleSquare = function(x, y, dim) {
		push();
    fill(this.colour);
    strokeWeight(0);
    rectMode(CORNER);
    rect(x, y, dim, dim);
    pop();	
	};
	
	this.draw = function() {
		
		var squareDim = this.size / 14.5;
		var squareX = this.x;
		var squareY = this.y;
		
		var filled = this.total;
		for (var y = 0; y < 10; y++) {
			squareX = this.x;
			squareY = this.y + ((squareDim * 1.5) * y);
			for (var x = 0; x < 10; x++) {
				squareX = this.x + ((squareDim * 1.5) * x);
				this.drawWaffleSquare(squareX, squareY, squareDim);
				filled--;
				if (filled < 1) {
					this.colour = color(100, 100, 100, 100);
				}
			}
		}
		
		drawConstrainedLabel(this.label, this.x, this.y + ((squareDim * 1.5) * 10) + layout.labelPad, this.size, (this.size/2) - layout.labelPad);
	};
}