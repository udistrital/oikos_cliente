'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:ConsultarSedeCtrl
 * @description
 * # ConsultarSedeCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('ConsultarSedeCtrl', function(oikosRequest, uiGridConstants, $scope, $mdDialog) {
    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Se utiliza la variable self estandarizada
    var self = this;

    self.sede = {};

    //Se crea
    $scope.treeOptions = {
      multiSelection: true,
      nodeChildren: "Opciones",
      dirSelectable: true,
      injectClasses: {
        ul: "a1",
        li: "a2",
        liSelected: "a7",
        iExpanded: "a3",
        iCollapsed: "a4",
        iLeaf: "a5",
        label: "a6",
        labelSelected: "a8"
      }
    };

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
          cellTemplate: '<button title="Activar/Inactivar" class="btn btn-danger btn-circle" ng-click="grid.appScope.consultarSede.cambiarEstado(row)">' +
            '<i class="fa fa-exchange"></i></button>&nbsp;' +
            '<button title="Editar" type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.consultarSede.actualizar(row)">' +
            '<i class="glyphicon glyphicon-pencil"></i></button>&nbsp;' + '<button title="Gestionar edificios" type="button" class="btn btn-primary btn-circle"' +
            'ng-click="grid.appScope.consultarSede.gestionar_edificios(row)" data-toggle="modal" data-target="#gestionarEdificios""><i class="glyphicon glyphicon-eye-open"></i></button>'
        }

      ]
    };

    //Función que obtiene todas las espacio_fisicoes
    oikosRequest.get('espacio_fisico', $.param({
        query: "TipoEspacio:1",
        limit: 0
      }))
      .then(function(response) {
        self.gridOptions1.data = response.data;
      });

    //Función para actualizar la información de una aplicación
    self.actualizar = function(row) {
      //El index indica la posición en la grilla
      var index = self.gridOptions1.data.indexOf(row.entity);
      //Contiene el nombre de la sede
      var nombre = row.entity.Nombre;

      //Alerta de cambiar el estado
      swal({
        title: 'Esta seguro que quiere editar la sede ' + nombre + '?',
        text: "OK!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, editar sede!',
        cancelButtonText: 'No, cancelar!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
      }).then(function() {
        //Permite que la fila del index, sea editable
        self.gridOptions1.data[index].editable = !self.gridOptions1.data[index].editable;
        //JSON que contiene la información nueva del registro
        var jsonActualizado = row.entity;
        //Petición que actualiza la información
        oikosRequest.put('espacio_fisico', self.gridOptions1.Id, jsonActualizado)
          .then(function(response) {
            //Respuesta de la petición
            self.ServerResponse = response.data;
            //SweetAlert
            swal('Editado!', 'La sede ha sido editada exitosamente.', 'success')
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
      //Variable que tiene el nombre de la Sede
      var nombre = row.entity.Nombre;
      //Variable que tiene el estado  de la Sede
      var estado = row.entity.Estado;
      //Variable que tiene el Id de la sede
      var id = row.entity.Id;

      //Condicional que permite cambiar el estado
      if (estado == 'Inactivo') {

        //Alerta de cambiar el estado
        swal({
          title: 'Esta seguro que quiere cambiar el estado de la sede ' + nombre + '?',
          text: "No puedes revertir esta opción!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, activar sede!',
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
              swal('Activada!', 'La sede ha sido activada exitosamente.', 'success')
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
          title: 'Esta seguro que quiere cambiar el estado de la sede ' + nombre + '?',
          text: "No puedes revertir esta opción!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, inactivar sede!',
          cancelButtonText: 'No, cancelar!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
        }).then(function() {

          //Función obtener los edificios relacionados a la sede
          oikosRequest.get('espacio_fisico_padre', $.param({
              query: 'Padre:' + id,
              limit: 0
            })).then(function(response) {
              //Variable que tiene el Id de la relaciÓn a borrar
              for(var i = 0; i < response.data.length; i++){
                //Variable que guarda el Id de la relación encontrada
                self.relacionId = response.data[i].Id;

                //Petición para borrar las relaciones
                oikosRequest.delete('espacio_fisico_padre', self.relacionId)
                .then(function(response) {
                  if(response.data === 'OK'){
                    console.log("La relación con id "+ self.relacionId + " se ha borrado exitosamente");
                  }else{
                    console.log("No se púdo borrar");
                  }
                })
              }
            });


          //Variable que cambia el estado
          row.entity.Estado = 'Inactivo';
          //Inactiva la sede de la BD
          oikosRequest.put('espacio_fisico', row.entity.Id, row.entity)
            .then(function(response) {
              //SweetAlert
              swal('Inactivada!', 'La sede ha sido inactivada exitosamente.', 'success')
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

    //Función que gestiona los edificios que tiene la sede
    self.gestionar_edificios = function(row) {
      //El index indica la posición en la grilla
      var index = self.gridOptions1.data.indexOf(row.entity);
      //Variable que contiene la sede que va a gestionar los edificios
      self.sede = row.entity;

      //Obtiene los edificios asociados a la sede
      oikosRequest.get('espacio_fisico_padre/', $.param({
          query: "Padre:" + self.sede.Id + "",
          limit: 0
        }))
        .then(function(response) {
          //Se asigna a esta variable la data cargada
          self.dataForTheTree = response.data;

          //Condicional que impide que al cargar una sede sin hijos quede con este valor
          if (self.dataForTheTree === null) {
            self.dataForTheTree = {};
          };

        })

        //Función obtener los edificios
        oikosRequest.get('espacio_fisico/EspaciosHuerfanos/2', $.param({
            limit: 0
          })).then(function(response) {
            //Variable que carga el árbol de los EspaciosHuerfanos
            self.huerfanos = response.data;
          });
      };


      //Función para vincular nuevos edificios
      self.guardar_nuevos = function() {

      //For para realizar el post a la tabla perfil_x_menu_opcion
      for (var i = 0; i < $scope.nuevos_edificios.length; i++) {
        //Se realiza la petición POST, para guardar los menús asociados al perfil
        console.log($scope.nuevos_edificios);
        oikosRequest.post('espacio_fisico_padre', {
            "Padre": self.sede,
            "Hijo": $scope.nuevos_edificios[i]
          })
          .then(function(response) {
            //Condicional
            if (response.data === 'pq: duplicate key value violates unique constraint "PK_ESPACIO_FISICO_PADRE"') {
              console.log($scope.nuevos_edificios[i]);
              //sweetalert2 que indica que el menú ya se encuentra agregado
              swal('El edificio <label><b>' + $scope.nuevos_edificios.Nombre + '</b></label> ya se encuentra asociado a la sede','Valide la información','error')
              //alert("El menú " + $scope.nombre_menu + "</b> ya se encuentra asociado al perfil");
            } else {
              //sweetalert2 que indica el nombre del menú que acabo de vincular
              swal('Correcto','Los edificios se han vinculado a la sede satisfactoriamente','success')
            }
          });
        }
              //Cargar los nuevos edificios asociados
              //Obtiene los menús asociados a ese perfil
              //Obtiene los edificios asociados a la sede
              oikosRequest.get('espacio_fisico_padre/', $.param({
                  query: "Padre:" + self.sede.Id + "",
                  limit: 0
                }))
                .then(function(response) {
                  //Se asigna a esta variable la data cargada
                  self.dataForTheTree = response.data;

                  //Condicional que impide que al cargar una sede sin hijos quede con este valor
                  if (self.dataForTheTree === null) {
                    self.dataForTheTree = {};
                  };

                })

                //Función obtener los edificios
                oikosRequest.get('espacio_fisico/EspaciosHuerfanos/2', $.param({
                    limit: 0
                  })).then(function(response) {
                    //Variable que carga el árbol de los EspaciosHuerfanos
                    self.huerfanos = response.data;
                  });
            //else}
        //  });
      //for}
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
