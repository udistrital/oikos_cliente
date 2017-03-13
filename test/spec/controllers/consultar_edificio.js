'use strict';

describe('Controller: ConsultarEdificioCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var ConsultarEdificioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConsultarEdificioCtrl = $controller('ConsultarEdificioCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConsultarEdificioCtrl.awesomeThings.length).toBe(3);
  });
});
