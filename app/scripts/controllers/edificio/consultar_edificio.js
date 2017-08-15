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
    self.edificio= "";
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
          cellTemplate: '<button title="Activar/Inactivar" class="btn btn-danger btn-circle" ng-click="grid.appScope.consultarEdificio.cambiarEstado(row)">' +
            '<i class="fa fa-exchange"></i></button>&nbsp;' +
            '<button title="Editar" type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.consultarEdificio.abrir_modal_editar(row)" data-toggle="modal" data-target="#editarEdificio">' +
            '<i class="glyphicon glyphicon-pencil"></i></button>&nbsp;' + '<button title="Gestionar espacios físicos" type="button" class="btn btn-primary btn-circle"' +
            'ng-click="grid.appScope.visualizar(row);grid.appScope.showAdvanced($event, row)" data-toggle="modal" data-target="#exampleModalLong""><i class="glyphicon glyphicon-eye-open"></i></button>'

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

        //Funcion para abrir el modal
        self.abrir_modal_editar = function(row){          
           //Variable que contiene la sede que va a gestionar los edificios
           self.edificio = row.entity;
            document.getElementById("Nombre").value=self.edificio.Nombre;
            document.getElementById("Codigo").value=self.edificio.Codigo;
            document.getElementById("Estado").value=self.edificio.Estado;
        }

    //Función que obtiene todas las espacio_fisicoes
    oikosRequest.get('espacio_fisico', $.param({
        query: "TipoEspacio:2",
        limit: 0
      }))
      .then(function(response) {
        self.gridOptions1.data = response.data;
      });

      self.actualizar = function() {
        //El index indica la posición en la grilla        
        //Contiene el nombre de la sede
        var jsonActualizado ={
          Nombre : document.getElementById("Nombre").value.toUpperCase(),
          Codigo : document.getElementById("Codigo").value.toUpperCase(),
          Estado : document.getElementById("Estado").value.toUpperCase(),
          TipoEspacio:{Id : 2}
        };
  
        //Alerta de cambiar el estado
        swal({
          title: 'Esta seguro que quiere editar el edificio ' + jsonActualizado.Nombre + '?',
          text : "OK!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, editar edificio!',
          cancelButtonText: 'No, cancelar!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
        }).then(function() {
          //JSON que contiene la información nueva del registro
  
          //Petición que actualiza la información
          oikosRequest.put('espacio_fisico', self.edificio.Id, jsonActualizado)
            .then(function(response) {
              //Respuesta de la petición
              self.ServerResponse = response.data;
              //SweetAlert
              swal({
                title:'Editado!',
                text: 'El edificio ha sido editada exitosamente.', 
                type:'success',
                confirmButtonColor: '#3085d6',
                confirmButtonClass: 'btn btn-success',
            }).then(function(){
              $('#editarEdificio').modal('toggle');
                  //Función que obtiene todas las espacio_fisicoes
            oikosRequest.get('espacio_fisico', $.param({
              query: "TipoEspacio:2",
              limit: 0
            }))
            .then(function(response) {
              self.gridOptions1.data = response.data;
            });

            })
  
            })
        }, function(dismiss) {
          // dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
          if (dismiss === 'cancel') {
            swal('Cancelado', 'Se cancelo la acción', 'error')
          }
        })
  
      };

    //Función para borrar un registro de la tabla
    self.cambiarEstado = function(row) {
      //Indica la posición de la fila
      var index = self.gridOptions1.data.indexOf(row.entity);
      //Variable que tiene el nombre del edificio
      var nombre = row.entity.Nombre;
      //Variable que tiene el estado  del edificio
      var estado = row.entity.Estado;

      //Condicional que permite cambiar el estado
      if (estado == 'Inactivo') {

        //Alerta de cambiar el estado
        swal({
          title: 'Esta seguro que quiere cambiar el estado del edificio ' + nombre + '?',
          text: "Esta acción puede generar cambios",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, activar edificio!',
          cancelButtonText: 'No, cancelar!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
        }).then(function() {

          //Variable que cambia el estado
          row.entity.Estado = 'Activo';
          //Inactiva la sede de la BD
          oikosRequest.put('espacio_fisico', row.entity.Id, row.entity)
            .then(function(response) {
              //SweetAlert
              swal('Activado!', 'El edificio ha sido activado exitosamente.', 'success')
            });
        }, function(dismiss) {
          // dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
          if (dismiss === 'cancel') {
            swal('Cancelado', 'Se cancelo la acción', 'error')
          }
        })
      } else if (estado == 'Activo') {
        //Alerta de cambiar el estado
        swal({
          title: 'Esta seguro que quiere cambiar el estado del edificio ' + nombre + '?',
          text: "Se borraran las relaciones de los espacios físicos asociados a este edificio!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, inactivar edificio!',
          cancelButtonText: 'No, cancelar!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
        }).then(function() {

          //Variable que cambia el estado
          row.entity.Estado = 'Inactivo';
          //Inactiva la sede de la BD
          oikosRequest.put('espacio_fisico', row.entity.Id, row.entity)
            .then(function(response) {
              //SweetAlert
              swal('Inactivado!', 'El edificio ha sido inactivado exitosamente.', 'success')
            });
        }, function(dismiss) {
          // dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
          if (dismiss === 'cancel') {
            swal('Cancelado', 'Se cancelo la acción', 'error')
          }
        })
      }
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
