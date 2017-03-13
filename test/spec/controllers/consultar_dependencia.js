'use strict';

describe('Controller: ConsultarDependenciaCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var ConsultarDependenciaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConsultarDependenciaCtrl = $controller('ConsultarDependenciaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConsultarDependenciaCtrl.awesomeThings.length).toBe(3);
  });
});
