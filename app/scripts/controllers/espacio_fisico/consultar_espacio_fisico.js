'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:ConsultarEspacioFisicoCtrl
 * @description
 * # ConsultarEspacioFisicoCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
.controller('ConsultarEspacioFisicoCtrl', function(oikosRequest, uiGridConstants, $mdDialog, $window) {
  //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
  var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

  //Se utiliza la variable self estandarizada
  var self = this;

  //Variable que sirve de filtro para la tabla
  //self.filtro = {};

  //Variable que contiene todos los tipos de espacios físicos
  self.tipo_espacio = {};

  //Función que obtiene todas los tipos de espacio
  oikosRequest.get('tipo_espacio_fisico', $.param({
      limit: 0,
      offset: 2
    }))
    .then(function(response) {
      self.tipo_espacio = response.data;
    });

  //Creación tabla que contiene los espacios físicos
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
        cellTemplate: '<button title="Activar/Inactivar" class="btn btn-danger btn-circle" ng-click="grid.appScope.consultarEspacioFisico.cambiarEstado(row)">' +
        '<i class="fa fa-exchange"></i></button>&nbsp;' +  '<button title="Editar" type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.consultarEspacioFisico.abrir_modal_editar(row)" data-toggle="modal" data-target="#editarEspacioFisico">' +
        '<i class="glyphicon glyphicon-pencil"></i></button>&nbsp;'
      }

    ]
  };

  //Funcion para abrir el modal
  self.abrir_modal_editar = function(row){
    self.sede = row.entity;
    document.getElementById("Nombre").value=self.sede.Nombre;
    document.getElementById("Codigo").value=self.sede.Codigo;
    document.getElementById("Estado").value=self.sede.Estado;
  };

  //Función que carga de acuerdo al ID del tipo_espacio
  self.cargar_tipo = function(){
    //Función que obtiene los espacio_fisicos de acuerdo al tipo
    oikosRequest.get('espacio_fisico', $.param({
        query: "TipoEspacio:" + self.filtro.Id + "",
        limit: 0
      }))
      .then(function(response) {
        self.gridOptions1.data = response.data;
      });
  };

   //Función para actualizar la información de una aplicación
   self.actualizar = function(row) {
      //Variables que se obtienen de los campos Nombre y Código
      var NombreMin = document.getElementById("Nombre").value.toUpperCase();
      var CodigoMin = document.getElementById("Codigo").value.toUpperCase();

      //Información actualizada
      var jsonActualizado ={
        Nombre : NombreMin,
        Codigo : CodigoMin,
        Estado : document.getElementById("Estado").value,
        TipoEspacio:{Id : self.filtro.Id}
      };

      //Alerta de cambiar el estado
      swal({
        title: 'Esta seguro que quiere editar espacio físico ' + self.sede.Nombre + '?',
        text : "OK!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, editar espacio físico!',
        cancelButtonText: 'No, cancelar!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
      }).then(function() {
        //Petición que actualiza la información
        oikosRequest.put('espacio_fisico', self.sede.Id, jsonActualizado)
          .then(function(response) {
            //Respuesta de la petición
            self.ServerResponse = response.data;
            //SweetAlert
            swal({
              title:'Editado!',
              text: 'El espacio físico ha sido editado exitosamente.',
              type:'success',
              confirmButtonColor: '#3085d6',
              confirmButtonClass: 'btn btn-success',
          }).then(function(){
            $('#editarEspacioFisico').modal('toggle');
            //Función que obtiene todos las espacio_fisicos
            oikosRequest.get('espacio_fisico', $.param({
              query: "TipoEspacio:" + self.filtro.Id,
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

       //Función para cambiar el estado de un espacio físico 
    self.cambiarEstado = function(row) {
      //Indica la posición de la fila
      var index = self.gridOptions1.data.indexOf(row.entity);
      //Variable que tiene el nombre del espacio físico
      var nombre = row.entity.Nombre;
      //Variable que tiene el estado del espacio físico
      var estado = row.entity.Estado;
      //Variable que tiene el Id del espacio físico
      var id = row.entity.Id;

      //Condicional que permite cambiar el estado
      if (estado == 'Inactivo') {

        //Alerta de cambiar el estado
        swal({
          title: 'Esta seguro que quiere cambiar el estado del espacio físico ' + nombre + '?',
          text: "No puedes revertir esta opción!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, activar espacio físico!',
          cancelButtonText: 'No, cancelar!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
        }).then(function() {

          //Variable que cambia el estado
          row.entity.Estado = 'Activo';
          //Activa es espacio físico de la BD
          oikosRequest.put('espacio_fisico', row.entity.Id, row.entity)
            .then(function(response) {
              //SweetAlert
              swal('Activado!', 'El espacio físico ha sido activado exitosamente.', 'success')
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
          title: 'Esta seguro que quiere inactivar el espacio físico ' + nombre + '?',
          text: "No puedes revertir esta opción!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, inactivar espacio físico!',
          cancelButtonText: 'No, cancelar!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
        }).then(function() {

          //Función obtener los edificios relacionados a la sede
          oikosRequest.get('espacio_fisico_padre', $.param({
            query: 'Hijo:' + id,
            limit: 0
          })).then(function(response) {
            //Variable que tiene el Id de la relaciÓn a borrar
            for (var i = 0; i < response.data.length; i++) {
              //Variable que guarda el Id de la relación encontrada
              self.relacionId = response.data[i].Id;

              //Petición para borrar las relaciones
              oikosRequest.delete('espacio_fisico_padre', self.relacionId)
                .then(function(response) {
                  if (response.data === 'OK') {
                    console.log("La relación con id " + self.relacionId + " se ha borrado exitosamente");
                  } else {
                    console.log("No se púdo borrar");
                  }
                })
            }
          });


          //Variable que cambia el estado
          row.entity.Estado = 'Inactivo';
          //Inactiva el espacio físico de la BD
          oikosRequest.put('espacio_fisico', row.entity.Id, row.entity)
            .then(function(response) {
              //SweetAlert
              swal('Inactivado!', 'El espacio físico ha sido inactivado exitosamente.', 'success')
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
