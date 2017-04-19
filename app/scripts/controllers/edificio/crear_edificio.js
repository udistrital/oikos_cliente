'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearEdificioCtrl
 * @description
 * # CrearEdificioCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearEdificioCtrl', function (oikosRequest, $scope) {

    //Se crea la variable $scope
    $scope.edificio = {};

    /*Función para insertar edificios*/
    $scope.confirmar = function() {
        var json = {
          "Nombre": $scope.edificio.nombre,
          "Codigo": $scope.edificio.descripcion,
          "Estado": $scope.edificio.dominio
        };

        //Registrar Edificio
        oikosRequest.post('espacio_fisico', json)
          .then(function() {
            alert("Guardo exitosamente");
            //Limpia los campos despues de hacer una inserción
            $scope.edificio = {};
          });
      }

      /*Función para limpiar todos los campos del formulario con el botón "Cancelar"*/
      $scope.reset = function(form) {
        $scope.edificio = {};
        if (form) {
          form.$setPristine();
          form.$setUntouched();
        }
      };
  });
