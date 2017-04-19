'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:ConsultarDependenciaCtrl
 * @description
 * # ConsultarDependenciaCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('ConsultarDependenciaCtrl', function () {
    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Creación tabla
    $scope.gridOptions1 = {
      enableSorting: true,
      enableFiltering: true,
      resizable: true,
      columnDefs: [
        {
          field: 'Nombre',
          cellTemplate: tmpl
        },
        {
          field: 'Descripcion',
          cellTemplate: tmpl,
          displayName: 'Teléfono'
        },
        {
          field: 'Correo',
          cellTemplate: tmpl,
          displayName: 'Correo Electrónico'
        },
        {
          field: 'Acciones',
          cellTemplate: '<button class="btn btn-danger btn-circle" ng-click="grid.appScope.deleteRow(row)"><i class="glyphicon glyphicon-trash"></i></button>&nbsp;<button type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.actualizar(row)"><i class="glyphicon glyphicon-pencil"></i></button>'
        }
      ]
    };

    //Función que obtiene todas las dependenciaes
    oikosRequest.get('dependencia', $.param({
        limit: 0
      }))
      .then(function(response) {
        $scope.gridOptions1.data = response.data;
      });

    //Función para actualizar la información de una aplicación
    $scope.actualizar = function(row) {
      //El index indica la posición en la grilla
      var index = $scope.gridOptions1.data.indexOf(row.entity);
      //Permite que la fila del index, sea editable
      $scope.gridOptions1.data[index].editable = !$scope.gridOptions1.data[index].editable;

      console.log("Entro a editar");

      var jsonActualizado = row.entity;
      oikosRequest.put('dependencia', $scope.gridOptions1.Id, jsonActualizado)
        .then(function(response) {
          $scope.ServerResponse = response.data;
        })

    };

    //Función para borrar un registro de la tabla dependencia
    $scope.deleteRow = function(row) {
      var index = $scope.gridOptions1.data.indexOf(row.entity);

      //Borra la aplicación de la BD
      oikosRequest.delete('dependencia', row.entity.Id)
        .then(function(response) {
          //Condicional
          if (response.data === "OK") {
            alert("La dependencia se ha borrado exitosamente");
            //Función que obtiene todas las dependencias
            oikosRequest.get('dependencia', $.param({
                limit: 0
              }))
              .then(function(response) {
                $scope.gridOptions1.data = response.data;
              });
          } else {
            alert("No se puede borrar la dependencia");
          }
        });
    };


    /*Función para limpiar todos los campos del formulario con el botón "Cancelar"*/
    $scope.reset = function(form) {
      $scope.dependencia = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();

      }
    };
  });
