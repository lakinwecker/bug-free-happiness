
type ZipperList<T> = {
  readonly prev: ReadonlyArray<T>,
  readonly current: T,
  readonly next: ReadonlyArray<T>,
}

const asList = <T>({prev, current, next}: ZipperList<T>): T[] => {
  return [...prev, current, ...next];
}

const fromList = <T>(listOfT: T[], index: number): ZipperList<T> | undefined => {
  index = Math.max(0, Math.min(listOfT.length, index));
  const current = listOfT[index];
  if (current === undefined) return undefined;

  return {
    prev: listOfT.slice(0, index),
    current,
    next: listOfT.slice(index+1, listOfT.length)
  };
}


const next = <T>(z: ZipperList<T>): ZipperList<T> => {
  const [nextT, ...rest] = z.next;
  if (nextT === undefined) {
    return z;
  }
  return { prev: [...z.prev, z.current],
    current: nextT,
    next: [...rest],
  }
};

const prev = <T>(z: ZipperList<T>): ZipperList<T> => {
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

const append = <T>({prev, current, next}: ZipperList<T>, element: T): ZipperList<T> => {
  return {
    prev,
    current,
    next: [...next, element]
  };
}

const prepend = <T>({prev, current, next}: ZipperList<T>, element: T): ZipperList<T> => {
  return {
    prev: [element, ...prev],
    current,
    next,
  };
}

const map = <T, R>(z: ZipperList<T>, f: (t: T) => R): ZipperList<R> | undefined => {
  return fromList(asList(z).map(f), z.prev.length);
}

const insert = <T>(z: ZipperList<T>, element: T, index: number): ZipperList<T> | undefined => {
  const l = asList(z);
  l.splice(index, 0, element);
  return fromList(l, z.prev.length);
}



// lift
// filter
// pop
// shift
// TODO:

const l: ZipperList<number> = prepend(append({ prev: [], current: 1, next: [2, 3, 4] }, 5), 0);
console.log(l);
console.log(insert(l, 100, 0));
console.log(insert(l, 100, 1));
console.log(insert(l, 100, 2));
console.log(insert(l, 100, 4));
console.log(insert(l, 100, 23456789));
console.log(insert(l, 100, -234));
//console.log(prev(next(l)));
//console.log(next(next(l)));
//console.log(next(next(next(l))));
//console.log(next(next(next(next(l)))));
//console.log(prev(next(next(next(next(l))))));
//console.log(prev(prev(next(next(next(next(l)))))));
//console.log(prev(prev(prev(next(next(next(next(l))))))));
//console.log(prev(prev(prev(prev(next(next(next(next(l)))))))));
//console.log(
  //prev(
    //prev(
      //prev(prev(prev(next(next(next(next(l)))))))
    //)
  //)
//);

