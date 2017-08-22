'use strict';

describe('Controller: GestionarTipoDependenciaCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var GestionarTipoDependenciaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GestionarTipoDependenciaCtrl = $controller('GestionarTipoDependenciaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GestionarTipoDependenciaCtrl.awesomeThings.length).toBe(3);
  });
});
