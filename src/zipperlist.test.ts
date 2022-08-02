import * as Z from "./zipperlist"
import { pipe } from "fp-ts/function"

const defaultList = (): Z.List<number> => {
  return { prev: [], current: 1, next: [2, 3, 4] };
}

test('Test append/prepend', () => {
  const l = defaultList();
  expect(
    pipe(
      l,
      Z.asList,
    )
  ).toStrictEqual([1, 2, 3, 4])
  expect(
    pipe(
      l,
      Z.prepend(0),
      Z.asList
    )
  ).toStrictEqual([0, 1, 2, 3, 4])


  expect(
    pipe(
      l,
      Z.append(5),
      Z.asList
    )
  ).toStrictEqual([1, 2, 3, 4, 5])

  expect(
    pipe(
      l,
      Z.prepend(0),
      Z.append(5),
      Z.asList
    )
  ).toStrictEqual([0, 1, 2, 3, 4, 5])
});

test('Test insert', () => {
  const l = defaultList();
  expect(Z.asList(l)).toStrictEqual([1, 2, 3, 4])

  const l2 = Z.insert(l, 100, 0);
  expect(Z.asList(l2)).toStrictEqual([100, 1, 2, 3, 4])

  const l3 = Z.insert(l, 100, 1);
  expect(Z.asList(l3)).toStrictEqual([1, 100, 2, 3, 4])

  const l4 = Z.insert(l, 100, 3);
  expect(Z.asList(l4)).toStrictEqual([1, 2, 3, 100, 4])

  const l5 = Z.insert(l, 100, 4);
  expect(Z.asList(l5)).toStrictEqual([1, 2, 3, 4, 100])

  const l6 = Z.insert(l, 100, 6);
  expect(Z.asList(l6)).toStrictEqual([1, 2, 3, 4, 100])

  //console.log(Z.insert(l, 100, 2));
  //console.log(Z.insert(l, 100, 4));
  //console.log(Z.insert(l, 100, 23456789));
  //console.log(Z.insert(l, 100, -234));
});

test('Test next', () => {
  const l = defaultList();
  expect(l.current).toBe(1);
  const l2 = Z.next(l);
  expect(l2.current).toBe(2);
  const l3 = Z.next(l2);
  expect(l3.current).toBe(3);
  const l4 = Z.next(l3);
  expect(l4.current).toBe(4);
  const l5 = Z.next(l4);
  expect(l5.current).toBe(4);
  const l6 = Z.next(l5);
  expect(l6.current).toBe(4);
});

test('Test prev', () => {
  const l = defaultList();
  expect(l.current).toBe(1);
  const l2 = Z.next(l);
  expect(l2.current).toBe(2);
  const l3 = Z.prev(l2);
  expect(l3.current).toBe(1);
  const l4 = Z.prev(l3);
  expect(l4.current).toBe(1);
});

test('Test filter', () => {
  const l = defaultList();
  const l2 = Z.filter((i: number) => i % 2 == 0)(l);
  if (l2 !== undefined) {
    expect(Z.asList(l2)).toStrictEqual([2, 4])
  } else {
    // If we get here, the test failed.
    expect(false).toStrictEqual(true);
  }

  const l3 = Z.filter((_: number) => false)(l);
  expect(l3).toStrictEqual(undefined);

});


const numberEquality: Z.HasEquals<number> = {
  equals: (n1: number, n2: number) => n1 === n2
}

test('Test find with numbers', () => {
  const l = defaultList();
  expect(Z.find(numberEquality)(1)(l)).toBe(0);
  expect(Z.find(numberEquality)(2)(l)).toBe(1);
  expect(Z.find(numberEquality)(3)(l)).toBe(2);
  expect(Z.find(numberEquality)(4)(l)).toBe(3);
  expect(Z.find(numberEquality)(2345678)(l)).toBe(-1);
});


type User = {
  first_name: string
};
const userEquality: Z.HasEquals<User> = {
  equals: (u1: User, u2: User) => u1.first_name === u2.first_name
}
test('Test find with objects', () => {
  const lakin: User = {first_name: "Lakin"};
  const l: Z.List<User> = {prev: [], current: lakin, next: []};
  expect(Z.find(userEquality)({first_name: "Lakin"})(l)).toBe(0);
});

