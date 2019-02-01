import Type from '../src/entities/Type';
import ValueType from '../src/entities/ValueType';

describe('Literal Type', () => {
  test('Ok types', () => {
    expect(() => new ValueType('StringLiteral', 'abc')).not.toThrow();
    expect(() => new ValueType('NumericLiteral', 123)).not.toThrow();
    expect(() => new ValueType('BooleanLiteral', true)).not.toThrow();
  });

  // test('Wrong Types', () => {
  //   expect(() => new ValueType('abc', 123)).toThrow();
  // });

  // TODO: test values

  test('Subtype', () => {
    // TODO: more tests
    expect(new ValueType('NumericLiteral', 123).isSubtype(new Type('Number'))).toBe(true);
  });

  // test('Build Annotation', () => {
  //   // TODO: more tests
  // });
});
