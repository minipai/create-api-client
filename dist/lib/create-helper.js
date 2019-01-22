"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_to_regexp_1 = require("path-to-regexp");
var createHelper = function (path) {
    var namedParams = path_to_regexp_1.parse(path)
        .map(function (p) { return p.name; })
        .filter(function (n) { return n; });
    var methodRegex = new RegExp('^(GET|POST|PUT|PATCH|DELETE|HEAD)');
    var methodMatch = path.match(methodRegex);
    var method = (methodMatch && methodMatch[0]) || 'GET';
    var targetPath = path.replace(methodRegex, '').trim();
    var toPath = path_to_regexp_1.compile(targetPath);
    return function (params) {
        if (params === void 0) { params = {}; }
        var url = toPath(params);
        var newParams = Object.keys(params).reduce(function (acc, key) {
            if (namedParams.includes(key))
                return acc;
            acc[key] = params[key];
            return acc;
        }, {});
        newParams.method = method;
        return [url, newParams];
    };
};
exports.createHelper = createHelper;
//# sourceMappingURL=create-helper.js.map