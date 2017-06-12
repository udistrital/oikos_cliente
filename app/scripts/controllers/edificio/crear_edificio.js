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

    //JSON que contiene los tipos de espacio_fisico
    self.tipo_espacio = {};

    //Variable que sirve de filtro
    self.filtro = {};

    //Se crea JSON para el nuevo_edificio
    self.nuevo_edificio = {};
    self.nuevo_edificio.TipoEspacio = {
      Id: 2
    };

    //Creación tabla que carga espacios físicos
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

    //Función que obtiene todas los tipos de espacio
    oikosRequest.get('tipo_espacio_fisico', $.param({
        limit: 0,
        offset: 2
      }))
      .then(function(response) {
        self.tipo_espacio = response.data;
      });

      //Función que carga de acuerdo al ID del tipo_espacio
      self.cargar_tipo = function(){
        //Función que obtiene todas las espacio_fisicos
        oikosRequest.get('espacio_fisico/EspaciosHuerfanos/'+ self.filtro.Id + '', $.param({
            limit: 0
          }))
          .then(function(response) {
            console.log(response);
            //Condicional si la petición arroja NULL
            if (response.data === null) {
              console.log("Entro 1")
              self.gridOptions_espacios_fisicos.data = [];
              //swal('No se encontraron espacios físicos huerfanos relacionados')

            }else{
              //Si la petición arroja información la muestra
              self.gridOptions_espacios_fisicos.data = response.data;
              console.log("Entro 2")
            }

          });
      }


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
