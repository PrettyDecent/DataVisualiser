function menu(menuId) {
	
	this.menuId = menuId;
	this.items = [];
	this.selected = null;
	var self = this;
	
	this.selectItem = function(id){
    var index = this.findIndex(id);
    
    if (index != null) {
      // If the current visualisation has a deselect method run it.
      if (this.selected != null && this.selected.hasOwnProperty('destroy')) {
        this.selected.destroy();
      }
      //visIndex / sourceIndex
      // Select the visualisation in the gallery.
      this.selected = this.items[index];

      // Initialise visualisation if necessary.
      if (this.selected.hasOwnProperty('setup')) {
        this.selected.setup();
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
		
		// For loop?
    //this.addToMenu('#visuals-menu', item.name, item.id);
  };

  this.loadMenu = function() {
    // Create menu item.
		for (x = 0; x < this.items.length; x++) {
			var menuItem = createElement('li', this.items[x].name);
			menuItem.addClass('menu-item');
			menuItem.id(this.items[x].id);
				
			menuItem.mouseOver(function(e)
			{
					var el = select('#' + e.srcElement.id);
					el.addClass("hover");
			});
				
			menuItem.mouseOut(function(e)
			{
					var el = select('#' + e.srcElement.id);
					el.removeClass("hover");
			});
	
			menuItem.mouseClicked(function(e)
			{
					//remove selected class from any other menu-items
					var menuItems = selectAll('.menu-item');
					
					for(var i = 0; i < menuItems.length; i++)
					{
							menuItems[i].removeClass('selected');
					}
					
					var el = select('#' + e.srcElement.id);
					el.addClass('selected');
					self.selectItem(e.srcElement.id);    
			});
			
			var domMenu = select(this.menuId);
			domMenu.child(menuItem);
		}
  };
}