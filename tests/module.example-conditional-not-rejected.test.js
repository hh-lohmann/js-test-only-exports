import {assert,suite,test} from 'node-test-bootstrap';
import {EOL} from 'node:os';
/** @import * as T from './types.d.ts' */

/** @type{T.ConditionalTestOnlyExports} */
suite('Conditional testOnlyExports - not rejected',()=>{
  /** @type{T._ConditionalTestOnlyExportsNotRejected} */
  test('Non-empty testoOnlyExports if not matching rejection condition',async ()=>{
    process.argv[1]='fake_calling_script.test.js';
    const myImport= (await import('./../module.example.js')).conditional_testOnlyExports();
    assert(
      Object.keys(myImport).length!==0,
      EOL+'Unexpected import: no Object.keys'
    )
  })
})
