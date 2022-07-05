type NotStarted = {__tag: "notstarted"};
type InProgress<P> = {__tag: "inprogress", progress: P};
type HasError<E> = {__tag: "error", error: E};
type Completed<V> = {__tag: "completed", value: V};

type Optimize<P, E, V> = 
  | NotStarted
  | InProgress<P>
  | HasError<E>
  | Completed<V>;

const notStarted: NotStarted = {__tag: "notstarted"};
const inProgress = <P>(progress: P): InProgress<P> => { 
  return { __tag: "inprogress", progress }; 
};
const completed = <V>(value: V): Completed<V> => {
  return { __tag: "completed", value }; 
};
const hasError = <E>(error: E): HasError<E> => {
  return { __tag: "error", error }; 
};

const isNotStarted = <P, E, V>(o: Optimize<P, E, V>): o is NotStarted => {
  return o.__tag === "notstarted";
}
const isInProgress = <P, E, V>(o: Optimize<P, E, V>): o is InProgress<P> => {
  return o.__tag === "inprogress";
}
const isCompleted = <P, E, V>(o: Optimize<P, E, V>): o is Completed<V> => {
  return o.__tag === "completed";
}
const isError = <P, E, V>(o: Optimize<P, E, V>): o is HasError<E> => {
  return o.__tag === "error";
}

type CompleteMatch<P, E, V, R> = {
  notStartedF: () => R,
  inProgressF: (p: P) => R,
  completedF: (v: V) => R,
  errorF: (e: E) => R
};

type PartialMatchWithDefault<P, E, V, R> = {
  defaultF: () => R,
  notStartedF?: () => R,
  inProgressF?: (p: P) => R,
  completedF?: (v: V) => R,
  errorF?: (e: E) => R
};

type Match<P, E, V, R> =
  | PartialMatchWithDefault<P, E, V, R>
  | CompleteMatch<P, E, V, R>;


const isComplete = <P, E, V, R>(m: Match<P, E, V, R>): m is CompleteMatch<P, E, V, R> => {
  return Boolean(m.completedF) && Boolean(m.errorF) && Boolean(m.inProgressF) && Boolean(m.notStartedF);
}

const match2 = <P, E, V, R>(
  matcher: Match<P, E, V, R>
) => (o: Optimize<P, E, V>): R => {
  if (isComplete(matcher)) {
    if (isNotStarted(o)) return matcher.notStartedF();
    else if (isInProgress(o)) return matcher.inProgressF(o.progress);
    else if (isError(o)) return matcher.errorF(o.error)
    else return matcher.completedF(o.value);
  } else {
    if (isNotStarted(o) && matcher.notStartedF) return matcher.notStartedF();
    else if (isInProgress(o) && matcher.inProgressF) return matcher.inProgressF(o.progress);
    else if (isError(o) && matcher.errorF) return matcher.errorF(o.error)
    else if(isCompleted(o) && matcher.completedF) return matcher.completedF(o.value);
    return matcher.defaultF();
  }
}

const o: Optimize<number, number, number> = completed(1.0);
match2({
  notStartedF: () => { return false; },
  inProgressF: (_: number) => { return false; },
  defaultF: () => false,
})(o);



const fold = <P, E, V, R>(
  notStartedF: () => R,
  inProgressF: (p: P) => R,
  completedF: (v: V) => R,
  errorF: (e: E) => R
) => (
  o: Optimize<P, E, V>
): R => {
  if (isNotStarted(o)) return notStartedF();
  else if (isInProgress(o)) return inProgressF(o.progress);
  else if (isError(o)) return errorF(o.error)
  else return completedF(o.value);
}

