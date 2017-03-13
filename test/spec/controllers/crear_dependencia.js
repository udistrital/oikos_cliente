'use strict';

describe('Controller: CrearDependenciaCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var CrearDependenciaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CrearDependenciaCtrl = $controller('CrearDependenciaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CrearDependenciaCtrl.awesomeThings.length).toBe(3);
  });
});
