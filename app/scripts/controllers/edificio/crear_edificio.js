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

    //Se utiliza la variable self estandarizada
    var self=this;
    //Se crea JSON para el nuevo_edificio
    self.nuevo_edificio = {};
    self.nuevo_edificio.TipoEspacio = {Id:2};

    //Creación tabla que carga edificios
     self.gridOptions_espacios_fisicos = {
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        enableSelectAll: true,
        columnDefs: [
          { field: 'Nombre'},
          { field: 'Codigo', displayName: 'Código'}
     ],
   };

    //Función obtener los edificios
    oikosRequest.get('espacio_fisico', $.param({
       query: "TipoEspacio:3",
       limit: 0
    }))
    .then(function(response) {
       self.gridOptions_espacios_fisicos.data = response.data;
    });

    console.log(self.nuevo_edificio);
    //Función para crear el edificio
    self.crear_edificio=function(form){
      console.log(self.nuevo_edificio);
      //Notificación de success
      swal("", "Se agregó con éxito el edificio <b>" + self.nuevo_edificio.Nombre + "</b> con código <b>" +
      self.nuevo_edificio.Codigo + "</b>", "success");

        //Reinicia las variables y restablece el formulario
        self.nuevo_edificio={};
        form.$setPristine();
        form.$setUntouched();
      };
  });
