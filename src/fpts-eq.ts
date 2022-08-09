import { Eq, struct } from 'fp-ts/Eq'
//import { getEq } from 'fp-ts/Array'

const eqNumber: Eq<number> = {
  equals: (x, y) => x === y
}

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
  return (a, as) => as.some(item => E.equals(item, a))
}

//console.log(elem(eqNumber)(1, [1, 2, 3]))
//console.log(elem(eqNumber)(4, [1, 2, 3]))


type Point = {
  x: number
  y: number
}

const eqPoint: Eq<Point> = struct({
  x: eqNumber,
  y: eqNumber,
})

console.log(elem(eqPoint)({x: 1, y: 1}, [{x: 1, y: 2}, {x: 3, y: 3}]))

//const eqArrayOfPoints: Eq<Array<Point>> = getEq(eqPoint);
