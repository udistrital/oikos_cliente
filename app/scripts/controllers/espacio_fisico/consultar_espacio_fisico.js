'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:ConsultarEspacioFisicoCtrl
 * @description
 * # ConsultarEspacioFisicoCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('ConsultarEspacioFisicoCtrl', function () {
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
          field: 'Codigo',
          cellTemplate: tmpl,
          displayName: 'Código'
        },
        {
          field: 'Estado',
          cellTemplate: tmpl
        },
        {
          field: 'Acciones',
          cellTemplate: '<button title="Inactivar" class="btn btn-danger btn-circle" ng-click="grid.appScope.consultarEspacioFisico.deleteRow(row)"><i class="fa fa-times"></i></button>&nbsp;<button title="Editar" type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.consultarEspacioFisico.actualizar(row)"><i class="glyphicon glyphicon-pencil"></i></button>'
        }
      ]
    };

    //Función que obtiene todas las espacio_fisicoes
    oikosRequest.get('espacio_fisico', $.param({
        query: "TipoEspacio:2",
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
      oikosRequest.put('espacio_fisico', self.gridOptions1.Id, jsonActualizado)
        .then(function(response) {
          self.ServerResponse = response.data;
        })

    };

    //Función para borrar un registro de la tabla
    self.deleteRow = function(row) {
      var index = self.gridOptions1.data.indexOf(row.entity);

      //Borra la aplicación de la BD
      oikosRequest.update('espacio_fisico', row.entity.Id)
        .then(function(response) {
          //Condicional
          if (response.data === "OK") {
            //self.gridOptions1.data.splice(index, 1); Sirve para hacer el borrado desde la vista
            alert("El espacio físico se ha inactivado exitosamente");
            //Función que obtiene todas las sedes
            oikosRequest.get('espacio_fisico', $.param({
                limit: 0
              }))
              .then(function(response) {
                self.gridOptions1.data = response.data;
              });
          } else {
            alert("No se puede borrar la sede");
          }
        });
    };


    /*Función para limpiar todos los campos del formulario con el botón "Cancelar"*/
    self.reset = function(form) {
      self.perfil = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();

      }
  };
  });
