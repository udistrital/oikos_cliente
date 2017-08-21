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

    //Variable que contiene el tipo de dependencia
    self.tipo_dependencia = {};

    //Creación tabla
    self.gridOptions1 = {
      enableSorting: true,
      enableFiltering: true,
      resizable: true,
      columnDefs: [
        {
          field: 'DependenciaId.Nombre',
          cellTemplate: tmpl,
          displayName: 'Nombre dependencia',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          }
        },
        {
          field: 'DependenciaId.TelefonoDependencia',
          cellTemplate: tmpl,
          displayName: 'Teléfono'
        },
        {
          field: 'DependenciaId.CorreoElectronico',
          cellTemplate: tmpl,
          displayName: 'Correo Electrónico'
        },
        {
          field: 'Acciones',
          cellTemplate: '<button title="Editar" type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.consultarDependencia.abrir_modal_editar(row)" data-toggle="modal" data-target="#editarDependencia">' +
          '<i class="glyphicon glyphicon-pencil"></i></button>&nbsp;'
        }
      ]
    };

     //Función que obtiene todos las dependencia de acuerdo al tipo
     oikosRequest.get('tipo_dependencia', $.param({
        limit: -1
      }))
      .then(function(response) {
        self.tipo_dependencia = response.data;
      });

    //Función que carga de acuerdo al ID del tipo_espacio
    self.cargar_tipo = function(){
      //Función que obtiene los espacio_fisicos de acuerdo al tipo
      oikosRequest.get('dependencia_tipo_dependencia', $.param({
          query: "TipoDependenciaId:" + self.filtro.Id + "",
          limit: 0
        }))
        .then(function(response) {
          self.gridOptions1.data = response.data;
        });
    };

    //Funcion para abrir el modal
    self.abrir_modal_editar = function(row){
      self.dependencia = row.entity.DependenciaId;
      console.log(self.dependencia);
      document.getElementById("Nombre").value=self.dependencia.Nombre;
      document.getElementById("Telefono").value=self.dependencia.TelefonoDependencia;
      document.getElementById("Correo").value=self.dependencia.CorreoElectronico;
    };

    //Función para actualizar la información de una dependencia
   self.actualizar = function(row) {
    //Variables que se obtienen de los campos Nombre y Teléfono
    var NombreMin = document.getElementById("Nombre").value.toUpperCase();
    var TelefonoMin = document.getElementById("Telefono").value.toUpperCase();
    var CorreoMin = document.getElementById("Correo").value.toUpperCase();

    //Información actualizada
    var jsonActualizado ={
      Nombre : NombreMin,
      TelefonoDependencia : TelefonoMin,
      CorreoElectronico : CorreoMin
    };

    //Alerta de cambiar el estado
    swal({
      title: 'Esta seguro que quiere editar la dependencia ' + self.dependencia.Nombre + '?',
      text : "OK!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, editar dependencia!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
    }).then(function() {
      //Petición que actualiza la información
      oikosRequest.put('dependencia', self.dependencia.Id, jsonActualizado)
        .then(function(response) {
          //Respuesta de la petición
          self.ServerResponse = response.data;
          //SweetAlert
          swal({
            title:'Editado!',
            text: 'La dependencia ha sido editada exitosamente.',
            type:'success',
            confirmButtonColor: '#3085d6',
            confirmButtonClass: 'btn btn-success',
        }).then(function(){
          $('#editarDependencia').modal('toggle');
          //Función que obtiene todas las dependencias de acuerdo al tipo
          oikosRequest.get('dependencia_tipo_dependencia', $.param({
            query: "TipoDependenciaId:" + self.filtro.Id,
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
