'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:ConsultarEdificioCtrl
 * @description
 * # ConsultarEdificioCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('ConsultarEdificioCtrl', function(oikosRequest, uiGridConstants) {
    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Se utiliza la variable self estandarizada
    var self = this;

    //Creación tabla
    self.gridOptions1 = {
      enableSorting: true,
      enableFiltering: true,
      resizable: true,
      columnDefs: [{
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
          displayName: 'Código',
          width: "10%"
        },
        {
          field: 'Estado',
          width: "15%",
          enableCellEdit: false

        },
        {
          field: 'Acciones',
          width: "15%",
          cellTemplate: '<button title="Inactivar" class="btn btn-danger btn-circle" ng-click="grid.appScope.consultarSede.inactivarSede(row)">' +
          '<i class="fa fa-times"></i></button>&nbsp;' +
          '<button title="Editar" type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.consultarSede.actualizar(row)">' +
          '<i class="glyphicon glyphicon-pencil"></i></button>'

          /*Para incluir funcionalidad de nuevos botnos y hacer llamado de modal
          '<center>' +
            '<a class="ver" ng-click="grid.appScope.d_opListarTodas.op_detalle(row,\'ver\')" >' +
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title=""></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.TiposAvance.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '<a class="borrar" ng-click="grid.appScope.TiposAvance.load_row(row,\'delete\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="" class="fa fa-trash fa-lg" aria-hidden="true"></i></a>' +
            '</center>',*/
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
    self.inactivarSede = function(row) {
      var index = self.gridOptions1.data.indexOf(row.entity);
      //Alerta de cambiar el estado
      swal({
        title: 'Esta seguro de inactivar el edificio?',
        text: "No puedes revertir esta opción!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, inactivar edificio!',
        cancelButtonText: 'No, cancelar!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).then(function() {
          //Variable que cambia el estado
          row.entity.Estado = 'Inactivo';
          //Inactiva la sede de la BD
          oikosRequest.put('espacio_fisico', row.entity.Id, row.entity)
            .then(function(response) {
              //Alerta
              swal(
                'Inactivado!',
                'El edificio ha sido inactivada exitosamente.',
                'success'
              )
            });
      }, function(dismiss) {
        //Evento al presionar el boton cancelar
        if (dismiss === 'cancel') {
          swal(
            'Cancelado',
            'La sede mantiene su estado "Activo"',
            'error'
          )
        }
      })

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
