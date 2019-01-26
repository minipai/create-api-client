# Create API Client

> Use the popular path syntax `/enpoint/:id` to create api client

[![npm version](https://badge.fury.io/js/create-api-client.svg)](https://badge.fury.io/js/create-api-client) [![Build Status](https://travis-ci.org/minipai/create-api-client.svg?branch=master)](https://travis-ci.org/minipai/create-api-client) [![Greenkeeper badge](https://badges.greenkeeper.io/minipai/create-api-client.svg)](https://greenkeeper.io/) [![Coverage Status](https://coveralls.io/repos/github/minipai/create-api-client/badge.svg?branch=master)](https://coveralls.io/github/minipai/create-api-client?branch=master)

## Install

```
npm install create-api-client
```

## Usage

```
import { createClient } from 'create-api-client';

// create client
const getEndpoint = createClient("GET /api/endpoint/:id");

// request a fetch
getEndpoint({id: 1})
```

## How it works

`createClient` use `path-to-regex` to parse your path, find every segment of path which started with `:` and create an api client.

```
const postComment = createClient("POST /api/post/:postId/comment/:commentId");

```

The created api client would take the key which is path params (`postId`, `commentId`) from passed in object to build url to request to, and pass the rest to the fetch client.

If you prefix path with HTTP methods, the created api client would also pass it. So the following call

```
postComment({postId: 10, commentId: 100, body: {message: 1000}})
```

is same as

```
fetch("/api/post/10/comment/100", {method: "POST", body: {message: 1000}})
```

## License

MIT
