function Menu(menuId) {
	
	this.menuId = menuId;
	this.menuObj = select(menuId).child()[3];
	this.items = [];
	this.selected = null;
	this.parentMenu = null;
	this.childMenu = null;
	var self = this;
	
	// Parents a specified menu to another menu
	this.addSubMenu = function(childMenu) {
		this.childMenu = childMenu;
		childMenu.parentMenu = this;
	};
	
	// Applied to the buttons within the drop-downs
	this.selectItem = function(id){
    var index = this.findIndex(id);
    
    if (index != null) {
      // If the current item has a deselect method run it.
      if (this.selected != null && this.selected.hasOwnProperty('destroy')) {
        this.selected.destroy();
      }
			
			// Select the item in the menu.
			this.selected = this.items[index];
			
			// Load sources into menu, loads visual
			if (this.childMenu != null) {
        this.childMenu.items = this.items[index].sources;
				this.selected.sourceIndex = 0; //this.childMenu.selected;
				this.childMenu.loadMenu();
				this.selected.setup();
      }
			
			// Load specific source into visual
			if (this.parentMenu != null) {
				this.parentMenu.selected.sourceIndex = index;
				if (this.parentMenu.selected.hasOwnProperty('destroy')) {
					this.parentMenu.selected.destroy();
				}
				this.parentMenu.selected.setup();
      }
			
      // Enable animation in case it has been paused
      loop();
    }
  };
	
	// Moved from each visualisation and is called when each source is instantiated
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
		
		// Once a visual has been chosen
		// Make the sources menu appear so a different source can be chosen
		select(this.menuId).style('display', 'inline-block');
		
		// Clear menu.
		for (x = menuItems.length-1; x > 0; x--) {
			menuItems[x].remove();
		}
		
		// Add menu items to the menu.
		for (x = 0; x < this.items.length; x++) {
			// Only if item is loaded
			// Error prevention (In Progress)
			if (this.items[x].hasOwnProperty('loaded')) {
				if (!this.items[x].loaded) {
					continue;
				}
			}
			// Create menu item
			var menuItem = createElement('a', this.items[x].name);
			menuItem.id(this.items[x].id);
			
			// Add mouse clicked function to menu item
			menuItem.mouseClicked(function(e) 
			{
				// Change visual menu button to currently selected menu item name
				var domBtn = select("#" + domDropdown[1].id);
				domBtn.html(e.srcElement.text);
				self.selectItem(e.srcElement.id);
			});
			
			// Make menu item a child node of the menu
			domMenu.child(menuItem);
		}
		
		if (this.parentMenu != null) {
			this.selected = this.items[0];
			// Set source menu button to currently selected menu item name
			var domBtn = select("#" + domDropdown[1].id);
		  domBtn.html(this.items[this.parentMenu.selected.sourceIndex].name);
    }
  };
}