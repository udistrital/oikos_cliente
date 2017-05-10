'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:ConsultarDependenciaCtrl
 * @description
 * # ConsultarDependenciaCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('ConsultarDependenciaCtrl', function (oikosRequest, uiGridConstants) {
    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Se utiliza la variable self estandarizada
    var self=this;

    //Creación tabla
    self.gridOptions1 = {
      enableSorting: true,
      enableFiltering: true,
      resizable: true,
      columnDefs: [
        {
          field: 'Nombre',
          cellTemplate: tmpl,
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          }
        },
        {
          field: 'TelefonoDependencia',
          cellTemplate: tmpl,
          displayName: 'Teléfono'
        },
        {
          field: 'CorreoElectronico',
          cellTemplate: tmpl,
          displayName: 'Correo Electrónico'
        },
        {
          field: 'Acciones',
          cellTemplate: '<button title="Inactivar" class="btn btn-danger btn-circle" ng-click="grid.appScope.consultarDependencia.deleteRow(row)"><i class="fa fa-times"></i></button>&nbsp;<button title="Editar" type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.consultarDependencia.actualizar(row)"><i class="glyphicon glyphicon-pencil"></i></button>'
        }
      ]
    };

    //Función que obtiene todas las dependenciaes
    oikosRequest.get('dependencia', $.param({
        limit: 0
      }))
      .then(function(response) {
        self.gridOptions1.data = response.data;
      });

    //Función para actualizar la información de una aplicación
    self.actualizar = function(row) {
      //El index indica la posición en la grilla
      var index = self.gridOptions1.data.indexOf(row.entity);
      //Permite que la fila del index, sea editable
      self.gridOptions1.data[index].editable = !self.gridOptions1.data[index].editable;

      console.log("Entro a editar");

      var jsonActualizado = row.entity;
      oikosRequest.put('dependencia', self.gridOptions1.Id, jsonActualizado)
        .then(function(response) {
          self.ServerResponse = response.data;
        })

    };

    //Función para borrar un registro de la tabla dependencia
    self.deleteRow = function(row) {
      var index = self.gridOptions1.data.indexOf(row.entity);

      //Borra la dependencia de la BD
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
                self.gridOptions1.data = response.data;
              });
          } else {
            alert("No se puede borrar la dependencia");
          }
        });
    };


    /*Función para limpiar todos los campos del formulario con el botón "Cancelar"*/
    self.reset = function(form) {
      self.dependencia = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();

      }
    };
  });
