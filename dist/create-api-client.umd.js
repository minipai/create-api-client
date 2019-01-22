(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.createApiClient = {})));
}(this, (function (exports) { 'use strict';

  /**
   * Expose `pathToRegexp`.
   */
  var parse_1 = parse;
  var compile_1 = compile;

  /**
   * Default configs.
   */
  var DEFAULT_DELIMITER = '/';

  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */
  var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
    // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
    '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'
  ].join('|'), 'g');

  /**
   * Parse a string for the raw tokens.
   *
   * @param  {string}  str
   * @param  {Object=} options
   * @return {!Array}
   */
  function parse (str, options) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER;
    var whitelist = (options && options.whitelist) || undefined;
    var pathEscaped = false;
    var res;

    while ((res = PATH_REGEXP.exec(str)) !== null) {
      var m = res[0];
      var escaped = res[1];
      var offset = res.index;
      path += str.slice(index, offset);
      index = offset + m.length;

      // Ignore already escaped sequences.
      if (escaped) {
        path += escaped[1];
        pathEscaped = true;
        continue
      }

      var prev = '';
      var name = res[2];
      var capture = res[3];
      var group = res[4];
      var modifier = res[5];

      if (!pathEscaped && path.length) {
        var k = path.length - 1;
        var c = path[k];
        var matches = whitelist ? whitelist.indexOf(c) > -1 : true;

        if (matches) {
          prev = c;
          path = path.slice(0, k);
        }
      }

      // Push the current path onto the tokens.
      if (path) {
        tokens.push(path);
        path = '';
        pathEscaped = false;
      }

      var repeat = modifier === '+' || modifier === '*';
      var optional = modifier === '?' || modifier === '*';
      var pattern = capture || group;
      var delimiter = prev || defaultDelimiter;

      tokens.push({
        name: name || key++,
        prefix: prev,
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        pattern: pattern
          ? escapeGroup(pattern)
          : '[^' + escapeString(delimiter === defaultDelimiter ? delimiter : (delimiter + defaultDelimiter)) + ']+?'
      });
    }

    // Push any remaining characters.
    if (path || index < str.length) {
      tokens.push(path + str.substr(index));
    }

    return tokens
  }

  /**
   * Compile a string to a template function for the path.
   *
   * @param  {string}             str
   * @param  {Object=}            options
   * @return {!function(Object=, Object=)}
   */
  function compile (str, options) {
    return tokensToFunction(parse(str, options))
  }

  /**
   * Expose a method for transforming tokens into the path function.
   */
  function tokensToFunction (tokens) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length);

    // Compile all the patterns before compilation.
    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'object') {
        matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
      }
    }

    return function (data, options) {
      var path = '';
      var encode = (options && options.encode) || encodeURIComponent;

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          path += token;
          continue
        }

        var value = data ? data[token.name] : undefined;
        var segment;

        if (Array.isArray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but got array')
          }

          if (value.length === 0) {
            if (token.optional) continue

            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }

          for (var j = 0; j < value.length; j++) {
            segment = encode(value[j], token);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"')
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment;
          }

          continue
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          segment = encode(String(value), token);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"')
          }

          path += token.prefix + segment;
          continue
        }

        if (token.optional) continue

        throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'))
      }

      return path
    }
  }

  /**
   * Escape a regular expression string.
   *
   * @param  {string} str
   * @return {string}
   */
  function escapeString (str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
  }

  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {string} group
   * @return {string}
   */
  function escapeGroup (group) {
    return group.replace(/([=!:$/()])/g, '\\$1')
  }

  var createHelper = function (path) {
      var namedParams = parse_1(path)
          .map(function (p) { return p.name; })
          .filter(function (n) { return n; });
      var methodRegex = new RegExp('^(GET|POST|PUT|PATCH|DELETE|HEAD)');
      var methodMatch = path.match(methodRegex);
      var method = (methodMatch && methodMatch[0]) || 'GET';
      var targetPath = path.replace(methodRegex, '').trim();
      var toPath = compile_1(targetPath);
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

  var create = function (path, config) {
      if (config === void 0) { config = { fetch: fetch }; }
      var helper = createHelper(path);
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

  exports.createHelper = createHelper;
  exports.createClient = createClient;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=create-api-client.umd.js.map
