function TechDiversityRace() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Tech Diversity: Race';
  this.id = 'tech-diversity-race';
  
  // List of data sources to be used in visualisation
  this.sources = [];
  this.sourceIndex = 0;
  
  this.setup = function() {
    
    this.source = this.sources[this.sourceIndex];
    
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Create a select DOM element.
    this.select = createSelect();

    // Set select position.
    this.select.position(200, 200);

    // Fill the select object with the options names.
    for (var i = 1; i < this.source.data.getColumnCount(); i++) {
      this.select.option(this.source.data.columns[i]);
    }
  };

  this.destroy = function() {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width * 0.5, height * 0.55, width * 0.38);

  this.draw = function() {
    if (!this.source.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the current option from the select item.
    var variantName = this.select.value();

    // Get the column of raw data for companyName.
    var col = this.source.data.getColumn(variantName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.source.data.getColumn(0);

    // Colour to use for each category.
    var colours = this.colourGen(col.length);

    // Make a title.
    var title = this.source.name;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
  };
  
  this.colourGen = function(colourNum) {
    var colours = ['blue', 'red', 'green', 'pink', 'purple', 'yellow', 'brown', 'darkblue', 'darkgreen', 'darkred'];
    do {
      colours.pop();
    } while (colourNum < colours.length);
    return colours;
  };
}
