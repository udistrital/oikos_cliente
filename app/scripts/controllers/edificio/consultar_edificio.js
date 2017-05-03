'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:ConsultarEdificioCtrl
 * @description
 * # ConsultarEdificioCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('ConsultarEdificioCtrl', function (oikosRequest) {
    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
   //var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

   //Creación tabla
   self.gridOptions1 = {
     enableSorting: true,
     enableFiltering: true,
     resizable: true,
     columnDefs: [
       {
         field: 'Nombre'

       },
       {
         field: 'Codigo',

         displayName: 'Código'
       },
       {
         field: 'Estado',

       },
       {
         field: 'Acciones',
         cellTemplate: '<button class="btn btn-danger btn-circle" ng-click="grid.appScope.deleteRow(row)"><i class="glyphicon glyphicon-trash"></i></button>&nbsp;<button type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.actualizar(row)"><i class="glyphicon glyphicon-pencil"></i></button>'
       }
     ]
   };

   //Función que obtiene todos los edificios
   oikosRequest.get('espacio_fisico', $.param({
       query: "TipoEspacio:2",
       limit: 0
     }))
     .then(function(response) {
       self.gridOptions1.data = response.data;
     });

   //Función para actualizar la información de un edificio
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
     oikosRequest.delete('espacio_fisico', row.entity.Id)
       .then(function(response) {
         //Condicional
         if (response.data === "OK") {
           //self.gridOptions1.data.splice(index, 1); Sirve para hacer el borrado desde la vista
           alert("La aplicacion se ha borrado exitosamente");
           //Función que obtiene todas las aplicaciones
           oikosRequest.get('espacio_fisico', $.param({
               query: "TipoEspacio:2",
               limit: 0
             }))
             .then(function(response) {
               self.gridOptions1.data = response.data;
             });
         } else {
           alert("No se puede borrar el edificio");
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
