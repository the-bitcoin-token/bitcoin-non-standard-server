// @flow
/* eslint no-plusplus: "off" */

export const isLowerCase = (string: string): boolean =>
  string === string.toLowerCase() && string !== string.toUpperCase()

export const isUpperCase = (string: string): boolean => !isLowerCase(string)

export const toSnakeCase = (string: string): string => {
  let i = 0
  // initialize i to the number of leading underscores
  while (string[i] === '_') i++
  // skip to the end of the underscores
  let res = string.slice(0, i)
  res += string[i++].toLowerCase()
  while (i < string.length) {
    res +=
      isUpperCase(string[i]) && i > 0
        ? `_${string[i].toLowerCase()}`
        : string[i]
    i += 1
  }
  return res
}

export const toCamelCase = (string: string): string => {
  let i = 0
  // initialize i to the number of leading underscores
  while (string[i] === '_') i++
  // skip to the end of the underscores
  let res = string.slice(0, i)
  while (i < string.length) {
    res += string[i] === '_' ? string[++i].toUpperCase() : string[i]
    i += 1
  }
  return res
}

export const objToSnakeCase = (obj: Object): Object => {
  const newObj = {}
  Object.entries(obj).forEach(([key, value]) => {
    newObj[toSnakeCase(key)] = value
  })
  return newObj
}

export const objToCamelCase = (obj: Object): Object => {
  const newObj = {}
  Object.entries(obj).forEach(([key, value]) => {
    newObj[toCamelCase(key)] = value
  })
  return newObj
}
