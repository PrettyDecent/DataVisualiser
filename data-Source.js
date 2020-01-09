function dataSource(id, name, location, units) {
	this.id = id;
	this.name = name;
	this.location = location;
	this.loaded = false;
	this.test = "No";
	
	if (units == undefined) {
		this.units = "";
	} else {
		this.units = units;
	}
	
	this.errorAlert = function(error) {
		//alert(error);
		return;
	};
	
	this.errorCheck = function() {
		if (this.data.getColumnCount() < 2 || this.data.getRowCount() < 3) {
			// Returns name of problematic file
			//this.errorAlert("Not enough data to display in file: "+ self.id +".csv");
			return false;
		} else {
			// Confirms file is loaded with no errors
			return true;
		}
	};
	
	this.loadToTable = function(callback) {
	  var self = this;
	  this.data = loadTable(
			this.location, 'csv', 'header',
			// Callback function for successful load
			function(table) {
				self.loaded = true;
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
