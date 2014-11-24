'use strict';

//N 52° 29.216 E 013° 28.073
document.addEventListener('gccAddToList', function() {
  var regex = /^(\w) (\d+)\D+ (\d+\.\d+) (\w) (\d+). (\d+\.\d+)$/;
  var m = regex.exec(document.getElementById('uxLatLon').innerHTML);

  var lat = parseInt(m[2]) + m[3]/60;
  if(m[1] === 'S') { lat *= -1; }
  lat = Math.round(lat * 1000000) / 1000000;

  var lon = parseInt(m[5]) + m[6]/60;
  if(m[4] === 'W') { lon *= -1; }
  lon = Math.round(lon * 1000000) / 1000000;
  
  //TODO don't make a string out of it here - send an object instead
  var geoData = lon + ',' + lat + ',"' + document.title.replace(/\"/gi, '') + '"';

  var addData = {type: 'addGeocache', data: geoData};

  chrome.runtime.sendMessage(addData, function(response) {
    //TODO show an error message if not ok
    response.status = null; //ignore response for now
  });
});

//inject javascript for using the gccAddToList event
var script = document.createElement('script');
var js = ['var evt = document.createEvent(\'Event\');',
          'evt.initEvent(\'gccAddToList\', true, false);'].join('\n');
script.textContent = js;
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

//inject link for adding a geocache to the list of items
var elements = document.getElementsByTagName('a');
for(var i=0; i<elements.length; i++) {
  var anchor = elements[i];
  if (anchor.innerHTML === 'Ignore') {
    console.log('found something to hook');
    
    //get url for link icon
    var iconUrl = chrome.extension.getURL('images/icon-16.png');
    anchor.parentNode.outerHTML+='<li><a href="javascript:document.dispatchEvent(evt)" style="background-image:url(' + iconUrl + ')">Add to converter list</a></li>';
  }
}
