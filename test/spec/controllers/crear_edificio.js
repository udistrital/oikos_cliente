'use strict';

describe('Controller: CrearEdificioCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var CrearEdificioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CrearEdificioCtrl = $controller('CrearEdificioCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CrearEdificioCtrl.awesomeThings.length).toBe(3);
  });
});
