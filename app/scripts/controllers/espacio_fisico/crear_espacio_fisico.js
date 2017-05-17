'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearEspacioFisicoCtrl
 * @description
 * # CrearEspacioFisicoCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearEspacioFisicoCtrl', function(oikosRequest, $window) {
    //Se utiliza la variable self estandarizada
    var self = this;
    //Se crea JSON para la nuevo_espacio_fisico
    self.nuevo_espacio = {};

    //JSON que contiene los tipos de espacio_fisico
    self.tipo_espacio = {};

    //Variable que sirve de filtro
    self.filtro = {};

    //Creación tabla que carga espacios_fisicos
    self.gridOptions_espacios_fisicos = {
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableSelectAll: true,
      columnDefs: [{
          field: 'Nombre'
        },
        {
          field: 'Codigo'
        }
      ],
    };

    //Función que obtiene todas los tipos de espacio
    oikosRequest.get('tipo_espacio_fisico', $.param({
        limit: 0,
        offset: 3
      }))
      .then(function(response) {
        self.tipo_espacio = response.data;
      });

      //Función que carga de acuerdo al ID del tipo_espacio
      self.cargar_tipo = function(){
        //Función que obtiene todas las espacio_fisicos
        oikosRequest.get('espacio_fisico', $.param({
            query: "TipoEspacio:" + self.filtro.Id + "",
            limit: 0
          }))
          .then(function(response) {
            console.log(self.filtro);
            self.gridOptions_espacios_fisicos.data = response.data;
          });
      }


    //Función para crear un espacio fisico
    self.crear_espacio_fisico = function(form) {

      console.log(self.nuevo_espacio_fisico);

      //Convertir a mayusculas
      self.nuevo_espacio.Nombre = self.nuevo_espacio.Nombre.toUpperCase();
      self.nuevo_espacio.Codigo = self.nuevo_espacio.Codigo.toUpperCase();

      //Petición POST
      oikosRequest.post("espacio_fisico", self.nuevo_espacio_fisico).then(function(response) {
        //Notificación de success
        swal({
          title: "Registro exitoso",
          html: "<label>Se insertó correctamente el espacio físico con los siguientes datos</label><br><br><label><b>Tipo Espacio:</b></label> " +
            self.nuevo_espacio.TipoEspacio.Nombre + "<br><label><b>Nombre:</b></label> " + self.nuevo_espacio.Nombre +
            "<br><label><b>Código:</b></label> " + self.nuevo_espacio.Codigo,
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#449D44",
          cancelButtonColor: "#2c6bc9",
          confirmButtonText: "Registrar nuevo espacio físico",
          cancelButtonText: "Consultar espacio físico",
        }).then(function() {
            //Si da click lo redirije a crear nuevo edificio
            $window.location.reload();
          },
          function(dismiss) {
            //Si da click lo redirije a consultar edificio
            if (dismiss === 'cancel') {
              //Redirije a consultar el edificio
              $window.location.href = '#/consultar_espacio_fisico';
            }
          })
      });
    };
  });
