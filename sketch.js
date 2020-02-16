// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var visMenu;
var srcMenu;

function setup() {
  //getBucket();
  // Create a canvas to fill the content div from index.html.
  var cHeight = document.getElementById('app').clientHeight;
  var cWidth = document.getElementById('app').clientWidth;
  canvasContainer = select('#app');
  var c = createCanvas(cWidth, cHeight);
  c.parent('app');
  
  visMenu = new Menu('#drop-visual'); //#visuals-menu
  srcMenu = new Menu('#drop-source'); //#sources-menu
  
  this.addVisual = function(vis) {
    visMenu.addItem(vis);
  };
  
  this.addSource = function(vis, source) {
    vis.sources.push(source);
  };
  
  this.addVisual(new PieChart());
  this.addVisual(new SplitBarChart());
  this.addVisual(new BubbleChart());
  this.addVisual(new LineGraph());
  this.addVisual(new LineGraphGradient());
  this.addVisual(new Histogram());
  this.addVisual(new WaffleChart());
  
  this.addSource(visMenu.items[0], new DataSource('employee-diversity', 'Employee diversity in large companies', './data/pie-chart/race-2018.csv'));
  this.addSource(visMenu.items[0], new DataSource('food-sourcing', 'British attitudes to food sourcing', './data/pie-chart/attitudes.csv')); 
 
  this.addSource(visMenu.items[1], new DataSource('gender-diversity-companies', 'Gender diversity in large companies', './data/split-bar-chart/gender-2018.csv'));
  this.addSource(visMenu.items[1], new DataSource('gender-diversity-ethnicity', 'Gender diversity in ethnic groups', './data/split-bar-chart/ethnic-groups-2011.csv'));
  this.addSource(visMenu.items[1], new DataSource('hospital-attendance', 'Hospital Attendance in the UK', './data/split-bar-chart/hospital-attendance.csv'));
  
  this.addSource(visMenu.items[2], new DataSource('pay-gap-by-job', 'Pay diversity in large companies', './data/bubble-chart/occupation-hourly-pay-by-gender-2017.csv'));
  this.addSource(visMenu.items[2], new DataSource('uk-temp-by-weather', 'UK Temperature by weather', './data/bubble-chart/uk-mean-temp-by-weather.csv'));
  //this.addSource(visMenu.items[2], new dataSource('error-test', 'TEST', './data/bubble-chart/error-test.csv'));
  
  this.addSource(visMenu.items[3], new DataSource('pay-gap-97-17', 'Gender pay gap 1997-2017', './data/line-graph/all-employees-hourly-pay-by-gender-1997-2017.csv'));
  this.addSource(visMenu.items[3], new DataSource('energy-expenditure', 'UK Energy Expenditure 1970-2018', './data/line-graph/uk-energy-expenditure-1970-2018.csv'));
  this.addSource(visMenu.items[3], new DataSource('employment-rate', 'UK Employment Rate 1971-2018', './data/line-graph/uk-employment-rate-1971-2018.csv'));
  this.addSource(visMenu.items[3], new DataSource('union-membership', 'UK Trade union membership 1892-2008', './data/line-graph/uk-trade-union-membership.csv'));
  
  this.addSource(visMenu.items[4], new DataSource('climate-change', 'Climate Change', './data/gradient-line-graph/surface-temperature.csv'));
  this.addSource(visMenu.items[4], new DataSource('prison-population', 'UK Prison Population', './data/gradient-line-graph/prison-population.csv'));
  
  this.addSource(visMenu.items[5], new DataSource('union-membership', 'UK Union membership by region 2010', './data/histogram/uk-union-membership-by-region-2010.csv'));
  this.addSource(visMenu.items[5], new DataSource('height-sample', 'Sample of Heights', './data/histogram/height-sample.csv'));
  this.addSource(visMenu.items[5], new DataSource('employment-rate', 'Employment Statistics by Age 2018', './data/histogram/employment-rate-by-age-2018.csv'));
  
  this.addSource(visMenu.items[6], new DataSource('test', 'TEST', './data/waffle-chart/waffle-chart-test.csv'));
  
  // Name and file id can be the same, the location within the data file can be specified by the vismenu id
  
  visMenu.addSubMenu(srcMenu);
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
  
  // Exists purely to center the select bar in the pie chart
  if (visMenu.selected != null) {
    if (visMenu.selected.hasOwnProperty('resizeEvent')) {
      visMenu.selected.resizeEvent();
    }
  }
}

function getBucket()
{
  /*
    var request = new Request('https://s3.eu-west-2.amazonaws.com/visualisation-data/?list-type=2', {method: 'GET'});
    
    var auth = 'AWS4-HMAC-SHA256 Credential=AKIA5Q5ONH6QPG6BFUJM/20200125/eu-west-2/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=1dedac6051a59fefe2bb7d31fe296d901756c4031805c5ccb1e34df0403b85e5';
    
    request(
      {
        headers: {
          "Authorizaion": auth
        }
      }
    );
    
    fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Something went wrong on api server!');
      }
    }).
    then(response => {
      console.debug(response);
      // ...
    }).catch(error => {
      console.error(error);
    });
    */
  var data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;//true;
  
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });
  
  xhr.open("GET", "https://s3.eu-west-2.amazonaws.com/visualisation-data/?list-type=2");
  xhr.setRequestHeader("X-Amz-Content-Sha256", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  xhr.setRequestHeader("X-Amz-Date", "20200125T171652Z");//"20200125T161514Z");
  xhr.setRequestHeader("Authorization", "AWS4-HMAC-SHA256 Credential=AKIA5Q5ONH6QPG6BFUJM/20200125/eu-west-2/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=878dfdbe9011a95ede1247f13572329557e07c81d0d714e683aadaf114d6dac0");
  xhr.setRequestHeader("User-Agent", "PostmanRuntime/7.17.1");
  xhr.setRequestHeader("Accept", "*/*");
  xhr.setRequestHeader("Cache-Control", "no-cache");
  xhr.setRequestHeader("Postman-Token", "be6ce0cd-4b85-403e-9d3b-97b8385397f7,97a2a9c4-0cb7-4991-a6a2-0438522364d9");
  xhr.setRequestHeader("cache-control", "no-cache");
  
  xhr.send(data);
}
