(function() {
    'use strict';

    describe('the landing page', function() {
        var ptor = protractor.getInstance(),
            landingPage;

        function LandingPage() {
            var self = this;

            this.landedText = $('.landed');

            this.get = function() {
                // Load the sandbox app
                browser.driver.get('http://localhost:9000/');
                // Switch to the experience app

                browser.wait(function() {
                    return ptor.isElementPresent(by.name('experience'));
                });
                ptor.switchTo().frame(ptor.findElement(by.name('experience')));
                // Under normal circumstance, protractor will wait for $http, $digest, and $timeout to
                // be idle before starting the tests. This doesn't work when we're working with Angular
                // inside of an iframe. Because of this, we "ignoreSynchronization" and use good, old-
                // fashioned and reliable DOM-polling to figure out the readiness of our App.
                browser.wait(function() {
                    return self.landedText.isPresent();
                });
            };
        }

        ptor.ignoreSynchronization = true;

        beforeEach(function() {
            landingPage = new LandingPage();

            landingPage.get();
        });

        it('should display "you have landed."', function() {
            expect(landingPage.landedText.getText()).toBe('You have landed.');
        });
    });
})();
