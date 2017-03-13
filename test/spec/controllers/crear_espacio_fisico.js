'use strict';

describe('Controller: CrearEspacioFisicoCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var CrearEspacioFisicoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CrearEspacioFisicoCtrl = $controller('CrearEspacioFisicoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CrearEspacioFisicoCtrl.awesomeThings.length).toBe(3);
  });
});
