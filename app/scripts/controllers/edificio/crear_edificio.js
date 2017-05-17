'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearEdificioCtrl
 * @description
 * # CrearEdificioCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearEdificioCtrl', function(oikosRequest, $window) {

    //Se utiliza la variable self estandarizada
    var self = this;

    //Se crea JSON para el nuevo_edificio
    self.nuevo_edificio = {};
    self.nuevo_edificio.TipoEspacio = {
      Id: 2
    };

    //Creación tabla que carga edificios
    self.gridOptions_espacios_fisicos = {
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableSelectAll: true,
      columnDefs: [{
          field: 'Nombre'
        },
        {
          field: 'Codigo',
          displayName: 'Código'
        }
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
    self.crear_edificio = function(form) {
      console.log(self.nuevo_edificio);

      //Convertir a mayusculas
      self.nuevo_edificio.Nombre = self.nuevo_edificio.Nombre.toUpperCase();
      self.nuevo_edificio.Codigo = self.nuevo_edificio.Codigo.toUpperCase();

      //Petición POST
      oikosRequest.post("espacio_fisico", self.nuevo_edificio).then(function(response) {
        //Notificación de success
        swal({
          title: "Registro exitoso",
          html: "<label>Se insertó correctamente el edificio con los siguientes datos</label><br><br><label><b>Nombre:</b></label> " +
            self.nuevo_edificio.Nombre + "<br><label><b>Código:</b></label> " + self.nuevo_edificio.Codigo,
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#449D44",
          cancelButtonColor: "#2c6bc9",
          confirmButtonText: "Registrar nuevo edificio",
          cancelButtonText: "Consultar edificio",
        }).then(function() {
            //Si da click lo redirije a crear nuevo edificio
            $window.location.reload();
          },
          function(dismiss) {
            //Si da click lo redirije a consultar edificio
            if (dismiss === 'cancel') {
              //Redirije a consultar el edificio
              $window.location.href = '#/consultar_edificio';
            }
          })
      });
    };

  });
