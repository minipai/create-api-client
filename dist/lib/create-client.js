"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var create_helper_1 = require("./create-helper");
var create = function (path, config) {
    if (config === void 0) { config = { fetch: fetch }; }
    var helper = create_helper_1.createHelper(path);
    return function (data) {
        var _a = helper(data), url = _a[0], params = _a[1];
        return config.fetch(url, params);
    };
};
var map = function (pathMapping, config) {
    return Object.keys(pathMapping).reduce(function (acc, endpoint) {
        acc[endpoint] = create(pathMapping[endpoint], config);
        return acc;
    }, {});
};
var config = function (defaultOptions) {
    return Object.assign(function (path, options) {
        var newOptions = Object.assign({}, defaultOptions, options);
        return create(path, newOptions);
    }, {
        config: config,
        map: map
    });
};
var createClient = Object.assign(create, {
    config: config,
    map: map
});
exports.createClient = createClient;
//# sourceMappingURL=create-client.js.map