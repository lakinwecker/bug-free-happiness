type NotStarted = { __tag: "notstarted" };
type InProgress<P> = { __tag: "inprogress", progress: P };
type HasError<E> = { __tag: "error", error: E };
type Completed<V> = { __tag: "completed", value: V };

type Optimize<P, E, V> =
  | NotStarted
  | InProgress<P>
  | HasError<E>
  | Completed<V>;

const notStarted: NotStarted = { __tag: "notstarted" };
const inProgress = <P>(progress: P): InProgress<P> => {
  return { __tag: "inprogress", progress };
};
const completed = <V>(value: V): Completed<V> => {
  return { __tag: "completed", value };
};
const hasError = <E>(error: E): HasError<E> => {
  return { __tag: "error", error };
};

const isNotStarted = <P, E, V>(o: Optimize<P, E, V>): o is NotStarted => { return o.__tag === "notstarted"; }
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

type PartialCompleteMatch<P, E, V, R> = Partial<CompleteMatch<P, E, V, R>>;


type PartialMatchWithDefault<P, E, V, R> = {
  defaultF: () => R,
} & PartialCompleteMatch<P, E, V, R>;

type Match<P, E, V, R> =
  | PartialMatchWithDefault<P, E, V, R>
  | CompleteMatch<P, E, V, R>;


const isComplete = <P, E, V, R>(m: Match<P, E, V, R>): m is CompleteMatch<P, E, V, R> => {
  return Boolean(m.completedF) && Boolean(m.errorF) && Boolean(m.inProgressF) && Boolean(m.notStartedF);
}

const match = <P, E, V, R>(
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
    else if (isCompleted(o) && matcher.completedF) return matcher.completedF(o.value);
    return matcher.defaultF();
  }
}


// TODO: Let's make a slightly more realistic example

type OptimizeError = string;
type Progress = number;
type Route = string[];

type OptimalRoute = Optimize<Progress, OptimizeError, Route>;

// not started
const form = () => { console.log("Show Starting Form"); }

// error
const errorView = (e: OptimizeError) => {
  console.error(`Received Error: ${e}`);
  form();
}

// in progress
const inProgressView = (p: Progress) => {
  console.log(`... Progress: ${p}`);
}
// completed
const completeView = (r: Route) => {
  r.map(console.log)
}

const o: OptimalRoute = hasError("We got some error");

match({
  notStartedF: form,
  errorF: errorView,
  inProgressF: inProgressView,
  completedF: completeView
})(o);
