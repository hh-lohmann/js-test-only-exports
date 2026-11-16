// @ts-check

import {assert,suite,test} from 'node-test-bootstrap';
import {testOnlyExports} from "../module.example.js";
/** @import * as T from './types' */

/** @type{T._Validate_testOnlyExports} */
const _validate_testOnlyExports=function(){
  if(typeof testOnlyExports()!=='object') throw Error('! testOnlyExports invalid');
  if(Object.keys(testOnlyExports()).length===0) throw Error('! testOnlyExports empty');
  return true;
}

/** @type{T.BasicFunctionality} */
suite('Functionality of testOnlyExports',()=>{
  /** @type{T._AccessDefinedFunctions} */
  suite('Accessing not exported module functions',()=>{
    /** @type{T._Destructuring} */
    test('Destructuring declarations from testOnlyExports',()=>{
      const {_someNotExportedFunction}=testOnlyExports();
      const {_anotherNotExportedFunction}=testOnlyExports();
      assert(
        typeof _someNotExportedFunction()==='string'&&typeof _anotherNotExportedFunction()==='string'
      )
    });
    /** @type{T._Expression} */
    test('Function expressions with testOnlyExports',()=>{
      assert(
        typeof testOnlyExports()['_someNotExportedFunction']()==='string'&&typeof testOnlyExports()['_anotherNotExportedFunction']()==='string'
      )
    });
  });
  /** @type{T._FailOnNotExisting} */
  suite('Failing on functions not defined in testOnlyExports',()=>{
    /** @type{T._DestructuringUndefined} */
    test('"undefined" on trying to destructure from testOnlyExports a function that is not defined there',()=>{
      _validate_testOnlyExports();
      // @ts-ignore
      const {_thirdNotExportedFunction}=testOnlyExports();
      assert(
        typeof _thirdNotExportedFunction==='undefined'
      )
    });
    /** @type{T._ExpressionUndefined} */
    test('Function expression with testOnlyExports fails with TypeError for function that is not defined there',()=>{
      _validate_testOnlyExports();
      assert.throws(
        // @ts-ignore
        ()=>typeof testOnlyExports()['_thirdNotExportedFunction']()==='string',
        {
          name:'TypeError'
        }
      )
    });
  });
  /** @type{T._Immutable} */
  suite('testOnlyExports is immutable',()=>{
    const myTestImports=testOnlyExports();
    /** @type{T._PropertyAdd} */
    test('Throws if trying to add property',()=>{
      assert.throws(
        // @ts-ignore
        ()=>{myTestImports[crypto.randomUUID()]=()=>'I am new!'}
      )
    })
    /** @type{T._PropertyChange} */
    test('Throws if trying to change property',()=>{
      assert.throws(
        // @ts-ignore
        ()=>{myTestImports['_anotherNotExportedFunction']=()=>'I am new!'}
      )
    })
  })
})