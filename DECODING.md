## Decoding Variable Length Quantity for Source Maps

This is the first article in a series on source maps. We will be building an app to show the mapping between some TypeScript code and the compiled JavaScript using source maps. In order to understand exactly how everything works, instead of using libraries like [`source-map`](https://www.npmjs.com/package/source-map) or [`vlq`](https://www.npmjs.com/package/vlq), we will write our own decoded and parser from scratch!

The main resources I used when learning about source maps were:

- [Source Map Visualizer](https://sokra.github.io/source-map-visualization/) by Tobias Koppers of Webpack fame
- [Source Map Visualizer](https://evanw.github.io/source-map-visualization/) by Evan Wallace of Figma fame
- [VLQ Source Code](https://github.com/Rich-Harris/vlq) by Rich Harris of Rollup fame
- [The actual "standard" documentation](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.djovrt4kdvga) which is actually just a Google doc - turns out there is no official "spec" as such
- [Wikipedia Base64 article](https://en.wikipedia.org/wiki/Base64#Base64_table)
- [Wikipedia VLQ article](https://en.wikipedia.org/wiki/Variable-length_quantity)

## What is a Source Map?

Let's say we have this TypeScript code:

```ts
const greet = (name: string) => {
  return `Hello ${name}`
}
```

If you compile it and ask for a source map with `yarn tsc greet.ts --sourceMap`, you get both the compiler JavaScript (`greet.js`):

```js
var greet = function (name) {
    return "Hello " + name;
};
//# sourceMappingURL=greet.js.map
```

and the source map (`greet.js.map`):

```js
{
  "version": 3,
  "file": "greet.js",
  "sourceRoot": "",
  "sources": [
    "greet.ts"
  ],
  "names": [],
  "mappings": "AAAA,IAAM,KAAK,GAAG,UAAC,IAAY;IACzB,OAAO,WAAS,IAAM,CAAA;AACxB,CAAC,CAAA"
}
```

The main thing we are interested in is `mappings`: `"AAAA,IAAM,KAAK,GAAG,UAAC,IAAY;IACzB,OAAO,WAAS,IAAM,CAAA;AACxB,CAAC,CAAA"`. This incredibly compat jumble of letters tells us that `var` in `greet.js` corresponds to `const` in `greet.ts`, as well as how the rest of it maps up... if we can decode it. 

## Varible Length Quantity

These letters are variable length quantity - a very concise way of encoding large numbers. To hint at where this is all leading, if you decode `AAAA`, you get an array of numbers: `[0, 0, 0, 0]`. `IAAM` gives us `[4, 0, 0, 6]`. The next article will go in depth on what each of these numbers means, but basically they map a row and column in the compiled JavaScript to the original TypeScript:

source-maps-1

This brings us to the goal of this post: decoding the VLQs to arrays of numbers.

## Segments, Fields and Base 64

The `mappings` property has many segments, divided up by `,`. Each one has several fields. `AAAA` maps to `[0, 0, 0, 0]` - which has four fields. Each line is separated by a `;`. Our mappings field has two `;` - three lines total, which matches up to the compiled JavaScript. The source map always maps from the compiled code to the original code - not the other way around. This means the number of lines represented in the source map will always be the same as the number of lines in the compiled code.

What we are dealing with are base 64 encoded VLQs. According to the standard:

> The VLQ is a Base64 value, where the most significant bit (the 6th bit) is used as the continuation bit, and the “digits” are encoded into the string least significant first, and where the least significant bit of the first digit is used as the sign bit.



