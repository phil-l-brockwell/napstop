var netherTest = angular.module('NetherTest', ['ngResource']);

netherTest.controller('NetherTestController', function($scope, $resource, $interval) {

  $interval(updateLocation, 1000);
  $scope.locCoords = {lat: 0, lon: 0}
  $scope.destCoords = {lat: 0, lon: 0}

  function updateLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
    getDistanceFromLatLonInKm($scope.locCoords.lat, $scope.locCoords.lon, $scope.destCoords.lat, $scope.destCoords.lon);
  };

  function showPosition(position) {
    $scope.locCoords = {lat: position.coords.latitude,
                        lon: position.coords.longitude}
  };

  $scope.sleep = function() {
    var searchResource = $resource('https://api.postcodes.io/postcodes/' + $scope.destination)

    searchResource.get(function (data) {
      $scope.destCoords = {lat: data.result.latitude,
                           lon: data.result.longitude};
      $scope.destination = '';
    });

  };

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    $scope.distanceBetween = d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  };

});