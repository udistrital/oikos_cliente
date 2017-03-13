'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearEdificioCtrl
 * @description
 * # CrearEdificioCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearEdificioCtrl', function (oikosRequest) {

    //Se crea la variable self
    var self = this;
    self.edificio = {};

    /*Función para insertar edificios*/
    self.confirmar = function() {
        var json = {
          "Nombre": self.edificio.nombre,
          "Codigo": self.edificio.descripcion,
          "Estado": self.edificio.dominio
        };

        //Registrar Edificio
        oikosRequest.post('espacio_fisico', json)
          .then(function() {
            alert("Guardo exitosamente");
            //Limpia los campos despues de hacer una inserción
            self.edificio = {};
          });
      }

      /*Función para limpiar todos los campos del formulario con el botón "Cancelar"*/
      self.reset = function(form) {
        self.edificio = {};
        if (form) {
          form.$setPristine();
          form.$setUntouched();
        }
      };
  });
