'use strict';

describe('Controller: GestionarTipoEspacioCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var GestionarTipoEspacioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GestionarTipoEspacioCtrl = $controller('GestionarTipoEspacioCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GestionarTipoEspacioCtrl.awesomeThings.length).toBe(3);
  });
});
