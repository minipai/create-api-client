"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var create_helper_1 = require("./create-helper");
var defaultConfig = {
    fetchClient: fetch,
    fetchParams: function (params) { return params; }
};
var create = function (path, _config) {
    var config = Object.assign({}, defaultConfig, _config);
    var helper = create_helper_1.createHelper(path);
    return function (data) {
        var _a = helper(data), url = _a[0], params = _a[1];
        var fetchClient = config.fetchClient, fetchParams = config.fetchParams;
        return fetchClient(url, fetchParams(params));
    };
};
var map = function (pathMapping, config) {
    return Object.keys(pathMapping).reduce(function (acc, endpoint) {
        acc[endpoint] = create(pathMapping[endpoint], config);
        return acc;
    }, {});
};
var config = function (userConfig) {
    return Object.assign(function (path, options) {
        var newOptions = Object.assign({}, userConfig, options);
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