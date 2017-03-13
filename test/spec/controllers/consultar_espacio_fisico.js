'use strict';

describe('Controller: ConsultarEspacioFisicoCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var ConsultarEspacioFisicoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConsultarEspacioFisicoCtrl = $controller('ConsultarEspacioFisicoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConsultarEspacioFisicoCtrl.awesomeThings.length).toBe(3);
  });
});
