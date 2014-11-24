'use strict';

var geocacheListPopup = angular.module('geocacheListPopup', [
  'ngRoute'
]);

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

geocacheListPopup.controller('MainCtrl', ['$scope',
  function ($scope) {

  $scope.listOfCaches=[];
  
  chrome.runtime.sendMessage({type: 'listGeocaches'}, function(response) {
    $scope.$apply(function() {
      $scope.listOfCaches=response;
    });
  });
}]);

