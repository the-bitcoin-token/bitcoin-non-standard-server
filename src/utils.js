export const isLowerCase = str =>
  str === str.toLowerCase() && str !== str.toUpperCase()


export const isUpperCase = str => !isLowerCase(str)

export const toSnakeCase = (str) => {
  let res = str[0].toLowerCase()
  for (let i = 1; i < str.length; i++) {
    res += isUpperCase(str[i]) && i > 0
      ? '_' + str[i].toLowerCase()
      : str[i]
  }
  return res
}

export const toCamelCase = (str) => {
  let res = ''
  for (let i = 0; i < str.length; i++) {
    res += str[i] === '_'
      ? str[++i].toUpperCase()
      : str[i]
  }
  return res
}

export const objToSnakeCase = (obj) => {
  let newObj = {}
  Object.entries(obj).forEach(([key, value]) => {
    newObj[toSnakeCase(key)] = value
  })
  return newObj
}

export const objToCamelCase = (obj) => {
  let newObj = {}
  Object.entries(obj).forEach(([key, value]) => {
    newObj[toCamelCase(key)] = value
  })
  return newObj
}
