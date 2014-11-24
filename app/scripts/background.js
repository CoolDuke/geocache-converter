'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '0'});

console.log('\'Allo \'Allo! Event Page for Browser Action');

var listOfCaches = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
		    
  if (request.type === 'addGeocache') {
    sendResponse({status: 'ok'});
    
    //add item only once
    var found = false;
    for (var i=0; i<listOfCaches.length; i++) {
      if (listOfCaches[i].id === request.data.id) {
        found = true;
      }
    }
    if (!found) {
      listOfCaches.push(request.data);
      chrome.browserAction.setBadgeText({text: listOfCaches.length.toString()});
    }
    
  } else if (request.type === 'listGeocaches') {
    sendResponse(listOfCaches);
  }
});
