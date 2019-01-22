import { createHelper } from './create-helper'

type FetchClient = (params: Object) => any
type FetchMapping = { [endpoint: string]: FetchClient }
type PathMapping = { [endpoint: string]: string }
type WhatwgFetch = (url: string, params: Object) => any
type Config = {
  fetch: WhatwgFetch
}
type CreateFetchClient = (path: string, config?: Config) => FetchClient

interface CreateClient {
  (path: string, config?: Config): FetchClient
  config(config: Config): CreateClient
  map(pathMapping: PathMapping, config?: Config): FetchMapping
}

const create: CreateFetchClient = (path, config = { fetch: fetch }) => {
  const helper = createHelper(path)
  return (data: Object) => {
    const [url, params] = helper(data)

    return config.fetch(url, params)
  }
}

const map = (pathMapping: PathMapping, config: Config): FetchMapping => {
  return Object.keys(pathMapping).reduce<FetchMapping>((acc, endpoint) => {
    acc[endpoint] = create(pathMapping[endpoint], config)
    return acc
  }, {})
}

const config = (defaultOptions: Object): CreateClient => {
  return Object.assign(
    (path: string, options?: Config) => {
      const newOptions = Object.assign({}, defaultOptions, options)
      return create(path, newOptions)
    },
    {
      config: config,
      map: map
    }
  )
}

const createClient: CreateClient = Object.assign(create, {
  config: config,
  map: map
})

export { createClient }
