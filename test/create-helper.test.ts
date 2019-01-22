import { createHelper } from '../src/create-api-client'

describe('#createHelper', () => {
  it('build url from params', () => {
    const path = '/post/:id'
    const getPost = createHelper(path)
    const [url, params] = getPost({ id: 3000 })
    expect(url).toBe('/post/3000')
  })
  it('extracts method from prefix, defaults to GET', () => {
    const getMethod = (client: Function) => {
      const [url, params] = client()
      return params.method
    }

    expect(getMethod(createHelper('/post'))).toBe('GET')
    expect(getMethod(createHelper('GET /post'))).toBe('GET')
    expect(getMethod(createHelper('POST /post'))).toBe('POST')
  })
  it('pass other paramas as it is', () => {
    const path = '/any/post'
    const client = createHelper(path)

    const data: { [key: string]: any } = { foo: 1, bar: 10 }
    const [url, params] = client(data)

    Object.keys(data).forEach(key => {
      expect(params[key]).toBe(data[key])
    })
  })
  it('flavor method on path', () => {
    const path = '/any/post'
    const client = createHelper(path)
    const data = { method: 'DELETE', foo: 1, bar: 10 }
    const [url, params] = client(data)

    expect(params.method).toBe('GET')
  })
  it('remove prop from params', () => {
    const path = '/any/post/:id'
    const client = createHelper(path)
    const data = { method: 'DELETE', id: 1, bar: 10 }
    const [url, params] = client(data)

    expect(params.id).toBe(undefined)
  })
})
