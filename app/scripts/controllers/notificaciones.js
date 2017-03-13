'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:NotificacionesCtrl
 * @description
 * # NotificacionesCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('NotificacionesCtrl', function($scope, notificacion) {
    $scope.imagePath = 'images/yeoman.png';
    $scope.notificacion = notificacion;
  });
