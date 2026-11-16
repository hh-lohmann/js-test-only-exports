###### Concept


# Provide access to not exported JavaScript functions for testing

*[hh.lohmann &lt;hh.lohmann@gmail.com&gt;](mailto:hh.lohmann@gmail.com?subject=js-test-only-exports)*

<!-- see https://hh-lohmann.github.io/github-readme-pages-switch -->
<p align="center" id="github_readme_pages_switch" style="display:none;">
  <b><i>This page may be displayed more optimal in its
  <a href="https://hh-lohmann.github.io/js-test-only-exports">GitHub Pages view</a>
  </i></b>
</p>


Use the generalized special export

```js
export const testOnlyExports=()=>Object.freeze({
  // comma seprated list of functions to provide access to
})
```

e.g. as in

```js
export const testOnlyExports=()=>Object.freeze({
  _someNotExportedFunction, _anotherNotExportedFunction
})
```

to access e.g. `_someNotExportedFunction` by a destructuring declaration as in

```js
import { testOnlyExports } from '...path...'
const { _someNotExportedFunction } = testOnlyExports()
assert(
  _someNotExportedFunction()==='...expected return...'
)
```

or by an expression as in

```js
import { testOnlyExports } from '...path...'
assert(
  testOnlyExports()[ '_someNotExportedFunction' ]()==='...expected return...'
)
```


## Derivation

Giving unit testing access to not exported / not exposed / internal functions can be done by a generalized special export that returns references to such functions so that e.g.

```js
const _someNotExportedFunction = function(arg='this'){ return 'first ' + arg }
const _anotherNotExportedFunction = function(arg='that'){ return 'then ' + arg }
```

can be provided by a generalized special export

```js
export const generalizedExport=function(toExport){
  // Implementation details ...
}
```

to be used as

```js
import {generalizedExport} from './../index.js'
const _someNotExportedFunction=generalizedExport('_someNotExportedFunction')
const _anotherNotExportedFunction=generalizedExport('_anotherNotExportedFunction')
```

in tests like

```js
if(_someNotExportedFunction()!=='first this'){
  console.log('_someNotExportedFunction: Unexpected value')
}

if(_anotherNotExportedFunction()!=='then that'){
  console.log('_anotherNotExportedFunction: Unexpected value')
}

if(_someNotExportedFunction('else')!=='first else'){
  console.log('_someNotExportedFunction: Unexpected value')
}

if(_anotherNotExportedFunction('else')!=='first else'){
  console.log('_anotherNotExportedFunction: Unexpected value')
}
```

The most straightforward way to implement `generalizedExport` would be to get a name of a function (i.e. a string) and use `eval` to make it a reference to the addressed function and return this reference as in

```js
export const generalizedExport=function(toExport){
  return eval(toExport)
}
```

The known pitfalls of `eval` could be handled by rejecting executable code as in

```js
export const generalizedExport=function(toExport){
  // Security check: only valid names => no executable code
  if(!/^\w+$/.test(toExport)) throw Error('generalizedExport: Illegal function name passed')
  // Security check: only functions, no (really) mutable objects
  if(typeof eval(toExport)!=='function') throw Error(`generalizedExport: "${toExport}" is not a function`)
  return eval(toExport)
}
```

but problems arise for restricting `generalizedExport` to exist only in testing / dev environments (and not in production code) by the most straightforward way which is bundling with [tree shaking](#wikipedia-tree-shaking): since `eval` could e.g. access any function at runtime it is not possible at build time to detect which functions are  unused and therefore could be "bundled out" / "shaken out", so bundlers will fall back to just concatenating all input files unchanged into one big output file including `generalizedExport` (cf. [Rollup](#rollup-avoiding-eval), [Rolldown](#rolldown-avoiding-direct-eval), [esbuild](#esbuild-avoid-direct-eval-when-bundling) - note here that a "bundler-friendly" [indirect eval](#mdn-direct-and-indirect-eval) as well as trying around with the [Function constructor](#mdn-difference-between-function-constructor-and-function-declaration) would not be able to access anything in module [scope](#mdn-scope) so that also `generalizedExport` could not access anything).

Playing well with bundling / tree shaking is literally referencing the functions that should be provided, i.e. manually "registering" them as in

```js
export const generalizedExport=function(toExport){
  const registered={
    _someNotExportedFunction:_someNotExportedFunction,
    _anotherNotExportedFunction:_anotherNotExportedFunction
  }
  return registered[toExport]
}
```

that can be implemented more concise by replacing an explicit `registered` object with destructuring it from the current local / module scope and returning it and an access to a key of it via the `toExport` variable as in

```js
export const generalizedExport=function(toExport){
  return {
    _someNotExportedFunction,
    _anotherNotExportedFunction
  }[toExport]
}
```

what can be expressed even more succinct by an arrow function as in

```js
export const generalizedExport=(toExport)=>({
  _someNotExportedFunction,
  _anotherNotExportedFunction
}[toExport])
```

Note the importance of parentheses to let the interpreter know that the curly braces mark an object to construct and not a function body (that would return nothing without an explicit "return" statement in it).

But destructuring could also help for more concise code at usage if `generalizedExport` is not implemented as a function returning a value for an object key with doubling e.g. `_anotherNotExportedFunction` as the argument as well as the name for the result of the function as in `const _someNotExportedFunction=generalizedExport('_someNotExportedFunction')` but as returning the object itself like in

```js
export const generalizedExport=>()=>({
  _someNotExportedFunction,
  _anotherNotExportedFunction
})
```

to be used by calling this function and destructuring from its result as in

```js
import { generalizedExport } from './../index.js'
const { _someNotExportedFunction } = generalizedExport()
const { _anotherNotExportedFunction } = generalizedExport()
```

or

```js
import { testOnlyExports } from './../index.js'
const {
  _someNotExportedFunction,
  _anotherNotExportedFunction
} = generalizedExport()
```

in tests like

```js
if(_someNotExportedFunction()!=='first this'){
  console.log('_someNotExportedFunction: Unexpected value')
}

if(_anotherNotExportedFunction()!=='then that'){
  console.log('_anotherNotExportedFunction: Unexpected value')
}
```

or with function expressions as

```js
if(generalizedExport()['_someNotExportedFunction']()!=='first this'){
  console.log('_someNotExportedFunction: Unexpected value')
}

if(generalizedExport()['_anotherNotExportedFunction']()!=='then that'){
  console.log('_anotherNotExportedFunction: Unexpected value')
}
```

A plain object returned by `generalizedExport` could be changed after importing as in

```js
const myTestImports = generalizedExport();
// changing a key
console.log( myTestImports['_someNotExportedFunction']() ) // => first this
myTestImports['_someNotExportedFunction']=()=>'I changed ...'
console.log( myTestImports['_someNotExportedFunction']() ) // => I changed ...
// adding a key
myTestImports['_anAddedFunction']=()=>'I was added!'
console.log( myTestImports['_anAddedFunction']() ) // => I was added!
```

In reality mutations would surely be rare and unintended, but making the object returned by `generalizedExport` immutable can easily done by [freezing](#mdn-objectfreeze) it as in

```js
export const generalizedExport=()=>Object.freeze{
  _someNotExportedFunction,
  _anotherNotExportedFunction
}
```

so that processes that would mutate it will be rejected as in

```js
myTestImports['_someNotExportedFunction']=()=>'I changed ...'
// => TypeError: ... assign to read only property ...
myTestImports['_anAddedFunction']=()=>'I was added!'
// => TypeError: ... object is not extensible ...
```

(exact error message depending on current JavaScript engine)

Note finally that the approach reached here of course resembles ordinary [namespace imports](#mdn-namespace-import), replacing a file from which an object of references is created by `export` statements with a dedicated object of references.

* NB: Destructuring from the current scope (local / module / global) works by the fairly undocumented / implicit behavior of the [destructuring syntax](#mdn-destructuring) to use the current scope as default for the right-hand side of a destructuring statement if no explicit right-hand side is given. A function like `_someNotExportedFunction` is more or less a property of the local scope with key name "_someNotExportedFunction" so that the destructuring assignment `( { _someNotExportedFunction } )` means to construct an object with a property referring to `_someNotExportedFunction` in local scope, resulting in an object `{ _someNotExportedFunction: _someNotExportedFunction } ` where the key name "_someNotExportedFunction" is the key name of `_someNotExportedFunction` in local scope and the value "_someNotExportedFunction" is again this key name in local scope, but now not representing itself but that what it points to, i.e. the definition of the function named "_someNotExportedFunction". You can make this transparent in a browser's dev console with
  ```js
    // outputs as in Chromium based browsers, "ƒ" = "function code"
    const test={parseInt}
    console.log(test)             // => { parseInt: ƒ }

    console.log(test['parseInt']) // => parseInt() { [native code] }
    console.log(parseInt)         // => parseInt() { [native code] }

    console.log(test['parseInt']('42.1')) // => 42
    console.log(parseInt('42.1'))         // => 42
  ```


## Restrict callability

If you cannot or don't want to rely on `testOnlyExports` being tree shaken out as dev only you may explicitly restrict its availability by simply using a [ternary](#mdn-conditional-ternary-operator) to apply a rejection condition as in


```js
export const testOnlyExports=()=>...condition...?{}:Object.freeze({
  // ...
})
```

so that `testOnlyExports` will return an empty object if the rejection condition is met, e.g. if you want to assure that `testOnlyExports` is only callable from explicit test files ending in `.test.js` and run by Node / Bun or anything based on Node / Bun or any other JavaScript runtime that exposes a `process` variable with an `argv` property like in

```js
export const testOnlyExports=()=>!process||!process.argv[1].endsWith('.test.js')?{}:Object.freeze({
  // ...
})
```

Note that you always should return an object to avoid breaking type checking, and depending on your concrete condition some additional TypeScript gymnastics may be required.


## Additional benefits

Since testOnlyExports can be used also for actually exposed functions like

```js
export const reallyExported = function(arg='really'){ return 'now ' + arg }
export const testOnlyExports=()=>Object.freeze({
  reallyExported
})```

as in

```js
const {reallyExported}=testOnlyExports()
if(reallyExported()!=='now really') console.log('...')
if(reallyExported('actually')!=='now actually') console.log('...')
```

and for iterating over all "contained" functions as in

```js
const minLength=11
Object.keys(testOnlyExports()).forEach(definedFunction=>{
  if(testOnlyExports()[definedFunction]().length<minLength){
    console.log(`"${definedFunction}" returned string with less than ${minLength} characters`)
  }
})
// => "reallyExported" returned string with less than 11 characters
```

it may additionally allow for more reusable testing code blocks.



## References

### esbuild: Avoid direct eval when bundling
* <https://esbuild.github.io/content-types/#direct-eval>

### MDN: Conditional (ternary) operator
* <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator>

### MDN: Destructuring
* <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring>

### MDN: Direct and indirect eval
* <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#direct_and_indirect_eval>

### MDN: Difference between Function constructor and function declaration
* <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#difference_between_function_constructor_and_function_declaration>

### MDN: Namespace import
* <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#namespace_import>

### MDN: Object.freeze()
* <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze>

### MDN: Tree shaking
* <https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking>

### MDN: Scope
* <https://developer.mozilla.org/en-US/docs/Glossary/Scope>

### Rolldown: Avoiding Direct eval
* <https://rolldown.rs/guide/troubleshooting#avoiding-direct-eval>

### Rollup: Avoiding eval
* <https://rollupjs.org/troubleshooting/#avoiding-eval>

### Wikipedia: Module bundler
* <https://en.wikipedia.org/wiki/Module_bundler>

### Wikipedia: Tree shaking
* <https://en.wikipedia.org/wiki/Tree_shaking>


<!-- see https://hh-lohmann.github.io/html-endspacer -->
<p id="endspacer" data-version="0.2.0" title="Endspacer - helps to align scrolling and positioning link targets | Scroll up to content or click / touch to jump to page top" align="center"><a href="#top"><img alt="Endspacer: './markdown-assets/endspacer.png' missing - see https://hh-lohmann.github.io/html-endspacer" src="./markdown-assets/endspacer.png" height="1000" width="100%"><br>[top]</a></p>
