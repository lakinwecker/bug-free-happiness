
export type List<T> = {
  readonly prev: ReadonlyArray<T>,
  readonly current: T,
  readonly next: ReadonlyArray<T>,
}

export const asList = <T>({ prev, current, next }: List<T>): T[] => {
  return [...prev, current, ...next];
}

export const fromList = <T>(listOfT: T[], index: number): List<T> | undefined => {
  index = Math.max(0, Math.min(listOfT.length, index));
  const current = listOfT[index];
  if (current === undefined) return undefined;

  return {
    prev: listOfT.slice(0, index),
    current,
    next: listOfT.slice(index + 1, listOfT.length)
  };
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

export const append = <T>({ prev, current, next }: List<T>, element: T): List<T> => {
  return {
    prev,
    current,
    next: [...next, element]
  };
}

export const prepend = <T>({ prev, current, next }: List<T>, element: T): List<T> => {
  return {
    prev: [element, ...prev],
    current,
    next,
  };
}

export const map = <T, R>(z: List<T>, f: (t: T) => R): List<R> | undefined => {
  return fromList(asList(z).map(f), z.prev.length);
}

export const insert = <T>(z: List<T>, element: T, index: number): List<T> | undefined => {
  const l = asList(z);
  l.splice(index, 0, element);
  return fromList(l, z.prev.length);
}



// lift
// filter
// pop
// shift
// TODO:

