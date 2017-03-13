'use strict';

describe('Controller: ConsultarSedeCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var ConsultarSedeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConsultarSedeCtrl = $controller('ConsultarSedeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConsultarSedeCtrl.awesomeThings.length).toBe(3);
  });
});
