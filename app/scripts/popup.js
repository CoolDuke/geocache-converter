'use strict';

//initialize new angular object
var geocacheListPopup = angular.module('geocacheListPopup', [
  'ngRoute'
]);

//add a route provider maybe for future use
geocacheListPopup.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/popup_list.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

//main controller
geocacheListPopup.controller('MainCtrl', ['$scope',
  function($scope) {

  //initialize an empty list
  $scope.listOfCaches = [];
  
  //receive the list of caches from the background process
  chrome.runtime.sendMessage({type: 'listGeocaches'}, function(response) {
    $scope.$apply(function() {
      $scope.listOfCaches = response;
    });
  });
  
  //save button handler
  $scope.downloadCsvFile = function() {
    //do nothing if there is nothing to save
    if ($scope.listOfCaches.length === 0) { return; }
    
    //build csv string
    var csvString='';
    for (var i=0; i<$scope.listOfCaches.length; i++) {
      var cache = $scope.listOfCaches[i];
      csvString += cache.lon + ',' + cache.lat + ',"' + cache.id + ' ' + cache.desc + '"\r\n';
    }
    
    //create invisible anchor containing csv data and click it to start the download
    var link = document.createElement('a');
    link.download = 'geocaches.csv';
    link.href = 'data:text/csv,' + encodeURIComponent(csvString);
    link.click();
  };

  //clear button handler
  $scope.clearListOfCaches = function() {
    //clear list in background process first
    chrome.runtime.sendMessage({type: 'clearListOfCaches'}, function(response) {
      //check if clearing list in background process was successful
      if (response === 'cleared') {
        $scope.$apply(function() {
          //clear local list and close popup
          $scope.listOfCaches = [];
          window.close();
        });
      }
    });
  };
}]);
