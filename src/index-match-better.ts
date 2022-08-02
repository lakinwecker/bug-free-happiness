export type Answer<E, D> = RunningT | FailedT<E> | SolvedT<D>;

export const RunningKind = "running";
export const FailedKind = "failed";
export const SolvedKind = "optimized";
export type Kind = typeof RunningKind | typeof FailedKind | typeof SolvedKind;

export type RunningT = {
  kind: typeof RunningKind;
};

export const Running: RunningT = { kind: RunningKind };

export type FailedT<E> = {
  kind: typeof FailedKind;
  error: E;
};

export const Failed = <E>(error: E): FailedT<E> => {
  return {
    error,
    kind: FailedKind,
  };
};

export type SolvedT<D> = {
  kind: typeof SolvedKind;
  data: D;
};

export const Solved = <D>(data: D): SolvedT<D> => {
  return {
    data,
    kind: SolvedKind,
  };
};

export const isRunning = <E, D>(a: Answer<E, D>): a is RunningT =>
  a.kind == RunningKind;

export const isFailed = <E, D>(a: Answer<E, D>): a is FailedT<E> =>
  a.kind == FailedKind;

export const isSolved = <E, D>(a: Answer<E, D>): a is SolvedT<D> =>
  a.kind == SolvedKind;



class NeverError extends Error {
  constructor() {
    super("Unknown statte");
  }
}


type CallableT<ReturnT> = (...a: any[]) => ReturnT;

type HandlerT<ReturnT> = {
  [key: string]: CallableT<ReturnT>
};

type Foo = {kind: string};


class Builder<ReturnT, H extends HandlerT<ReturnT> = {}> {

  constructor(public handlers: H) {}

  addHandler<N extends HandlerT<ReturnT>>(n: N): Builder<ReturnT, H & N> {
    return new Builder({...this.handlers, ...n});
  }

    // H extends { "_": CallableT<ReturnT> }
    // V extends {kind: string}
    // V extends {kind: keyof H}
  performMatch<
    V extends (
      H extends { "_": CallableT<ReturnT> }
        ? {kind: string}
        : {kind: keyof H}
    )
  >(v: V): ReturnT {
    const handler = this.handlers[v.kind];
    if (handler !== undefined) {
      return handler(v);
    }
    const defaultHandler = this.handlers["_"];
    if (defaultHandler !== undefined) {
      return defaultHandler();
    }
    throw new NeverError();
  }
}

const s = Solved(1);
const r = Running;
const f = Failed("Unable to find solution");


const foo = <E, D>(a: Answer<E, D>) => {
  const b = new Builder({})
    .addHandler({"_": () => `default`})
    .addHandler({running: () => "running"})
    .addHandler({optimized: ({ data }) => `Solved(${data})`});

    console.log(b.performMatch(a));
}

console.log("-----------------");
foo(s);
foo(r);
foo(f);
console.log("-----------------");


