'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearDependenciaCtrl
 * @description
 * # CrearDependenciaCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearDependenciaCtrl', function (oikosRequest, $window) {
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
        swal({
          html: "<label>Se insertó correctamente la dependencia con los siguientes datos</label><br><br><label><b>Nombre:</b></label> "
          + self.nueva_dependencia.Nombre+"<br><label><b>Télefono:</b></label> " + self.nueva_dependencia.Telefono +
          "<br><label><b>Correo electrónico:</b></label>" + self.nueva_dependencia.Correo,
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#449D44",
          cancelButtonColor: "#C9302C",
          confirmButtonText: "Consultar dependencia",
          cancelButtonText: "Registrar nueva dependencia",
        }).then(function() {
              //Si da click lo redirije a consultar dependencias
              $window.location.href = '#/consultar_dependencia';
            }, function(dismiss) {
              //Si da click lo redirije a crear_dependencia
              if (dismiss === 'cancel') {
                /*Función para limpiar todos los campos del formulario con el botón "Cancelar"*/
                $window.location.href = '#/crear_dependencia';
              }
            })
      });
  };
  });
