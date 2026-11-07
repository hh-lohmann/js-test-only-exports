###### Concept


# Provide access to not exported functions for testing by a generalized special export returning references to them

*[hh.lohmann &lt;hh.lohmann@gmail.com&gt;](mailto:hh.lohmann@gmail.com?subject=js-test-only-exports)*


Giving unit testing access to not exported / not exposed / internal functions can be done by a generalized special export that returns references to such functions, e.g. the not exported functions

```js
const _thisNotExported = function(arg='this'){ return 'first ' + arg }
const _thatNotExported = function(arg='that'){ return 'then ' + arg }
```

can be provided by a single generalized special export

```js
export const testOnlyExport=function(toExport){
  // Security check: only valid names => no executable code
  if(!/^\w+$/.test(toExport)) throw Error('testOnlyExport: Illegal function name passed')
  // Security check: only functions, no (really) mutable objects
  if(typeof eval(toExport)!=='function') throw Error(`testOnlyExport: "${toExport}" is not a function`)
  return eval(toExport)
}
```

to be used as

```js
import {testOnlyExport} from './../index.js';
const _thisNotExported=testOnlyExport('_thisNotExported');
const _thatNotExported=testOnlyExport('_thatNotExported');
```

in tests like

```js
if(_thisNotExported()!=='first this'){
  console.log('_thisNotExported: Unexpected',_thisNotExported())
}

if(_thatNotExported()!=='then that'){
  console.log('_thatNotExported: Unexpected',_thisNotExported())
}

if(_thisNotExported('else')!=='first else'){
  console.log('_thisNotExported: Unexpected',_thisNotExported('else'))
}

if(_thatNotExported('else')!=='first else'){
  console.log('_thatNotExported: Unexpected',_thatNotExported('else'))
}
```

Since this can be used also for actually exposed functions like

```js
export const reallyExported = function(arg='really'){ return 'now ' + arg }
```

as in

```js
const reallyExported=testOnlyExport('reallyExported');
if(reallyExported()!=='now really') console.log('...')
if(reallyExported('actually')!=='now actually') console.log('...')
```

and with variable functions names as in

```js
const toTest=['_thisNotExported','_thatNotExported','reallyExported']
const minLength=10
toTest.forEach(value=>{
  if(testOnlyExport(value)().length<minLength){
    console.log(`${value} returned string with less than ${minLength} characters`)
  }
})
```

it may additionally allow for simplified and uniform and therefore easier to reusable testing code.

Note that this does not expose which functions exist - functions to access must be exactly named, passing a non existing function name will throw a regular "is not defined" ReferenceError.

Note that this is of course not a replacement for "import" outside of dedicated tests since many things depend on the special way that "import" binds functions.
