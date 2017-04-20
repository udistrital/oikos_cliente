'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearEspacioFisicoCtrl
 * @description
 * # CrearEspacioFisicoCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearEspacioFisicoCtrl', function (oikosRequest, $scope) {

      /*Función para insertar espacios fisicos*/
      $scope.confirmar = function() {
        var json = {
          "Nombre": $scope.espacio_fisico.nombre,
          "Codigo": $scope.espacio_fisico.telefono,
          "Correo": $scope.espacio_fisico.correo
        };

        //Registrar Espacio Físico
        oikosRequest.post('espacio_fisico', json)
          .then(function() {
            alert("Guardo exitosamente");
            //Limpia los campos despues de hacer una inserción
            $scope.espacio_fisico = {};
          });
      }

      /*Función para limpiar todos los campos del formulario con el botón "Cancelar"*/
      $scope.reset = function(form) {
        $scope.espacio_fisico = {};
        if (form) {
          form.$setPristine();
          form.$setUntouched();
        }
      };
  });
