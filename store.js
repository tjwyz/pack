var store = {

}
exports.set = function (moduleName, data) {
	store[moduleName] = data;
}
exports.get = function	(moduleName) {
	return store[moduleName];
}
exports.all = function	() {
	return store;
}

