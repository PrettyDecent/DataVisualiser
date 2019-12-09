
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select('#app');
  var c = createCanvas(1024, 576);
  c.parent('app');

  /*
  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
  
  gallery.addSource(gallery.visuals[0], new dataSource('food-sourcing', 'British attitudes to food sourcing', './data/tech-diversity-race/attitudes.csv', 'British attitudes to'));
  */
  
  visMenu = new menu('#visuals-menu');
  srcMenu = new menu('#sources-menu');
  
  this.addVisual = function(vis) {
    visMenu.addItem(vis);
  };
  
  this.addSource = function(vis, source) {
    vis.sources.push(source);
    //vis.preload();
  };
  
  this.addVisual(new TechDiversityRace());
  this.addVisual(new TechDiversityGender());
  this.addVisual(new PayGapByJob2017());
  this.addVisual(new PayGapTimeSeries());
  this.addVisual(new ClimateChange());
  
  this.addSource(visMenu.items[0], new dataSource('employee-diversity', 'Employee diversity in large companies', './data/tech-diversity-race/race-2018.csv', 'Employee diversity at'));
  this.addSource(visMenu.items[0], new dataSource('food-sourcing', 'British attitudes to food sourcing', './data/tech-diversity-race/attitudes.csv', 'British attitudes to')); 
 
  //Eventually this will occur when the source is selected rather than when all have been added
  visMenu.items[0].preload();
 
  visMenu.loadMenu();
}

function draw() {
  background(255);
  /*
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
  */
  if (visMenu.selected != null) {
    visMenu.selected.draw();
  }
}
