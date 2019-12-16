function dataSource(id, name, location, title) {
	this.id = id;
	this.name = name;
	this.location = location;
	this.title = title;
	
	
	this.loadToTable = function() {
	  var self = this;
	  this.data = loadTable(
      this.location, 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
		self.loaded = true;
      });
	};
	
	this.loadToTable();
}
