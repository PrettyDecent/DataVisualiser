function HistBar(colour, label, x, y, w, h, layout) {
	this.layout = layout;
	this.colour = colour;
	this.label = label;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.textHeight = 0;
	
	this.draw = function() {
		
		// Label is constrained to prevent overlap
		drawConstrainedLabel(this.label, this.x, this.layout.bottomMargin + (this.layout.marginSize / 2), this.w, layout.labelPad*2);  
			
		// Calculation of bar is done externally
		// Bar is drawn as rect with specified colour
		push();
		fill(this.colour);
		stroke(0);
		strokeWeight(1);
		rectMode(CORNER);
		rect(this.x, this.y, this.w, this.h);
		pop();	
	};
}