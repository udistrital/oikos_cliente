'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearEspacioFisicoCtrl
 * @description
 * # CrearEspacioFisicoCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearEspacioFisicoCtrl', function (oikosRequest) {
    //Se utiliza la variable self estandarizada
    var self=this;
    //Se crea JSON para la nuevo_espacio_fisico
    self.nuevo_espacio = {};
    self.nuevo_espacio.TipoEspacio = {Id:3};

    //Creación tabla que carga espacios_fisicos
     self.gridOptions_espacios_fisicos = {
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        enableSelectAll: true,
        columnDefs: [
          { field: 'Nombre'},
          { field: 'Codigo'}
     ],
   };

    //Función obtener los espacios_fisicos
    oikosRequest.get('espacio_fisico', $.param({
       query: "TipoEspacio:3"
    }))
    .then(function(response) {
       self.gridOptions_espacios_fisicos.data = response.data;
    });

    //Función para crear un espacio fisico
    self.crear_espacio_fisico=function(form){
      console.log(self.nuevo_espacio_fisico);
      oikosRequest.post("espacio_fisico", self.nuevo_espacio_fisico).then(function(response){
        //Notificación de success
        swal("", "Se agregó con éxito el espacio físico <b>" + self.nuevo_espacio.Nombre + "</b> con código <b>" +
        self.nuevo_espacio.Codigo + "</b>", "success");

        //Reinicia las variables y restablece el formulario
        self.nuevo_espacio_fisico={};
        form.$setPristine();
        form.$setUntouched();
      });
  };
  });
