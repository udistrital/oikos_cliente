'use strict';

describe('Controller: CrearSedeCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var CrearSedeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CrearSedeCtrl = $controller('CrearSedeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CrearSedeCtrl.awesomeThings.length).toBe(3);
  });
});
