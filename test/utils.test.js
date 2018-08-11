// @flow
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */

import {
  toSnakeCase,
  toCamelCase,
  isLowerCase,
  isUpperCase,
  objToSnakeCase,
  objToCamelCase
} from '../src/utils'

declare var describe: any
declare var it: any
declare var expect: any

describe('Utils', () => {
  describe('isLowerCase', () => {
    it('should handle these known cases', () => {
      expect(isLowerCase('somestring')).toBe(true)
      expect(isLowerCase('SomeString')).toBe(false)
      expect(isLowerCase('')).toBe(false)
    })
  })

  describe('isUpperCase', () => {
    it('should handle these known cases', () => {
      expect(isUpperCase('somestring')).toBe(false)
      expect(isUpperCase('SomeString')).toBe(true)
      expect(isUpperCase('')).toBe(true)
    })
  })

  describe('toSnakeCase', () => {
    it('should handle these known cases', () => {
      expect(toSnakeCase('someString')).toBe('some_string')
      expect(toSnakeCase('SomeString')).toBe('some_string')
      expect(toSnakeCase('editor1StateDraft')).toBe('editor_1_state_draft')
    })
  })

  describe('toCamelCase', () => {
    it('should handle these known cases', () => {
      expect(toCamelCase('some_string')).toBe('someString')
      expect(toCamelCase('some_string_S')).toBe('someStringS')
      expect(toCamelCase('editor_1_state_draft')).toBe('editor1StateDraft')
    })
  })

  describe('objToSnakeCase', () => {
    it('should handle these known cases', () => {
      const obj = {
        someKey: 'someValue',
        anotherKeyInCamelCase: 'anotherValue'
      }
      const res: Object = objToSnakeCase(obj)
      expect(res.some_key).toBeDefined()
      expect(res.another_key_in_camel_case).toBeDefined()
      expect(res.some_key).toBe('someValue')
      expect(res.another_key_in_camel_case).toBe('anotherValue')
    })
  })

  describe('objToCamelCase', () => {
    it('should handle these known cases', () => {
      const obj = {
        some_key: 'someValue',
        another_key_in_snake_case: 'anotherValue'
      }
      const res: Object = objToCamelCase(obj)
      expect(res.someKey).toBeDefined()
      expect(res.anotherKeyInSnakeCase).toBeDefined()
      expect(res.someKey).toBe('someValue')
      expect(res.anotherKeyInSnakeCase).toBe('anotherValue')
    })
  })
})
