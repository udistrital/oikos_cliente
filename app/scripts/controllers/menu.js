'use strict';
/**
 * @ngdoc function
 * @name oikosClienteApp.controller:menuCtrl
 * @description
 * # menuCtrl
 * Controller of the oikosClienteApp
 */
angular.module('oikosClienteApp')
.controller('menuCtrl', function($location, $http, $scope, token_service, notificacion) {
    var paths = [];
    $scope.notificacion = notificacion;
    $scope.actual = "";
    $scope.token_service = token_service;
    $scope.breadcrumb = [];
    $scope.menu_service = [
      { //aqui va el servicio de el app de configuracion
          "Id": 2,
          "Nombre": "Sede",
          "Url": "",
          "Opciones": [{
              "Id": 3,
              "Nombre": "Registrar sede",
              "Url": "crear_sede",
              "Opciones": null
              },
            {
              "Id": 4,
              "Nombre": "Consultar sede",
              "Url": "consultar_sede",
              "Opciones": null
            }]
          },
          {
            "Id": 5,
            "Nombre": "Edificio",
            "Url": "",
            "Opciones": [{
                "Id": 6,
                "Nombre": "Registrar edificio",
                "Url": "crear_edificio",
                "Opciones": null
                },
              {
                "Id": 7,
                "Nombre": "Consultar edificio",
                "Url": "consultar_edificio",
                "Opciones": null
              }]
            },
            {

                "Id": 8,
                "Nombre": "Espacio físico",
                "Url": "",
                "Opciones": [{
                    "Id": 9,
                    "Nombre": "Registrar espacio físico",
                    "Url": "crear_espacio_fisico",
                    "Opciones": null
                    },
                  {
                    "Id": 10,
                    "Nombre": "Consultar espacio físico",
                    "Url": "consultar_espacio_fisico",
                    "Opciones": null
                  }]
                },
                    {

                    "Id": 11,
                    "Nombre": "Dependencia",
                    "Url": "",
                    "Opciones": [{
                        "Id": 12,
                        "Nombre": "Registrar dependencia",
                        "Url": "crear_dependencia",
                        "Opciones": null
                        },
                      {
                        "Id": 13,
                        "Nombre": "Consultar dependencia",
                        "Url": "consultar_dependencia",
                        "Opciones": null
                      }]
                    }
      ];

    var recorrerArbol = function(item, padre) {
      var padres = "";
      for (var i = 0; i < item.length; i++) {
        if (item[i].Opciones === null) {
          padres = padre + " , " + item[i].Nombre;
          paths.push({
            'path': item[i].Url,
            'padre': padres.split(",")
          });
        } else {
          recorrerArbol(item[i].Opciones, padre + "," + item[i].Nombre);
        }
      }
      return padres;
    };



    var update_url = function() {
      $scope.breadcrumb = [''];
      for (var i = 0; i < paths.length; i++) {
        if ($scope.actual === "/" + paths[i].path) {
          $scope.breadcrumb = paths[i].padre;
        } else if ('/' === $scope.actual) {
          $scope.breadcrumb = [''];
        }
      }
    };
    recorrerArbol($scope.menu_service, "");
    paths.push({padre:["","Notificaciones","Ver Notificaciones"],path:"notificaciones"});

    $scope.$on('$routeChangeStart', function(next, current) {
      $scope.actual = $location.path();
      update_url();
      console.log(next + current);
    });
    //Pendiente por definir json del menu
    (function($) {
      $(document).ready(function() {
        $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          $(this).parent().siblings().removeClass('open');
          $(this).parent().toggleClass('open');
        });
      });
    })(jQuery);
  });
