// @ts-check

import {topHelper} from './helpers.js';

/** An exported function not available via testOnlyExports */
export const purelyExported = function(){
  topHelper('Go to next step');
}

/** An exported function available testOnlyExports */
export const reallyExported = function(arg='really'){
  return 'now ' + arg;
}

/** A not exported function, but registered in testOnlyExports */
const _someNotExportedFunction = function(arg='function'){
  return 'some ' + arg;
}

/** Another not exported function registered in testOnlyExports */
const _anotherNotExportedFunction = function(arg='function'){
  return 'another ' + arg;
}

/** A not exported function that is not registered in testOnlyExports */
const _thirdNotExportedFunction = function(arg='function'){
  return 'third ' + arg;
}

export const testOnlyExports=()=>Object.freeze({
  _someNotExportedFunction, _anotherNotExportedFunction, reallyExported
});

// @ts-ignore => do not fuzz for not finding Node type defs
export const conditional_testOnlyExports=()=>!process||!process.argv[1].endsWith('.test.js')?{}:Object.freeze({
  _someNotExportedFunction, _anotherNotExportedFunction, reallyExported
});
