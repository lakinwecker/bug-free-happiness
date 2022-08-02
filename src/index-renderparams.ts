type Colour = { r: number, g: number, b: number, a: number };
type Point = { x: number, y: number, z: number };

type RenderParameters = {
  ambientFactor: number;
  specularFactor: number;
  phongExponent: number;
  lightColour: Colour;
  materialColour: Colour;
  lightPosition: Point
  generateNormals: boolean;
  perVertexColour: boolean;
  showWireFrame: boolean;
  wireFrameColour: Colour;
  wireFrameWidth: number;
};

const red: Colour = { r: 1.0, b: 0.0, g: 0.0, a: 1.0 };
const blue: Colour = { r: 0.0, b: 1.0, g: 0.0, a: 1.0 };
const green: Colour = { r: 0.0, b: 0.0, g: 1.0, a: 1.0 };
const white: Colour = { r: 1.0, b: 1.0, g: 1.0, a: 1.0 };
const black: Colour = { r: 0.0, b: 0.0, g: 0.0, a: 0.0 };
const defaultRenderParameters = {
  ambientFactor: 1.0,
  specularFactor: 1.0,
  phongExponent: 0.5,
  lightColour: white,
  materialColour: blue,
  lightPosition: { x: 1.0, y: 0.0, z: 2.0 },
  generateNormals: false,
  perVertexColour: true,
  showWireFrame: false,
  wireFrameColour: black,
  wireFrameWidth: 2.0,
};


class Builder<T extends {}> {
  private params: T;

  constructor(params: T) {
    this.params = params;
  }

  addAttribute<A extends {}>(newValues: A): Builder<T&A> {
    return new Builder<T&A>({...this.params, ...newValues});
  }

  get(): T {
    return this.params;
  }
};

const x = new Builder({first_name: "Lakin"}).addAttribute({last_name: "Wecker"}).get();
















// 1. Every value in the type has a default
// 2. You only have to specify the values that you want to change. 
// 3. You can't change the definition of this one
