'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:ConsultarSedeCtrl
 * @description
 * # ConsultarSedeCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('ConsultarSedeCtrl', function(oikosRequest, uiGridConstants, $scope, $mdDialog, $window) {
    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Se utiliza la variable self estandarizada
    var self = this;
    self.sede = "";

    //Se crea el esquema del tree
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
            '<button title="Editar" type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.consultarSede.abrir_modal_editar(row)" data-toggle="modal" data-target="#editarSede">' +
            '<i class="glyphicon glyphicon-pencil"></i></button>&nbsp;' + '<button title="Gestionar edificios" type="button" class="btn btn-primary btn-circle"' +
            'ng-click="grid.appScope.consultarSede.gestionar_edificios(row)" data-toggle="modal" data-target="#gestionarEdificios""><i class="glyphicon glyphicon-eye-open"></i></button>'
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

    //Función que obtiene todos los espacio_fisicos de acuerdo al tipo
    oikosRequest.get('espacio_fisico', $.param({
        query: "TipoEspacio:1",
        limit: 0
      }))
      .then(function(response) {
        self.gridOptions1.data = response.data;
      });

    //Función para actualizar la información de una aplicación
    self.actualizar = function(row) {

      var NombreMin = document.getElementById("Nombre").value.toUpperCase();
      var CodigoMin = document.getElementById("Codigo").value.toUpperCase();

      console.log(NombreMin);

      var jsonActualizado ={
        Nombre : NombreMin,
        Codigo : CodigoMin,
        Estado : document.getElementById("Estado").value,
        TipoEspacio:{Id : 1}
      };

      //Alerta de cambiar el estado
      swal({
        title: 'Esta seguro que quiere editar la sede ' + self.sede.Nombre + '?',
        text : "OK!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, editar sede!',
        cancelButtonText: 'No, cancelar!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
      }).then(function() {
        //JSON que contiene la información nueva del registro

        //Petición que actualiza la información
        oikosRequest.put('espacio_fisico', self.sede.Id, jsonActualizado)
          .then(function(response) {
            //Respuesta de la petición
            self.ServerResponse = response.data;
            //SweetAlert
            swal({
              title:'Editado!',
              text: 'La sede ha sido editada exitosamente.',
              type:'success',
              confirmButtonColor: '#3085d6',
              confirmButtonClass: 'btn btn-success',
          }).then(function(){
            $('#editarSede').modal('toggle');
                //Función que obtiene todas las espacio_fisicoes
          oikosRequest.get('espacio_fisico', $.param({
            query: "TipoEspacio:1",
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
              swal('El edificio <label><b>' + $scope.nuevos_edificios.Nombre + '</b></label> ya se encuentra asociado a la sede', 'Valide la información', 'error')
              //alert("El menú " + $scope.nombre_menu + "</b> ya se encuentra asociado al perfil");
            } else {
              //sweetalert2 que indica el nombre del menú que acabo de vincular
              swal('Correcto', 'Los edificios se han vinculado a la sede satisfactoriamente', 'success')
              //Cargar los nuevos edificios asociados
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
            }
          });
      }
    };


    //Función para desvincular edificios de la sede
    self.desvincular_espacio_fisico = function() {
      //Validación de selección de edificios
      if ($scope.desvincular_edificios.length == 0) {
        swal('No ha seleccionado ningún edificio para desvincular',
          'Seleccione el edificio o los edificios a desvincular',
          'error'
        )
      } else {
        swal({
          title: '¿Desea desvincular el edificio o edificios seleccionados?',
          text: "Verifique que los edificio seleccionados son los que desea desvincular",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí'
        }).then(function() {
          //For que permite recorrer el arreglo de los edificios a desvincular
          for (var i = 0; i < $scope.desvincular_edificios.length; i++) {

            //Petición que elimina la asociaciÓn entre la sede y el edificio
            oikosRequest.delete('espacio_fisico_padre', $scope.desvincular_edificios[i].Id)
              .then(function(response) {
                //Condicional
                if (response.data === "OK") {
                  swal('Edificio(s) desvinculado(s)!', 'El/los edificio(s) se han desvinculado de la sede correctamente.', 'success')

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


                } else {
                  swal('No se ha podido desvincular el menú', 'Valide la información', 'cancel')
                }
              })
          }
        });
      }
    }; //Cierra la función borrar()

    /*Función para limpiar todos los campos del formulario con el botón "Cancelar"*/
    self.reset = function(form) {
      self.perfil = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();

      }
    };
  });
