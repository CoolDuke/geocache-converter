'use strict';

//format to convert from: N 52° 29.216 E 013° 28.073

//add event listener to handle click event on add anchor
document.addEventListener('gccAddToList', function() {
  //check if we can find the location on the page
  var regex = /^(\w) (\d+)\D+ (\d+\.\d+) (\w) (\d+). (\d+\.\d+)$/;
  var m = regex.exec(document.getElementById('uxLatLon').innerHTML);

  //convert latitude to decimal value
  var lat = parseInt(m[2]) + m[3]/60;
  if(m[1] === 'S') { lat *= -1; }
  lat = Math.round(lat * 1000000) / 1000000;

  //convert longitude to decimal value
  var lon = parseInt(m[5]) + m[6]/60;
  if(m[4] === 'W') { lon *= -1; }
  lon = Math.round(lon * 1000000) / 1000000;
  
  //get id and desc from document title after stripping quotes
  var title = document.title.replace(/\"/gi, '');
  var id = title.split(' ')[0];
  var desc = title.replace(id + ' ', '');
  
  //create new cache object
  var geoData = { lat: lat,
                  lon: lon,
                  id: id,
                  desc: desc,
                  url: window.location.href
                };

  //construct message to background script
  var addData = {type: 'addGeocache', data: geoData};

  //send data to background script
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

//inject link for adding a cache to the list by searching for our anchor
var elements = document.getElementsByTagName('a');
for(var i=0; i<elements.length; i++) {
  var anchor = elements[i];
  //we want to hook in after the Ignore link
  if (anchor.innerHTML === 'Ignore') {
    console.log('found something to hook');
    
    //get url for link icon
    var iconUrl = chrome.extension.getURL('images/icon-16.png');

    //add new li element after the anchor's parent
    anchor.parentNode.outerHTML+='<li><a href="javascript:document.dispatchEvent(evt)" style="background-image:url(' + iconUrl + ')">Add to converter list</a></li>';
  }
}
