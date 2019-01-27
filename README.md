# Create API Client

> Use the popular path syntax `/enpoint/:id` to create api client

[![npm version](https://badge.fury.io/js/create-api-client.svg)](https://badge.fury.io/js/create-api-client) [![Build Status](https://travis-ci.org/minipai/create-api-client.svg?branch=master)](https://travis-ci.org/minipai/create-api-client) [![Coverage Status](https://coveralls.io/repos/github/minipai/create-api-client/badge.svg?branch=master)](https://coveralls.io/github/minipai/create-api-client?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/minipai/create-api-client.svg)](https://greenkeeper.io/)

## Install

```
npm install create-api-client --save
```

## Use

```
import { createClient } from 'create-api-client';

// create client
const getEndpoint = createClient("GET /api/endpoint/:id");

// request a fetch
getEndpoint({id: 1})
```

## How it works

`createClient` use [path-to-regex](https://github.com/pillarjs/path-to-regexp) to parse your path, find every segment which started with `:` as parameters and create an api client.

```
const getComment = createClient("/api/post/:postId/comment/:commentId");
```

The created api client would take the key which is path params (`postId`, `commentId`) from passed in params to build URL and call fetch client(defaults to global variable `fetch`) as the first argument.

```
getComment({postId: 10, commentId: 100})
// same as
// fetch("/api/post/10/comment/100")
```

If you provide `query` in params, the query string would generate from it and append to url.

```
getComment({postId: 10, commentId: 100, query: {latest: 10}})
// same as
// fetch("/api/post/10/comment/100?latest=10")
```

You can change HTTP method by prefix path with HTTP method name.

```
const getComment = createClient("POST /api/post/:postId");
```

The created api client would pass it as `method` in second argument.

```
postComment({postId: 10})
// same as
// fetch("/api/post/10", { method: 'POST'})
```

Finally, all other params you passed to the API client would pass to fetch client as it is. Which you can put header, body, ...etc.

```
postComment({
  postId: 10,
  headers = {
    Accept: "application/json"
  },
  body: {
    message: 1000
    }
  }
)
// same as
// fetch("/api/post/10", {
//   method: "POST",
//   headers: {
//     Accept: "application/json"
//   },
//   body: {
//     message: 1000
//   }
// })
```

## API

### createClient

```
createClient(path, config)
```

#### Returns

- (Function): Returns created API client.

#### Arguments

- `path` : path to use [path-to-regex](https://github.com/pillarjs/path-to-regexp) to parse and compile
- `config` (Object) : Config object to customize api client
- `config.fetchClient` (function): The function to issue request. Defaults to global variable `fetch`.

### createClient.config

```
createClient.config(config)
```

#### Arguments

- `config` (Object) : Config object to customize api client

#### Returns

- (Function): Returns a new createClient preseted with provided config.

### createClient.map

```
createClient.map(pathMapping)
```

#### Arguments

- `pathMapping` (Object) : An mapping of method name and path. e.g. `{ getUser: 'GET /user', removeUser: 'DELETE /user/:id' }`

#### Returns

- (Object): Returns a createClient mapping Object. e.g. `{ getUser: [createClient Function], removeUser: [createClient Function] }`

## License

MIT
