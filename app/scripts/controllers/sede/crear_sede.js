'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearSedeCtrl
 * @description
 * # CrearSedeCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearSedeCtrl', function (oikosRequest) {
    //Se utiliza la variable self estandarizada
    var self=this;
    //Se crea JSON para la nueva_sede
    self.nueva_sede = {};
    self.nueva_sede.TipoEspacio = {Id:1};

    //Creación tabla que carga edificios
     self.gridOptions_edificios = {
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        enableSelectAll: true,
        columnDefs: [
          { field: 'Nombre'},
          { field: 'Codigo'}
     ],
   };

    //Función obtener los edificios
    oikosRequest.get('espacio_fisico', $.param({
       query: "TipoEspacio:2"
    }))
    .then(function(response) {
       self.gridOptions_edificios.data = response.data;
    });

    //Función para crear la sede
    self.crear_sede=function(form){
      console.log(self.nueva_sede);
      //Petición POST
      oikosRequest.post("espacio_fisico", self.nueva_sede).then(function(response){
        //Notificación de success
        swal("", "Se agregó con éxito la sede <b>" + self.nueva_sede.Nombre + "</b> con código <b>" +
        self.nueva_sede.Codigo + "</b>", "success");

        //Reinicia las variables y restablece el formulario
        self.nueva_sede={};
        form.$setPristine();
        form.$setUntouched();
      });
  };
});
