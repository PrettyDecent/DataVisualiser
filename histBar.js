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
		
		drawConstrainedLabel(this.label, this.x, this.layout.bottomMargin + (this.layout.marginSize / 2), this.w);  
			
		push();
		fill(this.colour);
		stroke(0);
		strokeWeight(0.5);
		rectMode(CORNER);
		rect(this.x, this.y, this.w, this.h);
		pop();	
	};
}