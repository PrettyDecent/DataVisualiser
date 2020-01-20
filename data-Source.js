function DataSource(id, name, location, units) {
	this.id = id;
	this.name = name;
	this.location = location;
	this.loaded = false;
	
	if (units == undefined) {
		this.units = "";
	} else {
		this.units = units;
	}
	
	this.errorAlert = function(error) {
		alert(error);
		return;
	};

	this.loadToTable = function() {
	  var self = this;
	  this.data = loadTable(
			this.location, 'csv', 'header',
			// Callback function for successful load
			function(table) {
				// Checks for lack of data
				if (table.getColumnCount() < 2 || table.getRowCount() < 3) {
					// Returns name of problematic file
					self.errorAlert("Not enough data to display in file: "+ self.id +".csv");
				} else {
					// Confirms file is loaded with no errors
					self.loaded = true;
				}
			},
			// Callback function for error
			function(error) {
				alert(error);
				return;
			}
		);
	};
	
	this.loadToTable();
}
