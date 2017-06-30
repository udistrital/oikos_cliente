'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearSedeCtrl
 * @description
 * # CrearSedeCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearSedeCtrl', function(oikosRequest, $window) {
    //Se utiliza la variable self estandarizada
    var self = this;
    //Se crea JSON para la nueva_sede
    self.nueva_sede = {};
    self.nueva_sede.TipoEspacio = {
      Id: 1
    };

    //Creación tabla que carga edificios
    self.gridOptions_edificios = {
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

    /*self.gridOptions_edificios.onRegisterApi = function(gridApi) {
         //set gridApi on scope
         self.gridApi = gridApi;
         gridApi.selection.on.rowSelectionChanged($scope, function(row) {
           $scope.rubrosobj = self.gridApi.selection.getSelectedRows();
           console.log($scope.rubrosobj);
         });*/

    //Función obtener los edificios
    oikosRequest.get('espacio_fisico/EspaciosHuerfanos/2', $.param({
        limit: 0
      })).then(function(response) {
        self.gridOptions_edificios.data = response.data;
      });

    //Función para crear la sede
    self.crear_sede = function(form) {

      //Convertir a mayusculas
      self.nueva_sede.Nombre = self.nueva_sede.Nombre.toUpperCase();
      self.nueva_sede.Codigo = self.nueva_sede.Codigo.toUpperCase();

      //Petición POST
      oikosRequest.post("espacio_fisico", self.nueva_sede).then(function(response) {

        console.log(response);
        //Notificación de success
        swal({
          title: "Registro exitoso",
          html: "<label>Se insertó correctamente la sede con los siguientes datos</label><br><br><label><b>Nombre:</b></label> " +
            self.nueva_sede.Nombre + "<br><label><b>Código:</b></label> " + self.nueva_sede.Codigo,
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#449D44",
          cancelButtonColor: "#2c6bc9",
          confirmButtonText: "Registrar nueva sede",
          cancelButtonText: "Consultar sede",
        }).then(function() {
            //Si da click lo redirije a crear nueva dependencia
            $window.location.reload();
          },
          function(dismiss) {
            //Si da click lo redirije a consultar sede
            if (dismiss === 'cancel') {
              /*Función para limpiar todos los campos del formulario con el botón "Cancelar"*/
              $window.location.href = '#/consultar_sede';
            }
          })
      });
    };
  });
