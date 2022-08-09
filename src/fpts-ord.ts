import { Eq } from 'fp-ts/Eq'
import { contramap } from 'fp-ts/Ord'


type Ordering = -1 | 0 | 1

interface Ord<A> extends Eq<A> {
  readonly compare: (sx: A, y: A) => Ordering
}


const ordNumber: Ord<number> = {
  equals: (x, y) => x === y,
  compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0)
}

function min<A>(O: Ord<A>): (x: A, y: A) => A {
  return (x, y) => (O.compare(x, y) === 1 ? y : x)
}


type User = {
  name: string
  age: number
}

const byAge: Ord<User> = contramap((user: User) => user.age)(ordNumber)

const getYounger = min(byAge);

console.log(getYounger({name: "andrew", age: 105}, {name: "Lakin", age: 405}))
