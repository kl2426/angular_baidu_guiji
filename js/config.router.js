'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {
          
          $urlRouterProvider
              .otherwise('/app/locus');
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: 'tpl/app.html'
              })
              .state('app.index', {
                  url: '/index',
                  templateUrl: 'tpl/index/index.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        //return $ocLazyLoad.load(['js/controllers/chart.js']);
                    }]
                  }
              })
              
              
              
              
              
              //  轨迹
              .state('app.locus', {
                  url: '/locus',
                  templateUrl: 'tpl/locus/index.html',
                  controller: 'locusCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/locus/locus.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              //  轨迹 - 直播列表
              .state('app.locus.list', {
                  url: '/list',
                  templateUrl: 'tpl/locus/allvideo/index.html',
                  controller: 'locusListCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/locus/locus.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              //  区域
              .state('app.area', {
                  url: '/area',
                  templateUrl: 'tpl/area/index.html',
                  controller: 'areaCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/area/area.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              
              //  定时
              .state('app.timing', {
                  url: '/timing',
                  templateUrl: 'tpl/timing/index.html',
                  controller: 'timingCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/timing/timing.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              //  定时 - 添加
              .state('app.timing.add', {
                  url: '/add',
                  templateUrl: 'tpl/timing/add/index.html',
                  controller: 'timingAddCtrl',
                  params: {'title':''},
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/timing/timing.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              //  协助
              .state('app.assist', {
                  url: '/assist',
                  templateUrl: 'tpl/assist/index.html',
                  controller: 'assistCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/assist/assist.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              //  协助 - 添加
              .state('app.assist.add', {
                  url: '/add',
                  templateUrl: 'tpl/assist/add/index.html',
                  controller: 'assistAddCtrl',
                  params: {'title':'','operate':''},
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/assist/assist.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              
              //  历史
              .state('app.history', {
                  url: '/history',
                  templateUrl: 'tpl/history/index.html',
                  controller: 'historyCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/history/history.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              //  历史 - 添加
              .state('app.history.add', {
                  url: '/add',
                  templateUrl: 'tpl/history/add/index.html',
                  controller: 'historyAddCtrl',
                  params: {'title':''},
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/history/history.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              
              //  统计
              .state('app.count', {
                  url: '/count',
                  templateUrl: 'tpl/count/index.html',
                  controller: 'countCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/count/count.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              
              
              //  设置
              .state('app.site', {
                  url: '/site',
                  templateUrl: 'tpl/site/index.html',
                  controller: 'siteCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ui.select','toaster']).then(
                              function(){
                                 return $ocLazyLoad.load(['js/controllers/site/site.js']);
                              }
                          );
                        }
                      ]
                  }
              })
              
              
              
//            /**
//             * 系统管理
//             */
//            .state('app.xtgl', {
//                url: '/system',
//                templateUrl: 'tpl/xtgl/index.html'
//            })
//            //  用户管理
//            .state('app.xtgl.yhgl', {
//                url: '/system/user',
//                templateUrl: 'tpl/xtgl/yhgl/index.html'
//            })
//            //  菜单管理
//            .state('app.xtgl.yhgl.cdgl', {
//                url: '/system/user/menu',
//                templateUrl: 'tpl/xtgl/yhgl/cdgl/index.html',
//                controller: 'xtglYhglCdglCtrl',
//                resolve: {
//                    deps: ['$ocLazyLoad',
//                      function( $ocLazyLoad ){
//                        return $ocLazyLoad.load(['angularBootstrapNavTree','ui.select']).then(
//                            function(){
//                               return $ocLazyLoad.load(['js/controllers/tree.js','js/controllers/xtgl/yhgl/cdgl/list.js']);
//                            }
//                        );
//                      }
//                    ]
//                }
//            })
//            
//            //  角色管理
//            .state('app.xtgl.yhgl.jsgl', {
//                url: '/system/user/role',
//                templateUrl: 'tpl/xtgl/yhgl/jsgl/index.html',
//                controller: 'xtglYhglJsglCtrl',
//                resolve: {
//                    deps: ['$ocLazyLoad',
//                      function( $ocLazyLoad ){
//                        return $ocLazyLoad.load('ui.select').then(
//                            function(){
//                                return $ocLazyLoad.load('js/controllers/xtgl/yhgl/jsgl/list.js');
//                            }
//                        );
//                    }]
//                }
//            })
              
              
              //   单页  不需验证页面
              
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              
              
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: 'tpl/page/page_signin.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/page/signin.js'] );
                      }]
                  }
              })
             
              .state('access.404', {
                  url: '/404',
                  templateUrl: 'tpl/page/page_404.html'
              })

              
      }
    ]
  );