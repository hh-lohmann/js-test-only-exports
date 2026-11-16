/** Tests for basic testOnlyExports functionality
 *  - With or without a defined rejection condition
 *    (cf. {@link ConditionalTestOnlyExports})
 * - {@link _AccessDefinedFunctions}
 * - {@link _FailOnNotExisting}
 * - {@link _Immutable}
*/
export type BasicFunctionality=__Suite;


/** Tests for conditional testOnlyExports
 *  - cf. {@link BasicFunctionality}
 *   - ! Testing conditional testOnlyExports requires separate test
 *       script files since, as well as static "import", also dynamic
 *       "import()" will not / can not read / process the same module
 *       more than once, i.e. reading it with different settings must
 *       happen in a separate files
 * - {@link _ConditionalTestOnlyExportsRejected}
 * - {@link _ConditionalTestOnlyExportsNotRejected}
*/
export type ConditionalTestOnlyExports=__Suite;


/** Tests for tree-shaking: Unused testOnlyExports must not appear
 *  in bundle
 *  - ! bundlers expected to be installed globally as clis
 * - with {@link _TreeShakingEsbuild}
 * - with {@link _TreeShakingRolldown}
 * - with {@link _TreeShakingRollup}
*/
export type TreeShakingTestOnlyExports=__Suite;


/** Signature for suites
 *  - NB: suite = runs tests sync = after each other
*/
type __Suite=(suiteDescription:string,tests:Function)=>void;


/** Signature for tests */
type __Test=(testDescription:string,testImplementation:Function)=>void;


/** Bundlers for tree shaking tests */
type __TreeShakeBundlers='esbuild'|'rolldown'|'rollup';


/** Access functions defined in testOnlyExports
 *  - by {@link _Destructuring}
 *  - by {@link _Expression}
*/
export type _AccessDefinedFunctions=__Suite;

/** Generalized assert function for tree shaking tests
 * @param bundler - Bundler to use => {@link __TreeShakeBundlers}
 * @param searchFor - String to search in bundler result
 * 
*/
export const _assertTreeShake:(bundler:__TreeShakeBundlers,searchFor:string)=>void;
export type _AssertTreeShake=typeof _assertTreeShake;


/** Calling conditional testOnlyExports should be not empty if
 *  called by a script that is ending in ".test.js"
 *  - e.g.
 *    ```js
 *         // called by "xyz.test.js"
 *         Object.keys(testOnlyExports()).length!==0 // => true
 *    ```
 */
export type _ConditionalTestOnlyExportsNotRejected=__Test;


/** Calling conditional testOnlyExports should be empty if called
 *  by a script that is not ending in ".test.js"
 *  - e.g.
 *    ```js
 *         // called by "xyz.js"
 *         Object.keys(testOnlyExports()).length===0 // => true
 *    ```
 */
export type _ConditionalTestOnlyExportsRejected=__Test;


/** Access testOnlyExports via destructuring
 *  - i.e.. `const {func}=testOnlyExports`
 *  - e.g.
 *    ```js
 *         const {funcX}=testOnlyExports()`
 *    ```
*/
export type _Destructuring=__Test;


/** Trying to destructure function not in testOnlyExports should
 *  return "undefined"
 *  - e.g.
 *    ```js
 *        // testOnlyExports() contains no "funcX"
 *        const {funcX}=testOnlyExports()
 *        // => funcX is undefined
 *    ```
*/
export type _DestructuringUndefined=__Test;


/** Use testOnlyExports for function expressions
 *  - e.g.
 *    ```js
 *         testOnlyExports()['funcX']()
 *    ```
*/
export type _Expression=__Test


/** Trying to use testOnlyExports with a function not defined in it
 *  should throw a TypeError
 *  - NB: other kinds of errors should have other reasons
 *  - e.g.
 *    ```js
 *        // testOnlyExports contains no "funcX"
 *        testOnlyExports()['funcX']()
 *        // => TypeError
 *    ```
*/
export type _ExpressionUndefined=__Test;


/** Fail on trying to access function not defined in testOnlyExports
 *  - by {@link _DestructuringUndefined}
 *  - by {@link _ExpressionUndefined}
*/
export type _FailOnNotExisting=__Suite;


/** Calling bundler and return resulting bundle as string
 * @param params - Parameter object
 *    - **bundler** - Bundler to use (triggers specific bundler
 *                    params) => {@link __TreeShakeBundlers}
*/
export const _getBundle:(params:{bundler:__TreeShakeBundlers})=>string;
export type _GetBundle=typeof _getBundle;


/** Return unwanted hit in string with context
 * @param searchFor - String to search in searchIn
 * @param searchIn - String to check for searchFor
 * @param contextChars - Number of characters before and after hit 
 *                       in searchIn to display
*/
export const _getUnwantedHit:(searchFor:string,searchIn:string,contextChars?:number)=>string;
export type _GetUnwantedHit=typeof _getUnwantedHit;


/** testOnlyExports should be immutable
 *  - against {@link _PropertyAdd}
 *  - against {@link _PropertyChange}
*/
export type _Immutable=__Suite;


/** Trying to add a function to testOnlyExports should throw a
 *  TypeError
 *  - e.g.
 *    ```js
 *         const myTestImports=testOnlyExports();
 *         myTestImports['newFunc']=()=>'New Function'
 *         // => TypeError
 *    ```
*/
export type _PropertyAdd=__Test;


/** Trying to change a function defined in testOnlyExports should
 *  throw a TypeError
 *  - e.g.
 *    ```js
 *         const myTestImports=testOnlyExports();
 *         myTestImports['newFunc']=()=>'Changed Function'
 *         // => TypeError
 *    ```
*/
export type _PropertyChange=__Test;


/** Tree-shaking esbuild
 *  - esbuild keeps export names and strips off comments, so
 *    checking for "testOnlyExports" works
*/
export type _TreeShakingEsbuild=__Test;


/** Tree-shaking Rolldown
 *  - ! Rolldown keeps comments and may strip off export names, so
 *    checking for "testOnlyExports" does not work, instead check
 *    for "_someNotExportedFunction," (! comma) depicting a object
 *    containing "_someNotExportedFunction"
*/
export type _TreeShakingRolldown=__Test;


/** Make sure that failing a specific test does not result from a
 *  generally invalid testOnlyExports that would let fail any test
 *
*/
export const _validate_testOnlyExports:()=>boolean;
export type _Validate_testOnlyExports=typeof _validate_testOnlyExports;
