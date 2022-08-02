import { pipe } from "fp-ts/function"

export type List<T> = {
  readonly prev: ReadonlyArray<T>,
  readonly current: T,
  readonly next: ReadonlyArray<T>,
}

export const asList = <T>({ prev, current, next }: List<T>): T[] => {
  return [...prev, current, ...next];
}

export const fromList = <T>(index: number) => (listOfT: T[]): List<T> | undefined => {
  index = Math.max(0, Math.min(listOfT.length, index));
  const current = listOfT[index];
  if (current === undefined) return undefined;

  return {
    prev: listOfT.slice(0, index),
    current,
    next: listOfT.slice(index + 1, listOfT.length)
  };
}

const fromListAsList = <T>(index: number) => (listOfT: T[]): List<T> => {
  if (listOfT.length === 0) {
    throw Error(".....");
  }
  return fromList(index)(listOfT) as List<T>;
}


export const next = <T>(z: List<T>): List<T> => {
  const [nextT, ...rest] = z.next;
  if (nextT === undefined) {
    return z;
  }
  return {
    prev: [...z.prev, z.current],
    current: nextT,
    next: [...rest],
  }
};

export const prev = <T>(z: List<T>): List<T> => {
  const nextT = z.prev[z.prev.length - 1];
  const prev = z.prev.slice(0, z.prev.length - 1);
  if (nextT === undefined) {
    return z;
  }
  return {
    prev: [...prev],
    current: nextT,
    next: [z.current, ...z.next],
  }
};

export const append = <T>(element: T) => ({ prev, current, next }: List<T>): List<T> => {
  return {
    prev,
    current,
    next: [...next, element]
  };
}

export const prepend = <T>(element: T) => ({ prev, current, next }: List<T>): List<T> => {
  return {
    prev: [element, ...prev],
    current,
    next,
  };
}

export const map = <T, R>(z: List<T>, f: (t: T) => R): List<R> => {
  return fromListAsList<R>(z.prev.length)(asList(z).map(f));
}

export const insert = <T>(z: List<T>, element: T, index: number): List<T> => {
  const l = asList(z);
  l.splice(index, 0, element);
  return fromListAsList<T>(z.prev.length)(l);
}

export const filter = <T>(predicate: (t: T) => boolean) => (l: List<T>): List<T> | undefined => {
  return pipe(
    l,
    asList,
    (l) => l.filter(predicate),
    fromList(l.prev.length)
  );
}

// 
export type HasEquals<T> = {
  equals: (t1: T, t2: T) => boolean;
}

export const find = <T>(equalityTester: HasEquals<T>) => (needle: T) => (l: List<T>): number => {
  const list = pipe(
    l,
    asList
  );

  for(let i = 0; i < list.length; ++i) {
    const element = list[i];
    if (element !== undefined) {
      if (equalityTester.equals(needle, element)) {
        return i;
      }
    }
  }
  return -1;
}

// filter
// lift
// filter
// pop
// shift

