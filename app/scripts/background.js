'use strict';

//initialize extension
chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

//declare an empty list of caches and set counter in badge to zero
var listOfCaches = [];
chrome.browserAction.setBadgeText({text: '0'});

//add an event listener for the content and popup scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  //console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
		    
  //event handler for new cache entry
  if (request.type === 'addGeocache') {
    //lookup if item already exists in the list
    var found = false;
    for (var i=0; i<listOfCaches.length; i++) {
      if (listOfCaches[i].id === request.data.id) {
        found = true;
      }
    }
    //if item is unique add it and update the counter in the badge
    if (!found) {
      listOfCaches.push(request.data);
      chrome.browserAction.setBadgeText({text: listOfCaches.length.toString()});
    }
    
    //notify caller
    sendResponse({status: 'ok'});
  //event handler for receiving the list of caches
  } else if (request.type === 'listGeocaches') {
    sendResponse(listOfCaches);
  //event handler for clearing the list of caches
  } else if (request.type === 'clearListOfCaches') {
    //clear it locallay and set the counter in the badge back to zero
    listOfCaches = [];
    chrome.browserAction.setBadgeText({text: '0'});
    
    //notify caller
    sendResponse('cleared');
  }
});
