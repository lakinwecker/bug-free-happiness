import { Semigroup, concatAll, struct, min, max} from "fp-ts/Semigroup"
import { SemigroupAny } from "fp-ts/boolean"
import { SemigroupSum, SemigroupProduct } from "fp-ts/number"
import { getMonoid } from 'fp-ts/Array'
import { contramap } from 'fp-ts/Ord'
import { Ord } from 'fp-ts/number'


const sum = concatAll(SemigroupSum);
console.log(sum(0)([1, 2, 3, 4, 5]))

const product = concatAll(SemigroupProduct);
console.log(product(1)([1, 2, 3, 4, 5]))



interface Customer {
  name: string
  favouriteThings: Array<string>
  registeredAt: number // since epoch
  lastUpdated: number // since epoch
  hasMadePurchase: boolean // since epoch
}


const mergeCustomer : Semigroup<Customer> = struct({
  name: max(contramap((s: string) => s.length)(Ord)),
  favouriteThings: getMonoid<string>(),
  registeredAt: min(Ord),
  lastUpdated: max(Ord),
  hasMadePurchase: SemigroupAny,
})


console.log(mergeCustomer.concat({
  name: 'Giulio',
  favouriteThings: ['math', 'climbing'],
  registeredAt: new Date(2018, 1, 20).getTime(),
  lastUpdated: new Date(2018, 2, 18).getTime(),
  hasMadePurchase: false,
}, {
  name: 'Giulio Canti',
  favouriteThings: ['functional programming'],
  registeredAt: new Date(2018, 1, 22).getTime(),
  lastUpdated: new Date(2018, 2, 9).getTime(),
  hasMadePurchase: true,
}))

