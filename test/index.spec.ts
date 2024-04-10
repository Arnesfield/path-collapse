import { expect } from 'chai';
import { collapse } from '../src/index.js';

describe('collapse', () => {
  it('should be a function', () => {
    expect(collapse).to.be.a('function');
  });

  it('should return a collapsed result object', () => {
    const result = collapse([]);
    expect(result).to.be.an('object');
    expect(result).to.have.property('roots').to.be.an('object');
    expect(Object.getPrototypeOf(result.roots)).to.be.null;
    expect(result).to.have.property('descendants').to.be.an('object');
    expect(Object.getPrototypeOf(result.descendants)).to.be.null;
  });

  it('should collapse paths', () => {
    const result = collapse([
      'a',
      '/a',
      'a/b',
      '/a/b',
      '/a/b/..',
      'a/b/../../a/b'
    ]);
    // absolute and relative paths should be treated differently
    expect(result.roots).to.deep.equal({
      '/a': ['/a/b'],
      '/a/b/..': ['/a/b'],
      a: ['a/b', 'a/b/../../a/b']
    });
    expect(result.descendants).to.deep.equal({
      '/a/b': ['/a', '/a/b/..'],
      'a/b': ['a'],
      'a/b/../../a/b': ['a']
    });
  });

  it("should handle cases for '' and '.'", () => {
    const paths = ['a', '/a/b', 'a/b', '/a/bc', '/b/c', 'a/c'];
    const roots = { '/a/b': [], '/a/bc': [], '/b/c': [], a: ['a/b', 'a/c'] };
    const descendants = { 'a/b': ['a'], 'a/c': ['a'] };

    let result = collapse(paths.concat(''));
    expect(result.roots).to.deep.equal({ '': [], ...roots });
    expect(result.descendants).to.deep.equal(descendants);

    result = collapse(paths.concat('.'));
    expect(result.roots).to.deep.equal({ '.': [], ...roots });
    expect(result.descendants).to.deep.equal(descendants);

    result = collapse(paths.concat('', '.'));
    expect(result.roots).to.deep.equal({ '': [], '.': [], ...roots });
    expect(result.descendants).to.deep.equal(descendants);
  });

  it("should not collapse relative paths for '/'", () => {
    const result = collapse(['a', '/a', 'a/b', '/b/c', 'a/c', '/']);
    expect(result.roots).to.deep.equal({
      '/': ['/a', '/b/c'],
      a: ['a/b', 'a/c']
    });
    expect(result.descendants).to.deep.equal({
      '/a': ['/'],
      '/b/c': ['/'],
      'a/b': ['a'],
      'a/c': ['a']
    });
  });

  it('should handle exact duplicate paths', () => {
    const result = collapse(['a', 'a/b', 'a', 'a/b']);
    expect(result.roots).to.deep.equal({ a: ['a/b'] });
    expect(result.descendants).to.deep.equal({ 'a/b': ['a'] });
  });
});
