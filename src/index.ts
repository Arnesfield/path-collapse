import path from 'path';

function sep(value: string) {
  return value + (value.endsWith(path.sep) ? '' : path.sep);
}

function obj<T extends Record<string, any>>() {
  return { __proto__: null } as unknown as T;
}

/** Collapsed paths. */
export interface Collapsed {
  /** Root paths mapped to descendant paths. */
  roots: { [path: string]: string[] };
  /** Descendant paths mapped to ancestor paths. */
  descendants: { [path: string]: string[] };
}

/**
 * Collapse paths that are part of another path.
 * @param paths The paths to collapse.
 * @returns The collapsed paths.
 */
export function collapse(paths: readonly string[]): Collapsed {
  const values = obj<{ [rPath: string]: Set<string> }>();
  const rPaths: string[] = [];
  // resolve paths first and avoid duplicates
  for (const value of paths) {
    const rPath = path.isAbsolute(value)
      ? path.resolve(value)
      : path.relative('', value) || '.';
    if (rPath in values) {
      values[rPath].add(value);
    } else {
      values[rPath] = new Set([value]);
      rPaths.push(rPath);
    }
  }

  const c: Collapsed = { roots: obj(), descendants: obj() };
  // sort resolved paths
  // NOTE: previous maybe undefined when length is 0
  // but since we loop through an empty array, it is not used
  let previous = rPaths.sort()[0];
  for (const current of rPaths) {
    const ancestor = sep(previous);
    const ancestors =
      ancestor === sep(current) // ancestor equals descendant
        ? null
        : sep(path.dirname(current)).startsWith(ancestor) // parent starts with ancestor
          ? values[previous]
          : ((previous = current), null); // set to previous
    // value is the consumer provided path
    for (const value of values[current]) {
      // always set new arrays. we can assume rPaths is always unique
      // thus the values list points to a unique path and would not
      // override existing properties
      if (ancestors) {
        // ancestors reuses the same array reference
        // make sure to create new reference
        c.descendants[value] = Array.from(ancestors);
      } else {
        c.roots[value] = [];
      }
    }
    // assume root object has a value since
    // ancestors set comes from the previous resolved path
    for (const value of ancestors || []) {
      c.roots[value].push(...values[current]);
    }
  }
  return c;
}

export default collapse;
