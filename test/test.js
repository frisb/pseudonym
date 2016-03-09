'use strict';
var Pseudonym = require('../lib/pseudonym');

console.log(Pseudonym);


describe('Writeln', function () {
	it('should test', function (done) {
		var X = Pseudonym({
			Alpha: 'a',
			Bravo: 'b',
			Charlie: 'c'
		});
		var x = new X();


		console.log(x);

		x.a = 'hello';

		console.log(x);

		console.log(x.toJSON());

		done();
	});
});