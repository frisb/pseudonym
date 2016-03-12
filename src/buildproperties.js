/*
 * Define source name properties on the Model prototype
 * @method
 * @param {object} prototype Model implementation prototype.
 * @param {string} src Source name.
 */
function _defineProperty(prototype, src) {
	if (!prototype.hasOwnProperty(src)) {
		Object.defineProperty(prototype, src, {
			get() {
				return this.getValue(src);
			},
			set(val) {
				this.setValue(src, val);
			}
		});
	}
}

export default function (Pseudo) {
	let {prototype, fieldMap} = Pseudo;
	let {srcKeys} = fieldMap;

	for (let i = 0, len = srcKeys.length; i < len; i++)
		_defineProperty(prototype, srcKeys[i]);
}