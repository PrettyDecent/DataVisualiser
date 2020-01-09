function menu(menuId) {
	
	this.menuId = menuId;
	this.menuObj = select(menuId).child()[3];
	this.items = [];
	this.selected = this.items[0];
	var self = this;
	
	this.selectItem = function(id){
    var index = this.findIndex(id);
    
    if (index != null) {
      // If the current item has a deselect method run it.
      if (this.selected != null && this.selected.hasOwnProperty('destroy')) {
        this.selected.destroy();
      }
			
      // Select the item in the menu.
      this.selected = this.items[index];

      // Initialise visualisation.
      if (this.selected.hasOwnProperty('setup')) {
        this.selected.setup();
      }
			
			// 
			if (this.selected.hasOwnProperty('sources')) {
        srcMenu.items = this.items[index].sources;
				srcMenu.loadMenu();
      }
			
			if (this.selected.hasOwnProperty('location')) {
				visMenu.selected.sourceIndex = index;
				visMenu.selected.destroy();
				visMenu.selected.setup();
      }
			
      // Enable animation in case it has been paused by the current
      // visualisation.
      loop();
    }
  };
	
	this.preLoad = function(){
		var index = this.findIndex(id);
    
		if (this.items[index].hasOwnProperty('preload')) {
				this.items[index].preload();
			}
	};
	
	this.findIndex = function(id) {
    // Search through items for matching id
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id == id) {
        return i;
      }
    }

    // Visualisation not found.
    return null;
  };
	
	this.addItem = function(item) {

    // Check that the object has an id and name.
    if (!item.hasOwnProperty('id') && !item.hasOwnProperty('name')) {
      alert('Make sure your menu item has an id and name!');
    }

    // Check that the object has a unique id.
    if (this.findIndex(item.id) != null) {
      alert(`Vis '${item.name}' has a duplicate id: '${item.id}'`);
    }

    this.items.push(item);
  };
	
  this.loadMenu = function() {
		
		// Get menu and button label.
		var domDropdown = select(this.menuId).child();
		var domMenu = select("#" + domDropdown[3].id);
		var menuItems = domMenu.child();
		
		// Clear menu.
		for (x = menuItems.length-1; x > 0; x--) {
			menuItems[x].remove();
		}
		
		var domBtn = select("#" + domDropdown[1].id);
		domBtn.html(this.items[0].name);
		
		// Add menu items to the menu.
		for (x = 0; x < this.items.length; x++) {
			// Create menu item
			var menuItem = createElement('a', this.items[x].name);
			menuItem.id(this.items[x].id);
			
			// Add mouse clicked function to menu item
			menuItem.mouseClicked(function(e) 
			{
				// Change menu button to currently selected menu item name
				var domBtn = select("#" + domDropdown[1].id);
				domBtn.html(e.srcElement.text);
				self.selectItem(e.srcElement.id);
			});
			
			// Make menu item a child node of the menu
			domMenu.child(menuItem);
		}
  };
}