
      
     angular.module('app')  
      .config(function($mdThemingProvider) {
        var customBlueMap =     $mdThemingProvider.extendPalette('light-blue', {
          'default' :'500',
          'contrastDefaultColor': 'light',
          'contrastDarkColors': ['50'],
          '50': 'ffffff'
        });
        $mdThemingProvider.definePalette('default', customBlueMap);
       /* $mdThemingProvider.theme('default')
          .primaryPalette('light-blue', {
            'default': '500',
            'hue-1': '50'
          })
          .accentPalette('pink');*/

        $mdThemingProvider.theme('searchToolbar', 'default')
            .primaryPalette('grey', {
            'default': '100',
            'hue-1': '50'
          });
        $mdThemingProvider.theme("success-toast")
    })
    .directive('nextOnEnter', function() {
      return {
        restrict: 'AE',
        link: function($scope,elem,attrs) {

          elem.bind('keydown', function(e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
              e.preventDefault();
              $('#'+attrs.nextOnEnter).focus();         
            }
          });
        }
      }
    })
     .directive('nextOnEnterDivInput', function() {
      return {
        restrict: 'AE',
        link: function($scope,elem,attrs) {
          console.log("#"+attrs.id+" input[type=search]")
          $("#"+attrs.id+" input[type=search]").bind('keydown', function(e) {
              var code = e.keyCode || e.which;
              console.log('bindado')
              if (code === 13) {
                e.preventDefault();
                $('#'+attrs.nextOnEnterDivInput).focus();         
              }
            });
        }
      }
    })
	.directive('md-autocomplete-clientes', function(){
	  return {
  		require: 'md-autocomplete',
      controlerAs: 'ctrl',
  		link: function($scope, $element, $attributes) {
        var vm = this;
        vm.simulateQuery = false;
        vm.isDisabled    = false;
        vm.querySearch   = querySearch;
        vm.selectedItemChange = selectedItemChange;
        vm.searchTextChange   = searchTextChange;
  		}
	  }
	})
	.directive('removeAcento', function() {
      return {
        restrict: 'AE',
        link: function($scope,elem,attrs) {
            elem.bind('keyup', function(e) {
                str_acento = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
          			str_sem_acento = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
          			var nova = "";
          			for (var i = 0; i < elem[0].value.length; i++) {
          				if (str_acento.indexOf(elem[0].value.charAt(i)) != -1) {
          					nova += str_sem_acento.substr(str_acento.search(elem[0].value.substr(i, 1)), 1);
          				} else {
          					nova += elem[0].value.substr(i, 1);
          				}
          			}
          			elem[0].value = nova;
            });
        }
      }
    })
	
	.directive('functionOnEnter', function() {
      return {
        restrict: 'AE',
        link: function($scope,elem,attrs) {

          elem.bind('keydown', function(e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
              e.preventDefault();
			  $scope.$apply(attrs.functionOnEnter);
            }
          });
        }
      }
    })
  .directive('shortcut', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      link:    function postLink(scope, iElement, iAttrs){
        jQuery(document).on('keydown', function(e){
           scope.$apply(scope.keyPressed(e));
         });
      }
    };
  })
    .directive('nextOnEnterUiSelect', function() {
      return {
        restrict: 'AE',
        link: function($scope,elem,attrs) {

          elem.bind('keydown', function(e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
               e.preventDefault();
               console.log($scope.focusUfContratado)
               $scope.$broadcast(attrs.nextOnEnterUiSelect);
            }
          });
        }
      }
    })

    .directive('uiSelectOpenOnFocus', ['$timeout', function($timeout){
      return {
        require: 'uiSelect',
        restrict: 'A',
        link: function($scope, el, attrs, uiSelect) {
          var closing = false;

          angular.element(uiSelect.focusser).on('focus', function() {
            if(!closing) {
              uiSelect.activate();
            }
          });

          // Because ui-select immediately focuses the focusser after closing
          // we need to not re-activate after closing
          $scope.$on('uis:close', function() {
            closing = true;
            $timeout(function() { // I'm so sorry
              closing = false;
            });
          });
        }
      };
    }])

    .filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
              items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                  var prop = keys[i];
                  var text = props[prop].toLowerCase();
                  if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                    itemMatches = true;
                    break;
                  }
                }

                if (itemMatches) {
                    if(out.length < 30)
                        out.push(item);
                }
              });
            } else {
              // Let the output be the input untouched
              out = items;
            }

            return out;
        };
    })
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    })
    .filter("myDateFilter", function() {
        return function(items, from, to) {
          var df = false;
          var dt = false;
          if((from == '' && to == '')||(from == 'undefined' && to == 'undefined')||(from == undefined && to == undefined)){
            return items
          }

          //var parts = from.split('/');
          if(from != undefined && from != '' && from != 'undefined'){
              df = new Date(from.substr(4,8), (from.substr(2,2)-1), from.substr(0,2));
          }
          if(to != undefined && to != '' && to != 'undefined'){
              dt = new Date(to.substr(4,8), (to.substr(2,2)-1), to.substr(0,2), '23', '59', '59');
          }

          var result = [];        
          for (var i=0; i<items.length; i++){
              var tf = new Date(items[i].dataUpload);
              if(df != false && dt != false){
                if (tf >= df && tf <= dt)  {
                  result.push(items[i]);
                }
              }else if(df == false  && dt !=false){
                 if ( tf <= dt)  {
                  result.push(items[i]);
                }
              }else if(dt == false && df !=false){
                 if ( tf >= df)  {
                  result.push(items[i]);
                }
              }else{   
                  result.push(items[i]);
              }
             
          }            
          return result;
        };
      })
    .directive('focusMe', function($timeout) {
      return {
        link: function(scope, element, attrs) {
          scope.$watch(attrs.focusMe, function(value) {
            if(value === true) { 
              console.log('value=',value);
              $timeout(function() {
                console.log(element);
                element[0].focus();
                //scope[attrs.focusMe] = false;
              });
            }
          });
        }
      };
    })
  
 // oclazyload config
  .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
      // We configure ocLazyLoad to use the lib script.js as the async loader
      $ocLazyLoadProvider.config({
          debug:  true,
          events: true,
          modules: [
              {
                  name: 'ngGrid',
                  files: [
                      '../bower_components/ng-grid/build/ng-grid.min.js',
                      '../bower_components/ng-grid/ng-grid.min.css',
                      '../bower_components/ng-grid/ng-grid.bootstrap.css'
                  ]
              },
              {
                  name: 'ui.grid',
                  files: [
                      '../bower_components/angular-ui-grid/ui-grid.min.js',
                      '../bower_components/angular-ui-grid/ui-grid.min.css',
                      '../bower_components/angular-ui-grid/ui-grid.bootstrap.css'
                  ]
              },
              {
                  name: 'ui.select',
                  files: [
                      '../bower_components/angular-ui-select/dist/select.min.js',
                      '../bower_components/angular-ui-select/dist/select.min.css'
                  ]
              },
              {
                  name:'angularFileUpload',
                  files: [
                    '../bower_components/angular-file-upload/angular-file-upload.min.js'
                  ]
              },
              {
                  name:'ui.calendar',
                  files: ['../bower_components/angular-ui-calendar/src/calendar.js']
              },
              {
                  name: 'ngImgCrop',
                  files: [
                      '../bower_components/ngImgCrop/compile/minified/ng-img-crop.js',
                      '../bower_components/ngImgCrop/compile/minified/ng-img-crop.css'
                  ]
              },
              {
                  name: 'angularBootstrapNavTree',
                  files: [
                      '../bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                      '../bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css'
                  ]
              },
              {
                  name: 'toaster',
                  files: [
                      '../bower_components/angularjs-toaster/toaster.js',
                      '../bower_components/angularjs-toaster/toaster.css'
                  ]
              },
              {
                  name: 'textAngular',
                  files: [
                      '../bower_components/textAngular/dist/textAngular-sanitize.min.js',
                      '../bower_components/textAngular/dist/textAngular.min.js'
                  ]
              },
              {
                  name: 'vr.directives.slider',
                  files: [
                      '../bower_components/venturocket-angular-slider/build/angular-slider.min.js',
                      '../bower_components/venturocket-angular-slider/build/angular-slider.css'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular',
                  files: [
                      '../bower_components/videogular/videogular.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.controls',
                  files: [
                      '../bower_components/videogular-controls/controls.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.buffering',
                  files: [
                      '../bower_components/videogular-buffering/buffering.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.overlayplay',
                  files: [
                      '../bower_components/videogular-overlay-play/overlay-play.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.poster',
                  files: [
                      '../bower_components/videogular-poster/poster.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.imaads',
                  files: [
                      '../bower_components/videogular-ima-ads/ima-ads.min.js'
                  ]
              },
              {
                  name: 'xeditable',
                  files: [
                      '../bower_components/angular-xeditable/dist/js/xeditable.min.js',
                      '../bower_components/angular-xeditable/dist/css/xeditable.css'
                  ]
              },
              {
                  name: 'smart-table',
                  files: [
                      '../bower_components/angular-smart-table/dist/smart-table.min.js'
                  ]
              }
          ]
      });
  }]);

 var configFileLocation = 'c:/PharmaGed/config.js'

