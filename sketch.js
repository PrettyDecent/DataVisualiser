// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var visMenu;
var srcMenu;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select('#app');
  var c = createCanvas(windowWidth, windowHeight-110);
  c.parent('app');
  
  visMenu = new menu('#visuals-menu');
  srcMenu = new menu('#sources-menu');
  
  this.addVisual = function(vis) {
    visMenu.addItem(vis);
  };
  
  this.addSource = function(vis, source) {
    vis.sources.push(source);
  };
  
  this.addVisual(new TechDiversityRace());
  this.addVisual(new TechDiversityGender());
  this.addVisual(new PayGapByJob2017());
  this.addVisual(new PayGapTimeSeries());
  this.addVisual(new ClimateChange());
  
  this.addSource(visMenu.items[0], new dataSource('employee-diversity', 'Employee diversity in large companies', './data/tech-diversity-race/race-2018.csv', 'Employee diversity at'));
  this.addSource(visMenu.items[0], new dataSource('food-sourcing', 'British attitudes to food sourcing', './data/tech-diversity-race/attitudes.csv', 'British attitudes to')); 
 
  visMenu.loadMenu();
}

function draw() {
  background(255);

  if (visMenu.selected != null) {
    visMenu.selected.draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
