(function(){
    'use strict';

    define(['app'], function() {
        describe('AppController', function() {
            var $rootScope,
                $scope,
                AppCtrl;

            beforeEach(function() {
                module(window.c6Settings.appModule);
                inject(function(_$rootScope_, $controller) {
                    $rootScope = _$rootScope_;
                    $scope = _$rootScope_.$new();

                    AppCtrl = $controller('AppController', {
                        $scope: $scope
                    });
                });
            });

            it('should exist',function() {
                expect(AppCtrl).toBeDefined();
            });

            it('should publish itself to the $scope', function() {
                expect($scope.AppCtrl).toBe(AppCtrl);
            });
        });
    });
}());
