'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:GestionarTipoEspacioCtrl
 * @description
 * # GestionarTipoEspacioCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('GestionarTipoEspacioCtrl', function (oikosRequest, uiGridConstants, $mdDialog, $window) {
       //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
       var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';
       
         //Variable que encapsula la información del controlador
         var self = this;
     
         //Variable que contiene la información del nuevo tipo
         self.nuevo_tipo = {};
     
         //Creación tabla que contiene los tipos de espacios físicos
         self.gridOptions_tipos = {
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
               field: 'Acciones',
               width: "15%",
               cellTemplate: '<button title="Editar" type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.gestionarTipoEspacio.abrir_modal_editar(row)" data-toggle="modal" data-target="#editarTipoEspacio">' +
               '<i class="glyphicon glyphicon-pencil"></i></button>&nbsp;'
             }
     
           ]
         };
     
         //Cargar tipos de espacio físico
         oikosRequest.get('tipo_espacio_fisico', $.param({
           limit: -1
         }))
         .then(function(response) {
           self.gridOptions_tipos.data = response.data;
         });
     
         //Función para crear un espacio fisico
         self.crear_tipo_espacio = function (form) {
           
           console.log(self.nuevo_tipo);
           //Convertir a mayusculas
           self.nuevo_tipo.Nombre = self.nuevo_tipo.Nombre.toUpperCase();
     
           //Petición POST
           oikosRequest.post("tipo_espacio_fisico", self.nuevo_tipo).then(function (response) {
             //Condicional de validación
             if (response.status == 201) {
               //Notificación de success
               swal({
                 title: "Registro exitoso",
                 html: "<label>Se insertó correctamente el tipo de espacio físico con la siguiente información:</label>" +
                 "<br><label><b>Nombre:</b></label> " + self.nuevo_tipo.Nombre,
                 type: "success",
                 showCancelButton: false,
                 confirmButtonColor: "#449D44",
                 confirmButtonText: "Ok",
               }).then(function () {
                   //Si da click limpia el formulario y actualiza la tabla de consulta
                   self.nuevo_tipo = {};
                   //Actualiza la tabla de consulta
                   oikosRequest.get('tipo_espacio_fisico', $.param({
                     limit: -1
                   }))
                   .then(function(response) {
                     self.gridOptions_tipos.data = response.data;
                   });
                 });
             } else {
               //Se visualiza cuando no se pudo insertar en la BD
               swal(
                 'Rechazada!',
                 'Su transacción ha sido rechazada porque se produjo un error a nivel de base de datos',
                 'error'
               )
             }
           });
         };
     
           //Funcion para abrir el modal
       self.abrir_modal_editar = function(row){
         self.tipo_espacio = row.entity;
         document.getElementById("Nombre").value=self.tipo_espacio.Nombre;
       };
     
          //Función para actualizar la información del tipo de dependencia
        self.actualizar = function(row) {
         //Variables que se obtienen del campo Nombre
         var NombreMin = document.getElementById("Nombre").value.toUpperCase();
         //Información actualizada
         var jsonActualizado ={
           Nombre : NombreMin,
         };
     
         //Alerta de cambiar el estado
         swal({
           title: 'Esta seguro que quiere editar el tipo de espacio físico ' + self.tipo_espacio.Nombre + '?',
           text : "OK!",
           type: 'warning',
           showCancelButton: true,
           confirmButtonColor: '#3085d6',
           cancelButtonColor: '#d33',
           confirmButtonText: 'Sí, editar tipo espacio físico!',
           cancelButtonText: 'No, cancelar!',
           confirmButtonClass: 'btn btn-success',
           cancelButtonClass: 'btn btn-danger',
         }).then(function() {
           //Petición que actualiza la información
           oikosRequest.put('tipo_espacio_fisico', self.tipo_espacio.Id, jsonActualizado)
             .then(function(response) {
               //Respuesta de la petición
               self.ServerResponse = response.data;
               //SweetAlert
               swal({
                 title:'Editado!',
                 text: 'El tipo de espacio físico ha sido editado exitosamente.',
                 type:'success',
                 confirmButtonColor: '#3085d6',
                 confirmButtonClass: 'btn btn-success',
             }).then(function(){
               $('#editarTipoEspacio').modal('toggle');
               //Función que obtiene todos los tipos de dependencias
               oikosRequest.get('tipo_espacio_fisico', $.param({
                 limit: -1
               }))
               .then(function(response) {
                 self.gridOptions_tipos.data = response.data;
               });
             })
     
             })
         }, function(dismiss) {
           // dismiss can be 'cancel', 'overlay',
           // 'close', and 'timer'
           if (dismiss === 'cancel') {
             swal('Cancelado', 'Se cancelo la acción', 'error')
             $('#editarTipoEspacio').modal('toggle');
           }
         })
     
       };
  });
