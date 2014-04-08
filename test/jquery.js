/* jshint browser: true */
/* global describe, it, expect */

describe('jquery', function () {

    it('should be ok', function (cb) {

        window.jQuery
            .ajax({
                url: '//' + location.hostname + ':8080/data.json'
            })
            .done(function (response) {
                expect(response).to.eql(["one", "two", "three"]);
            })
            .always(function () {
                cb();
            });

    });


});