// Liskov Substitution principle

interface Glove {
  id: number,
}
interface RightHandedGlove extends Glove {
  _type: "Right Handed Glove"
}
interface LeftHandedGlove extends Glove {
  _type: "Left Handed Glove"
}

const rightHandedGlove = (id: number): RightHandedGlove => ({_type: "Right Handed Glove", id});
const leftHandedGlove = (id: number): LeftHandedGlove => ({_type: "Left Handed Glove", id});


const lakin = (glove: RightHandedGlove): boolean => {
  console.log(`lakin drops the ball with glove #${glove.id} which is a ${glove._type}!`);
  return false;
}

const russell = (glove: LeftHandedGlove): boolean => {
  console.log(`russell catches the ball with glove #${glove.id} which is a ${glove._type}!`);
  return true;
}

const patVenditte = (glove: Glove) => {
  console.log(`Pat Venditte catches the ball with glove #${glove.id}!`);
  return true;
}

const glove1 = rightHandedGlove(1);
const glove2 = leftHandedGlove(2);

const familyGloves: Array<Glove> = [glove1, glove2];
const rightHandedGloves: Array<RightHandedGlove> = [glove1];
const leftHandedGloves: Array<LeftHandedGlove> = [glove2];

// Lakin and Russell are not ambidextrous, so they can only use some of the gloves.
lakin(glove1);
russell(glove2);

// Pat Venditte is ambidextrous and can play with either hand.
patVenditte(glove1);
patVenditte(glove2);

// Because lakin and russell cannot play with the opposite glove, these are compile time errors.
// lakin(glove2);
// russell(glove1);


// Now let's say that we someone that says: We have some gloves to test, send us a player to test them.
//
// Note that they specify that the player must be neither left handed nor right handed, because they
// have both types of gloves.
const testGloves = (player: (glove: Glove) => boolean): Array<Glove> => {
  return familyGloves.filter(player);
}

// This means that neither lakin nor russell work for this test.
// console.log(testGloves(lakin));
// console.log(testGloves(russell));

// But pat venditte does! 
console.log(testGloves(patVenditte));



// however if we have a function that can test right Handed Gloves, then lakin and pat work
// But not russell
const testRightGloves = (player: (glove: RightHandedGlove) => boolean): Array<Glove> => {
  return rightHandedGloves.filter(player);
}

console.log(testRightGloves(lakin));
console.log(testRightGloves(russell));
console.log(testRightGloves(patVenditte));
