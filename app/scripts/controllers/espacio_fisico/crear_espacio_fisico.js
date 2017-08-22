'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearEspacioFisicoCtrl
 * @description
 * # CrearEspacioFisicoCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearEspacioFisicoCtrl', function (oikosRequest, $window, $scope) {
    //Se utiliza la variable self estandarizada
    var self = this;
    //Se crea JSON para la nuevo_espacio_fisico
    self.nuevo_espacio = {};

    //JSON que contiene las sedes
    self.sedes = {};

    //Variable que contiene la info de la sede seleccionada
    //self.filtroSede = {};

    //Variable que contiene los tipos de espacios físicos
    self.tipo_espacio = {};

    //Variable que contiene los tipos uso del espacio físico
    self.uso = {};

    //Variable que contiene el uso del espacio físico
    self.seleccion_uso = {};

    //Variable que contiene el edificio seleccionado
    self.EdificioSeleccionado = {};


    //Creación tabla que carga los edificios
    self.gridOptions_edificios = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableSelectAll: false,
      multiSelect: false,
      columnDefs: [{
          field: 'Hijo.Nombre',
          displayName: 'Nombre'
        },
        {
          field: 'Hijo.Codigo',
          displayName: 'Código'
        }
      ],
    };

    //Función que obtiene todas los tipo de uso
    oikosRequest.get('tipo_uso', $.param({
      limit: 0,
    })).then(function (response) {
      self.uso = response.data;
    });

    //Función que obtiene todas los tipos de espacio
    oikosRequest.get('tipo_espacio_fisico', $.param({
      limit: 0,
      offset: 1
    })).then(function (response) {
      self.tipo_espacio = response.data;
    });

    //Función que obtiene todas las sedes
    oikosRequest.get('espacio_fisico', $.param({
        query: "TipoEspacio:1",
        limit: 0,
      }))
      .then(function (response) {
        self.sedes = response.data;
      });

    //Función que carga los edificios de acuerdo al ID de la sede
    self.cargar_edificios = function () {
      if (self.filtroSede !== null) {
        oikosRequest.get('espacio_fisico_padre', $.param({
            query: "Padre:" + self.filtroSede.Id + "",
            limit: 0
          }))
          .then(function (response) {
            if (response.data !== null) {
              self.gridOptions_edificios.data = response.data;
            } else {
              self.gridOptions_edificios.data = [];
            }
          });
      } else {
        self.gridOptions_edificios.data = [];
      }
    };


    ///Función que captura los valores seleccionados por el check
    self.gridOptions_edificios.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        //Se setea el tipo de espacio correspondiente a la sede
        row.entity.TipoEspacio = {
          Id: 1
        };
        self.EdificioSeleccionado = row.entity;
        console.log(self.EdificioSeleccionado);
      });
    };


    //Función para crear un espacio fisico
    self.crear_espacio_fisico = function (form) {

      console.log(self.nuevo_espacio);

      //Convertir a mayusculas
      self.nuevo_espacio.Nombre = self.nuevo_espacio.Nombre.toUpperCase();
      self.nuevo_espacio.Codigo = self.nuevo_espacio.Codigo.toUpperCase();

      //Petición POST
      oikosRequest.post("espacio_fisico", self.nuevo_espacio).then(function (response) {
        //Obtiene el id del response y lo asigna al nuevo espacio físico
        self.nuevo_espacio.Id = response.data.Id;
        self.seleccion_uso.EspacioFisicoId = self.nuevo_espacio;

        console.log(self.seleccion_uso);


        //Condicional de validación
        if (response.status == 201) {

          //Se realiza la petición POST, para guardar el edificio asociado a la sede
          oikosRequest.post('espacio_fisico_padre', {
            "Padre": self.EdificioSeleccionado,
            "Hijo": self.nuevo_espacio
          }).then(function (response) {
            if (response.status == 201) {
              console.log("Se ha realizado la transacción en la tabla espacio físico padre de forma exitosa");
            } else {
              //Se visualiza cuando no se pudo insertar en la BD
              swal(
                'Rechazada!',
                'Su transacción ha sido rechazada porque se produjo un error a nivel de base de datos al relacionar el espacio físico con el edificio',
                'error'
              )
            }

          });

          //Se realiza la petición POST, para guardar el tipo uso asociado al espacio físico
          oikosRequest.post('tipo_uso_espacio_fisico', self.seleccion_uso)
          .then(function (response) {
            if (response.status == 201) {
              console.log("Se ha realizado la transacción en la tabla tipo uso espacio físico de forma exitosa");
            } else {
              //Se visualiza cuando no se pudo insertar en la BD
              swal(
                'Rechazada!',
                'Su transacción ha sido rechazada porque se produjo un error a nivel de base de datos al relacionar el tipo uso con espacio físico',
                'error'
              )
            }

          });


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
          }).then(function () {
              //Si da click lo redirije a crear nuevo edificio
              $window.location.reload();
            },
            function (dismiss) {
              //Si da click lo redirije a consultar edificio
              if (dismiss === 'cancel') {
                //Redirije a consultar el edificio
                $window.location.href = '#/consultar_espacio_fisico';
              }
            })
        } else {
          //Se visualiza cuando no se pudo insertar en la BD
          swal(
            'Rechazada!',
            'Su transacción ha sido rechazada porque se produjo un error a nivel de base de datos',
            'error'
          )
        }
      });
    };
  });