function Bubble(colour, label, x, y, size, layout) {
	this.layout = layout;
	this.colour = colour;
	this.label = label;
	this.size = size;
	this.x = x;
	this.y = y;
	
	// Detect if mouse is over the bubble
	this.mouseOver = function() {
		if (dist(this.x, this.y, mouseX, mouseY) < this.size / 2){
				return true;
		}
		return false;
	};
	
	// If the text for the bubble goes off screen, this function corrects it
	this.xWithinBounds = function() {
		if (this.x - (textWidth(this.label) / 2) < layout.leftMargin) {
			// Correct text going off the left side of the screen
			return layout.leftMargin + (textWidth(this.label) / 2);
		} else if (this.x + (textWidth(this.label) / 2) > layout.rightMargin) {
			// Correct text going off the right side of the screen
			return layout.rightMargin - (textWidth(this.label) / 2);
		} else {
			return this.x;
		}
	};
	
	// Draws the label of the bubble
	this.drawLabels = function() {
		if (this.mouseOver()) {
			push();
			textSize(18);
			var textX = this.xWithinBounds();
			stroke(255);
			strokeWeight(3);
			text(makeTitle(this.label), textX, this.y - (this.size / 2) - 12);
			pop();
		}
	};
	
	// Draws the bubble as an ellipse
	this.draw = function() {
		push();
    strokeWeight(0);
		// Bubble is made slightly transparent to allow for overlap of bubbles
		var transparent = color(this.colour);
		transparent.setAlpha(200);
    fill(transparent);
    ellipse(this.x, this.y, this.size);
    pop();	
	};
}