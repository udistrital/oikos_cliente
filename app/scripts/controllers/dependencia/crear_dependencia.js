'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearDependenciaCtrl
 * @description
 * # CrearDependenciaCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearDependenciaCtrl', function (oikosRequest) {
    //Se utiliza la variable self estandarizada
    var self=this;
    //Se crea JSON para la nueva_dependencia
    self.nueva_dependencia = {};

    /*//Creación tabla que carga edificios
     self.gridOptions_dependencias = {
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        enableSelectAll: true,
        columnDefs: [
          { field: 'Nombre'},
          { field: 'Correo'}
     ],
   };

    //Función obtener los edificios
    oikosRequest.get('dependencia', $.param({
       limit: 0
    }))
    .then(function(response) {
       self.gridOptions_edificios.data = response.data;
    });*/

    //Función para crear la dependencia
    self.crear_dependencia=function(form){
      console.log(self.nueva_dependencia);
      //Petición POST
      oikosRequest.post("dependencia", self.nueva_dependencia).then(function(response){
        //Notificación de success
        swal("", "Se agregó con éxito la sede <b>" + self.nueva_dependencia.Nombre + "</b> con télefono <b>" +
        self.nueva_dependencia.Telefono + "</b>", "success");

        //Reinicia las variables y restablece el formulario
        self.nueva_dependencia={};
        form.$setPristine();
        form.$setUntouched();
      });
  };

  });
