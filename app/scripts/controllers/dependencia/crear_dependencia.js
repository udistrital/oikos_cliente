'use strict';

/**
 * @ngdoc function
 * @name oikosClienteApp.controller:CrearDependenciaCtrl
 * @description
 * # CrearDependenciaCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
  .controller('CrearDependenciaCtrl', function (oikosRequest, $window, $scope) {
    //Se utiliza la variable self estandarizada
    var self=this;
    //Se crea JSON para la nueva_dependencia
    self.nueva_dependencia = {};

    //Se define la variable de TreeControl
    $scope.treeOptions = {
   	  	         multiSelection: false,
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

    //Función que obtiene los tipos de dependencia
    oikosRequest.get('tipo_dependencia', $.param({
        limit: 0
      })).then(function(response) {
        self.tipo_dependencia = response.data;
      });

    //Función para crear la dependencia
    self.crear_dependencia=function(form){
      console.log(self.nueva_dependencia);

      //Convertir a mayusculas
      self.nueva_dependencia.Nombre = self.nueva_dependencia.Nombre.toUpperCase();
      self.nueva_dependencia.Telefono = self.nueva_dependencia.Telefono.toUpperCase();
      self.nueva_dependencia.Correo = self.nueva_dependencia.Correo.toUpperCase();

      //Petición POST
      oikosRequest.post("dependencia", self.nueva_dependencia).then(function(response){
        //Notificación de success
        swal({
          title: "Registro exitoso",
          html: "<label>Se insertó correctamente la dependencia con los siguientes datos</label><br><br><label><b>Nombre:</b></label> "
          + self.nueva_dependencia.Nombre+"<br><label><b>Télefono:</b></label> " + self.nueva_dependencia.Telefono +
          "<br><label><b>Correo electrónico:</b></label>" + self.nueva_dependencia.Correo,
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#449D44",
          cancelButtonColor: "#2c6bc9",
          confirmButtonText: "Registrar nueva dependencia",
          cancelButtonText: "Consultar dependencia",
        }).then(function() {
            //Si da click lo redirije a crear nueva dependencia
            $window.location.reload();
          },
          function(dismiss) {
            if (dismiss === 'cancel') {
                //Si da click lo redirije a consultar dependencia
              $window.location.href = '#/consultar_dependencia';
            }
          })
      });
    };


    /*Función para incluir los menus de acuerdo a la app seleccionada*/
  	self.visualizar_dependencias = function(){
  		    //Variable que contiene los menús
  			  $scope.dataForTheTree = [];
          console.log("Entro a visualizar_dependencias");
          //Pinta las dependencias
          oikosRequest.get('dependencia_padre/ArbolDependencias', $.param({
              limit: 0
            }))
            .then(function(response) {
               $scope.dataForTheTree = response.data;
            });
    };




});
