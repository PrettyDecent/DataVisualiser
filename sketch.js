// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var visMenu;
var srcMenu;

function setup() {
  // Set the height and width to be equal to the current size of the users window
  var cHeight = document.getElementById('app').clientHeight;
  var cWidth = document.getElementById('app').clientWidth;
  canvasContainer = select('#app');
  // Create a canvas to fill the content div from index.html
  var c = createCanvas(cWidth, cHeight);
  c.parent('app');
  
  visMenu = new Menu('#drop-visual'); //#visuals-menu
  srcMenu = new Menu('#drop-source'); //#sources-menu
  
  // Function to add a new visual
  this.addVisual = function(vis) {
    visMenu.addItem(vis);
  };
  
  // Function to add a new source to a specified visual
  this.addSource = function(vis, source) {
    vis.sources.push(source);
  };
  
  // Add visuals
  this.addVisual(new PieChart());
  this.addVisual(new SplitBarChart());
  this.addVisual(new BubbleChart());
  this.addVisual(new LineGraph());
  this.addVisual(new LineGraphGradient());
  this.addVisual(new Histogram());
  this.addVisual(new WaffleChart());
  
  // Add sources for Pie Chart
  this.addSource(visMenu.items[0], new DataSource('employee-diversity', 'Employee diversity in large companies', './data/pie-chart/race-2018.csv'));
  this.addSource(visMenu.items[0], new DataSource('food-sourcing', 'British attitudes to food sourcing', './data/pie-chart/attitudes.csv')); 
 
  // Add sources for Split Bar Chart
  this.addSource(visMenu.items[1], new DataSource('gender-diversity-companies', 'Gender diversity in large companies', './data/split-bar-chart/gender-2018.csv'));
  this.addSource(visMenu.items[1], new DataSource('gender-diversity-ethnicity', 'Gender diversity in ethnic groups', './data/split-bar-chart/ethnic-groups-2011.csv'));
  this.addSource(visMenu.items[1], new DataSource('hospital-attendance', 'Hospital Attendance in the UK', './data/split-bar-chart/hospital-attendance.csv'));
  
  // Add sources for Bubble Chart
  this.addSource(visMenu.items[2], new DataSource('pay-gap-by-job', 'Pay diversity in large companies', './data/bubble-chart/occupation-hourly-pay-by-gender-2017.csv'));
  this.addSource(visMenu.items[2], new DataSource('uk-temp-by-weather', 'UK Temperature by weather', './data/bubble-chart/uk-mean-temp-by-weather.csv'));
  
  // Add sources for Line Graph
  this.addSource(visMenu.items[3], new DataSource('pay-gap-97-17', 'Gender pay gap 1997-2017', './data/line-graph/all-employees-hourly-pay-by-gender-1997-2017.csv'));
  this.addSource(visMenu.items[3], new DataSource('energy-expenditure', 'UK Energy Expenditure 1970-2018', './data/line-graph/uk-energy-expenditure-1970-2018.csv'));
  this.addSource(visMenu.items[3], new DataSource('employment-rate', 'UK Employment Rate 1971-2018', './data/line-graph/uk-employment-rate-1971-2018.csv'));
  this.addSource(visMenu.items[3], new DataSource('union-membership', 'UK Trade union membership 1892-2008', './data/line-graph/uk-trade-union-membership.csv'));
  
  // Add sources for Line Graph with gradient
  this.addSource(visMenu.items[4], new DataSource('climate-change', 'Climate Change', './data/gradient-line-graph/surface-temperature.csv'));
  this.addSource(visMenu.items[4], new DataSource('prison-population', 'UK Prison Population', './data/gradient-line-graph/prison-population.csv'));
  
  // Add sources for Histogram
  this.addSource(visMenu.items[5], new DataSource('union-membership', 'UK Union membership by region 2010', './data/histogram/uk-union-membership-by-region-2010.csv'));
  this.addSource(visMenu.items[5], new DataSource('height-sample', 'Sample of Heights', './data/histogram/height-sample.csv'));
  this.addSource(visMenu.items[5], new DataSource('employment-rate', 'Employment Statistics by Age 2018', './data/histogram/employment-rate-by-age-2018.csv'));
  
  // Add sources for Waffle Chart
  this.addSource(visMenu.items[6], new DataSource('employment-by-religon', 'Employment Rate by Religion', './data/waffle-chart/employment-rate-by-religion.csv'));
  this.addSource(visMenu.items[6], new DataSource('self-employment', 'Self Employment in London Boroughs', './data/waffle-chart/self-employment-by-borough-2017.csv'));
  
  // Parent visuals menu to sources menu and load the visuals menu
  visMenu.addSubMenu(srcMenu);
  visMenu.loadMenu();
}

function draw() {
  background(255);

  // Draws the current visual
  if (visMenu.selected != null) {
    visMenu.selected.draw();
  }
}

function windowResized() {
  //Canvas resizes, now visuals need to resize with it
  var cHeight = document.getElementById('app').clientHeight;
  var cWidth = document.getElementById('app').clientWidth;
  resizeCanvas(cWidth, cHeight);
  
  // Exists purely to center the select bar in the pie chart
  if (visMenu.selected != null) {
    if (visMenu.selected.hasOwnProperty('resizeEvent')) {
      visMenu.selected.resizeEvent();
    }
  }
}
