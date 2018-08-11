// @flow
/* eslint no-plusplus: "off" */

export const isLowerCase = (string: string) =>
  string === string.toLowerCase() && string !== string.toUpperCase()

export const isUpperCase = (string: string) => !isLowerCase(string)

export const toSnakeCase = (string: string) => {
  let res = string[0].toLowerCase()
  for (let i = 1; i < string.length; i += 1) {
    res +=
      isUpperCase(string[i]) && i > 0
        ? `_${string[i].toLowerCase()}`
        : string[i]
  }
  return res
}

export const toCamelCase = (string: string) => {
  let res = ''
  for (let i = 0; i < string.length; i += 1) {
    res += string[i] === '_' ? string[++i].toUpperCase() : string[i]
  }
  return res
}

export const objToSnakeCase = (obj: Object) => {
  const newObj = {}
  Object.entries(obj).forEach(([key, value]) => {
    newObj[toSnakeCase(key)] = value
  })
  return newObj
}

export const objToCamelCase = (obj: Object | string) => {
  if (typeof obj === 'string') return obj
  const newObj = {}
  Object.entries(obj).forEach(([key, value]) => {
    newObj[toCamelCase(key)] = value
  })
  return newObj
}
