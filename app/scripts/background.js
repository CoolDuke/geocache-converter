'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '\'Allo'});

console.log('\'Allo \'Allo! Event Page for Browser Action');

var listOfCaches = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
		    
  if (request.type === 'addGeocache') {
    sendResponse({status: 'ok'});
    
    //add item only once
    var found = false;
    for (var i=0; i<listOfCaches.length; i++) {
      if (listOfCaches[i] === request.data) {
        found = true;
      }
    }
    if (!found) {
      listOfCaches.push(request.data);
    }
  }
});

/* TODO   - show listOfItems in popup and make it editable
 *        - add number of selected items to extension item (setBadgeText see above)
 */
