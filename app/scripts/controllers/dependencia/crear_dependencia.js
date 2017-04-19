'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearDependenciaCtrl
 * @description
 * # CrearDependenciaCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearDependenciaCtrl', function (oikosRequest, $scope) {
    /*Función para insertar dependenciaes*/
    $scope.confirmar = function() {
      var json = {
        "Nombre": $scope.dependencia.nombre,
        "Telefono": $scope.dependencia.telefono,
        "Correo": $scope.dependencia.correo
      };

      //Registrar Aplicación
      oikosRequest.post('dependencia', json)
        .then(function() {
          alert("Guardo exitosamente");
          //Limpia los campos despues de hacer una inserción
          $scope.dependencia = {};
        });
    }

    /*Función para limpiar todos los campos del formulario con el botón "Cancelar"*/
    $scope.reset = function(form) {
      $scope.dependencia = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };

  });
