'use strict';

describe('Controller: EdificioCtrl', function () {

  // load the controller's module
  beforeEach(module('oikosClienteApp'));

  var EdificioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EdificioCtrl = $controller('EdificioCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EdificioCtrl.awesomeThings.length).toBe(3);
  });
});
