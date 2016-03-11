import FieldMap from './fieldmap';

function _inherits(child, parent) {
	for (var key in parent) {
		if (parent.hasOwnProperty(key))
			child[key] = parent[key];
	}

	function ctor() {
		this.constructor = child;
	}

	ctor.prototype = parent.prototype;
	child.prototype = new ctor();
	child.__super__ = parent.prototype;

	return child;
}

export default function (child, moreFields) {
	if (!child)
		child = function () {};

	if (!child.prototype) {
		moreFields = child;
		child = function () {};
	}

	let originalChildPrototype = child.prototype

	_inherits(child, this);

	// put back childs original prototype properties
	for (let key in originalChildPrototype)
		child.prototype[key] = originalChildPrototype[key];

	let fieldMap = new FieldMap(this.fieldMap.fields);
	fieldMap.merge(moreFields);

	child.fieldMap = fieldMap;

	return child;
};