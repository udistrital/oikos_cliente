'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearEdificioCtrl
 * @description
 * # CrearEdificioCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearEdificioCtrl', function(oikosRequest, $window, $scope) {

    //Se utiliza la variable self estandarizada
    var self = this;

    //JSON que contiene los tipos de espacio_fisico
    self.tipo_espacio = {};

    //Variable que sirve de filtro
    self.filtro = {};

    //Variable que contiene la sede seleccionada
    self.sedeSeleccionada = {};

    //Se crea JSON para el nuevo_edificio
    self.nuevo_edificio = {};
    self.nuevo_edificio.TipoEspacio = {
      Id: 2
    };

    //Creación tabla que carga espacios físicos
    self.gridOptions_espacios_fisicos = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableSelectAll: false,
      multiSelect:false,
      columnDefs: [{
          field: 'Nombre'
        },
        {
          field: 'Codigo',
          displayName: 'Código'
        },
        {
          field: 'Estado',
          visible: false
        }
      ],
    };

    //Función que obtiene las sedes registradas
    oikosRequest.get('espacio_fisico/EspaciosHuerfanos/1', $.param({
      limit: 0
    })).then(function(response) {
      self.gridOptions_espacios_fisicos.data = response.data;
      }
    );

    ///Función que captura los valores seleccionados por el check
    self.gridOptions_espacios_fisicos.onRegisterApi = function(gridApi) {
         //set gridApi on scope
         $scope.gridApi = gridApi;
         gridApi.selection.on.rowSelectionChanged($scope, function(row) {
           //Se setea el tipo de espacio correspondiente a la sede
           row.entity.TipoEspacio = {
                 Id: 1
           };
           self.sedeSeleccionada = row.entity;
           console.log(self.sedeSeleccionada);
         });
    };

    //Función para crear el edificio
    self.crear_edificio = function(form) {

      //Convertir a mayusculas
      self.nuevo_edificio.Nombre = self.nuevo_edificio.Nombre.toUpperCase();
      self.nuevo_edificio.Codigo = self.nuevo_edificio.Codigo.toUpperCase();

      //Petición POST
      oikosRequest.post("espacio_fisico", self.nuevo_edificio).then(function(response) {
        //Obtiene el id del response y lo asigna a nueva sede
        self.nuevo_edificio.Id = response.data.Id;

        //Condicional de validación
        if (response.status == 201) {

          console.log(self.sedeSeleccionada);
          console.log(self.nuevo_edificio);
            //Se realiza la petición POST, para guardar el edificio asociado a la sede
            oikosRequest.post('espacio_fisico_padre', {
                "Padre": self.sedeSeleccionada,
                "Hijo": self.nuevo_edificio
              }
            )
              .then(function(response) {
                if(response.status == 201){
                  console.log("Se ha realizado la transacción en la tabla espacio físico padre de forma exitosa");
                }else{
                  //Se visualiza cuando no se pudo insertar en la BD
                  swal(
                    'Rechazada!',
                    'Su transacción ha sido rechazada porque se produjo un error a nivel de base de datos al relacionar el edificio con la sede',
                    'error'
                  )
                }

              });

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
          }else{
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
