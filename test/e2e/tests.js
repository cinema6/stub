//define([ 'app' ], function(){ 
(function(){
    'use strict';
	
    angular.scenario.dsl('checkLoaded', function() {
		return function() {
			return this.addFutureAction('checking if app is fully loaded.', 
                                            function(appWindow, $document, done) {
                sleep(3);
                done(null,true);
			});
		}
	});

    describe('Stub test suite', function(){
        describe('The Landing Page',function(){
            beforeEach(function(){
                browser().navigateTo('/');
                sleep(2);
            });
            
            it('is a basic test',function(){
                //expect(true).toEqual(true);
				expect(element('span').text()).toEqual(' You have landed. ');
            });
        });
    });




}());
