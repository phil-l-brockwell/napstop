var netherTest = angular.module('NetherTest', ['ngResource', 'ngRoute', 'LocalStorageModule'])
.config(['localStorageServiceProvider', function(localStorageServiceProvider){
 localStorageServiceProvider.setPrefix('ls');
}])
.config(function ($routeProvider) {
   $routeProvider
     .when('/', {
       templateUrl: 'views/main.html',
       controller: 'MainCtrl'
     })
     .when('/about', {
       templateUrl: 'views/about.html',
       controller: 'AboutCtrl'
     })
     .otherwise({
       redirectTo: '/'
     });
 });

'use strict';

netherTest.controller('NetherTestController', function($scope, $resource, $interval, localStorageService) {

 var savedLocations = localStorageService.get('savedLocations');
 $scope.savedLocations = savedLocations || [];
 $scope.$watch('savedLocations', function() { localStorageService.set('savedLocations', $scope.savedLocations); }, true);


 var averageSpeed = 15; var refreshInterval = 5000; var proximity = 1;
 var defaultLocation = { location: 'loading', lon: 0, lat: 0, area: 'loading'};

 var input = document.getElementById('search');
 var autocomplete = new google.maps.places.Autocomplete(input);
 var geocoder = new google.maps.Geocoder();

 initVariables();

 function updateLocation() {
   navigator.geolocation.getCurrentPosition(getLocCoords);
   getCurrentLocation();
   getStraightLineDistance();
   getEstimatedSleep();
   checkArrived();
 };

 function getLocCoords(position) {
   $scope.locCoords.lat = position.coords.latitude;
   $scope.locCoords.lon = position.coords.longitude;
 };

 function getCurrentLocation() {
   var areaSearch = $resource('http://pelias.mapzen.com/reverse?', {lat: $scope.locCoords.lat, lon: $scope.locCoords.lon});
   try { areaSearch.get(function (data) { $scope.locCoords.area = data.features[0].properties.text; }); }
   catch(e) {};
 };

 $scope.sleep = function(location) {
   $scope.sleeping = true;
   if (location) { $scope.destCoords = location; }
   else { getNewLocationWith($('#search').val()); };
   $scope.promise = $interval(updateLocation, refreshInterval);
 };

 function getNewLocationWith(new_input) {
   geocoder.geocode({'address': new_input}, function(results, status) {
     $scope.destCoords = {location: new_input, lat: results[0].geometry.location.lat(), lon: results[0].geometry.location.lng(), area: results[0].formatted_address};
     saveLocation($scope.destCoords);
   })
 };

 function saveLocation(newLocation) {
   $scope.savedLocations.push(newLocation);
   if ($scope.savedLocations.length > 3) $scope.savedLocations.shift();
 };

 $scope.cancelSleep = function() {
   $interval.cancel($scope.promise);
   initVariables();
 };

 function getStraightLineDistance() {
   var lat1 = $scope.locCoords.lat; var lon1 = $scope.locCoords.lon; var lat2 = $scope.destCoords.lat; var lon2 = $scope.destCoords.lon;
   var R = 6371; var dLat = deg2rad(lat2-lat1); var dLon = deg2rad(lon2-lon1);
   var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   var d = R * c; // Distance in km
   $scope.distanceBetween = Math.round(d * 10) / 10;
 };

 function deg2rad(deg) {
   return deg * (Math.PI/180);
 };

 function getEstimatedSleep() {
   $scope.estimatedSleep = Math.round(60 * $scope.distanceBetween / averageSpeed);
 };

 function checkArrived() {
   if ($scope.distanceBetween < proximity) { $scope.arrived = true; alertPhone(); };
 };

 function alertPhone() {
   navigator.notification.vibrate(2500);
   navigator.notification.beep(3);
 };

 function initVariables() {
   $scope.locCoords   = defaultLocation;
   $scope.destCoords  = defaultLocation;
   $scope.sleeping    = false;
   $scope.arrived     = false;
   $scope.destination = '';
 };


var theToggle = document.getElementById('toggle');

// based on Todd Motto functions
// http://toddmotto.com/labs/reusable-js/

// hasClass
function hasClass(elem, className) {
  return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}
// addClass
function addClass(elem, className) {
    if (!hasClass(elem, className)) {
      elem.className += ' ' + className;
    }
}
// removeClass
function removeClass(elem, className) {
  var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
  if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}
// toggleClass
function toggleClass(elem, className) {
  var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, " " ) + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(" " + className + " ") >= 0 ) {
            newClass = newClass.replace( " " + className + " " , " " );
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}

theToggle.onclick = function() {
   toggleClass(this, 'on');
   return false;
}

    // $scope.alert = function() {
    //   navigator.notification.vibrate(2500);
    // }

    // Show a custom alert
    //
    // $scope.showAlert = function showAlert() {
    //     navigator.notification.alert(
    //         'You are the winner!',  // message
    //         'Game Over',            // title
    //         'Done'                  // buttonName
    //     );
    // }

    // // Beep three times
    // //
    // $scope.playBeep = function playBeep() {
    //     navigator.notification.beep(3);
    // }

    // // Vibrate for 2 seconds
    // //
    // $scope.vibrate =function vibrate() {
    //       navigator.notification.vibrate(2500);
    // }

});