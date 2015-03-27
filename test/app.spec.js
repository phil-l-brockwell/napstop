describe('NetherTestController', function() {

  beforeEach(module('NetherTest'));

  var scope, ctrl;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('NetherTestController',{
      $scope: scope
    });
  }));

  it('has to initialize with zero coordinates', function(){
    expect(scope.locCoords.lat).toBe(0);
    expect(scope.locCoords.lon).toBe(0);
  });

  // it('initialises with an empty search result and term', function() {
  //   expect(scope.searchResult).toBeUndefined();
  //   expect(scope.searchTerm).toBeUndefined();
  // });


})