import { parse, compile } from 'path-to-regexp'

type Params = {
  method?: string
  [key: string]: any
}

type Helper = (params: Object) => [string, Params]

const createHelper = (path: string): Helper => {
  const namedParams = parse(path)
    .map((p: any) => p.name)
    .filter(n => n)

  const methodRegex = new RegExp('^(GET|POST|PUT|PATCH|DELETE|HEAD)')
  const methodMatch = path.match(methodRegex)
  const method = (methodMatch && methodMatch[0]) || 'GET'
  const targetPath = path.replace(methodRegex, '').trim()
  const toPath = compile(targetPath)

  return (params: any = {}) => {
    let url = toPath(params)
    if (params.query) {
      url = url + '?' + new URLSearchParams(params.query).toString()
    }
    const newParams: Params = Object.keys(params)
      .concat('query')
      .reduce<Params>((acc, key) => {
        if (namedParams.includes(key)) return acc
        acc[key] = params[key]
        return acc
      }, {})
    newParams.method = method

    return [url, newParams]
  }
}

export { createHelper }
