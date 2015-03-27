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

  var averageSpeed = 30; var refreshInterval = 5000; var proximity = 0.5;

  var savedLocations = localStorageService.get('savedLocations');
  $scope.savedLocations =  savedLocations || [];

  $scope.$watch('savedLocations', function() { localStorageService.set('savedLocations', $scope.savedLocations); }, true);

  $scope.locCoords = {lat: 0, lon: 0, area: 'unknown'};
  $scope.destCoords = {lat: 0, lon: 0, area: 'unknown'};
  $scope.sleeping = false;
  $scope.arrived = false;

  var input = document.getElementById('search');
  var autocomplete = new google.maps.places.Autocomplete(input);
  var geocoder = new google.maps.Geocoder();


  function updateLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
    getDistanceBetween($scope.locCoords.lat, $scope.locCoords.lon, $scope.destCoords.lat, $scope.destCoords.lon);
    getEstimatedSleep();
  };

  function showPosition(position) {
    $scope.locCoords.lat = position.coords.latitude;
    $scope.locCoords.lon = position.coords.longitude;
    getCurrentLocation();
    checkArrived();
  };

  $scope.sleep = function(location) {
    $scope.sleeping = true;
    $scope.promise = $interval(updateLocation, refreshInterval);
    if (location) {
      $scope.destCoords = {lat: location.lat,
                           lon: location.lon,
                           area: location.area};
    } else {
      var new_input = $('#search').val();
      geocoder.geocode({'address': new_input}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          $scope.destCoords = {lat: results[0].geometry.location.lat(),
                               lon: results[0].geometry.location.lng(),
                               area: results[0].formatted_address}
          $scope.savedLocations.push({location: new_input,
                                     lat: results[0].geometry.location.lat(),
                                     lon: results[0].geometry.location.lng(),
                                     area: results[0].formatted_address});
        };
      })
    };
    $scope.destination = '';
  };

  $scope.cancelSleep = function() {
    $scope.sleeping = false;
    $interval.cancel($scope.promise);
    $scope.locCoords = { lat: 0, lon: 0, area: 'unknown' };
    $scope.destCoords = { lat: 0, lon: 0, area: 'unknown' };
    $scope.arrived = false;
  };

function getDistanceBetween(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    $scope.distanceBetween = Math.round(d * 10) / 10;

    if (d < 0.5) {
      navigator.notification.vibrate(2500);
      navigator.notification.beep(3);
        };
  };

  function getEstimatedSleep() {
    $scope.estimatedSleep = Math.round(60 * $scope.distanceBetween / averageSpeed);
  };

  function getCurrentLocation() {
    var areaSearch = $resource('http://pelias.mapzen.com/reverse?', {lat: $scope.locCoords.lat, lon: $scope.locCoords.lon});
    areaSearch.get(function (data) { $scope.locCoords.area = data.features[0].properties.text; });
  };

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  };

  function checkArrived() {
    if ($scope.distanceBetween < proximity) $scope.arrived = true;
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