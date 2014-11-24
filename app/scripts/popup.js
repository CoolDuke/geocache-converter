'use strict';

console.log('\'Allo \'Allo! Popup');

chrome.runtime.sendMessage({type: 'listGeocaches'}, function(response) {
  for (var i=0; i<response.length; i++) {
    document.getElementById('geocacheList').innerHTML += '<li>' + response[i] + '</li>';
  }
});
