import Type from '../src/entities/Type';
import LiteralType from '../src/entities/LiteralType';

describe('Literal Type', () => {
  test('Ok types', () => {
    expect(() => new LiteralType('StringLiteral', 'abc')).not.toThrow();
    expect(() => new LiteralType('NumericLiteral', 123)).not.toThrow();
    expect(() => new LiteralType('BooleanLiteral', true)).not.toThrow();
  });

  test('Wrong Types', () => {
    expect(() => new LiteralType('abc', 123)).toThrow();
  });

  // TODO: test values

  test('Subtype', () => {
    // TODO: more tests
    expect(new LiteralType('NumericLiteral', 123).isSubtype(new Type('Number'))).toBe(true);
  });

  // test('Build Annotation', () => {
  //   // TODO: more tests
  // });
});
