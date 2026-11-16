// @ts-check

import {assert,suite,test} from 'node-test-bootstrap';
import {spawnSync} from 'node:child_process';
import {dirname} from 'node:path';
import {EOL} from 'node:os';
/** @import * as T from './types.d.ts' */

/** @type{T._AssertTreeShake} */
const _assertTreeShake=function(bundler,searchFor){
    assert(
      !_getBundle({bundler:bundler}).includes(searchFor)
      ,EOL+'  In bundler return: '+_getUnwantedHit(searchFor,_getBundle({bundler:bundler}),10)
    )
}

/** @type{T._GetBundle} */
const _getBundle=function(params){
  const myArgs=['./../app.example.js'];
  if(params.bundler==='esbuild') myArgs.unshift('--bundle');
  return spawnSync(params.bundler,myArgs,{cwd:dirname(process.argv[1]),encoding:'utf8'}).stdout;
}

/** @type{T._GetUnwantedHit} */
const _getUnwantedHit=function(searchFor,searchIn,contextChars=0){
  const myHitPos=searchIn.indexOf(searchFor);
  if(!myHitPos) return '';
  
  return (contextChars?'"'+searchFor+'" in'+EOL+'  (...)':'')+searchIn.slice(myHitPos-contextChars,myHitPos+searchFor.length+contextChars*2)+(contextChars?'(...)'+EOL:'');
}

/** @type{T.TreeShakingTestOnlyExports} */
suite('Tree-shaking: Unused testOnlyExports must not appear in bundle',()=>{
  /** @type{T._TreeShakingEsbuild} */
  test('Tree-shaking esbuild',()=>{
    _assertTreeShake(
      'esbuild',
      'testOnlyExports'
    );
  })
  /** @type{T._TreeShakingRolldown} */
  test('Tree-shaking Rolldown',()=>{
    _assertTreeShake(
      'rolldown',
      '_someNotExportedFunction,'
    );
  })
  /** @type{T._TreeShakingRolldown} */
  test('Tree-shaking Rollup',()=>{
    _assertTreeShake(
      'rollup',
      '_someNotExportedFunction,'
    );
  })
});
