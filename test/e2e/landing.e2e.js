(function() {
    'use strict';

    describe('the landing page', function() {
        var ptor;

        beforeEach(function() {
            ptor = protractor.getInstance();

            browser.get('http://localhost:9000/');
            ptor.switchTo().frame('experience');
            ptor.waitForAngular();
        });

        it('should display "you have landed."', function() {
            var text = $('.landed');

            expect(text.getText()).toBe('You have landed.');
        });
    });
})();
