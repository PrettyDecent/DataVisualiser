// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var visMenu;
var srcMenu;

var test = "Fail";

function testCallback() {
  console.log(test);
}

function testFunc(val, callback) {
  setTimeout(function(){ test = "Pass"; }, 2000);
  callback();
}

testFunc(1, function() {
  console.log(test);
});

function setup() {
  // Create a canvas to fill the content div from index.html.
  var cHeight = document.getElementById('app').clientHeight;
  var cWidth = document.getElementById('app').clientWidth;
  canvasContainer = select('#app');
  var c = createCanvas(cWidth, cHeight);
  c.parent('app');
  
  visMenu = new menu('#drop-visual'); //#visuals-menu
  srcMenu = new menu('#drop-source'); //#sources-menu
  
  this.addVisual = function(vis) {
    visMenu.addItem(vis);
  };
  
  this.addSource = function(vis, source, callback) {
    if (source.errorCheck()) {
      vis.sources.push(source);
    }
    
  };

  
  this.addVisual(new PieChart());
  this.addVisual(new SplitBarChart());
  this.addVisual(new ScatterGraph());
  this.addVisual(new LineGraph());
  this.addVisual(new LineGraphGradient());
  
  this.addSource(visMenu.items[0], new dataSource('employee-diversity', 'Employee diversity in large companies', './data/pie-chart/race-2018.csv'), this.sourceLoaded);
  console.log("Two");
  this.addSource(visMenu.items[0], new dataSource('food-sourcing', 'British attitudes to food sourcing', './data/pie-chart/attitudes.csv'), this.sourceLoaded); 
 
  this.addSource(visMenu.items[1], new dataSource('gender-diversity-companies', 'Gender diversity in large companies', './data/split-bar-chart/gender-2018.csv'), this.sourceLoaded);
  this.addSource(visMenu.items[1], new dataSource('gender-diversity-ethnicity', 'Gender diversity in ethnic groups', './data/split-bar-chart/ethnic-groups-2011.csv'), this.sourceLoaded);
  this.addSource(visMenu.items[1], new dataSource('hospital-attendance', 'Hospital Attendance in the UK', './data/split-bar-chart/hospital-attendance.csv'), this.sourceLoaded);
  
  this.addSource(visMenu.items[2], new dataSource('pay-gap-by-job', 'Pay diversity in large companies', './data/scatter-graph/occupation-hourly-pay-by-gender-2017.csv'), this.sourceLoaded);
  this.addSource(visMenu.items[2], new dataSource('uk-temp-by-weather', 'UK Temperature by weather', './data/scatter-graph/uk-mean-temp-by-weather.csv'), this.sourceLoaded);
  this.addSource(visMenu.items[2], new dataSource('test', 'TEST', './data/scatter-graph/test.csv'));
  
  this.addSource(visMenu.items[3], new dataSource('pay-gap-97-17', 'Gender pay gap 1997-2017', './data/line-graph/all-employees-hourly-pay-by-gender-1997-2017.csv', "%"), this.sourceLoaded);
  this.addSource(visMenu.items[3], new dataSource('energy-expenditure', 'UK Energy Expenditure 1970-2018', './data/line-graph/uk-energy-expenditure-1970-2018.csv', "£"), this.sourceLoaded);
  this.addSource(visMenu.items[3], new dataSource('employment-rate', 'UK Employment Rate 1971-2018', './data/line-graph/uk-employment-rate-1971-2018.csv', "%"), this.sourceLoaded);
  
  this.addSource(visMenu.items[4], new dataSource('climate-change', 'Climate Change', './data/gradient-line-graph/surface-temperature.csv', '℃'), this.sourceLoaded);
  this.addSource(visMenu.items[4], new dataSource('prison-population', 'UK Prison Population', './data/gradient-line-graph/prison-population.csv', 'Inmates'), this.sourceLoaded);
  // Name and file id can be the same, the location within the data file can be specified by the vismenu id
  
  visMenu.loadMenu();
  
  
}

function draw() {
  background(255);

  if (visMenu.selected != null) {
    visMenu.selected.draw();
  }
}

function windowResized() {
  //Canvas resizes, now visuals need to resize with it
  var cHeight = document.getElementById('app').clientHeight;
  var cWidth = document.getElementById('app').clientWidth;
  resizeCanvas(cWidth, cHeight);
}
