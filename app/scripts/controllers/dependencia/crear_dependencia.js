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

      //Convertir a mayusculas
      self.nueva_dependencia.Nombre = self.nueva_dependencia.Nombre.toUpperCase();
      self.nueva_dependencia.Telefono = self.nueva_dependencia.Telefono.toUpperCase();
      self.nueva_dependencia.Correo = self.nueva_dependencia.Correo.toUpperCase();

      //Petición POST
      oikosRequest.post("dependencia", self.nueva_dependencia).then(function(response){
        //Notificación de success
        swal({
          title: "Registro exitoso",
          html: "<label>Se insertó correctamente la dependencia con los siguientes datos</label><br><br><label><b>Nombre:</b></label> "
          + self.nueva_dependencia.Nombre+"<br><label><b>Télefono:</b></label> " + self.nueva_dependencia.Telefono +
          "<br><label><b>Correo electrónico:</b></label>" + self.nueva_dependencia.Correo,
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#449D44",
          cancelButtonColor: "#2c6bc9",
          confirmButtonText: "Registrar nueva dependencia",
          cancelButtonText: "Consultar dependencia",
        }).then(function() {
            //Si da click lo redirije a crear nueva dependencia
            $window.location.reload();
          },
          function(dismiss) {
            if (dismiss === 'cancel') {
                //Si da click lo redirije a consultar dependencia
              $window.location.href = '#/consultar_dependencia';
            }
          })
      });
  };
  });
