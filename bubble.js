function Bubble(colour, name, x, y, size, layout) {
	this.layout = layout;
	this.colour = colour;
	this.name = name;
	this.size = size;
	this.x = x;
	this.y = y;
	
	this.mouseOver = function() {
		if (dist(this.x, this.y, mouseX, mouseY) < this.size / 2){
				//console.log("Within: "+ this.name);
				return true;
		}
		return false;
	};
	
	this.xWithinBounds = function() {
		if (this.x - (textWidth(this.name) / 2) < layout.leftMargin) {
			// Correct text going off the left side of the screen
			return layout.leftMargin + (textWidth(this.name) / 2);
		} else if (this.x + (textWidth(this.name) / 2) > layout.rightMargin) {
			// Correct text going off the right side of the screen
			return layout.rightMargin - (textWidth(this.name) / 2);
		} else {
			return this.x;
		}
	};
	
	this.drawLabels = function() {
		if (this.mouseOver()) {
			push();
			textSize(18);
			var textX = this.xWithinBounds();
			stroke(255);
			strokeWeight(3);
			text(makeTitle(this.name), textX, this.y - (this.size / 2) - 12);
			pop();
		}
	};
	
	this.draw = function() {
		push();
    strokeWeight(0);
    fill(this.colour);
    ellipse(this.x, this.y, this.size);
    pop();	
	};
}

/*
	if ((mouseX < (this.x + (this.size / 2))) && (mouseX > (this.x - (this.size / 2)))) {
			if ((mouseY < (this.y + (this.size / 2))) && (mouseY > (this.y - (this.size / 2)))) {
*/