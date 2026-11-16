#!/usr/bin/env node

// @ts-check

import {argv,exit} from 'node:process';
import {EOL} from 'node:os';
import {sep as pathSep} from 'node:path';
import {spawnSync} from 'node:child_process';
/** @import * as T from './types.d.ts' */

/** @type{T.Tests} */
const tests=async function(runner,...optionalArgs){
  if(!runner||!['bun','node'].includes(runner)) _helpExit();
  let reporter='spec';
  const myArgs=['--stack-trace-limit=0'];
  /** @type{string[]} */
  const myFiles=[];
  optionalArgs.forEach(value=>{
    if(!value) return;
    if(['dot','dots','spec'].includes(value)) return reporter=value;
    return myFiles.push(value);
  })
  if(runner==='bun'){
    myArgs.push('test','--isolate','--bail');
    if(reporter==='dot') reporter='dots';
    if(reporter!=='spec') myArgs.push(`--reporter=${reporter}`);
  }
  if(runner==='node'){
    await import('@reporters/bail').catch(function(){
      _errExit('Cannot run with Node: Required package https://www.npmjs.com/package/@reporters/bail not found - install package or try to run with Bun');
    })
    myArgs.push('--test','--test-reporter=@reporters/bail', '--test-reporter-destination=stderr');
    if(reporter==='dots') reporter='dot';
    myArgs.push(`--test-reporter=${reporter}`,'--test-reporter-destination=stdout');
  }
  myFiles.forEach(value=>{
    myArgs.push(value);
  })
  spawnSync(runner,myArgs,{encoding:'utf8',stdio:'inherit'});
}

/** @type{T._ErrExit} */
const _errExit=function(info='(undefined)'){
  throw Error((argv&&argv.length>1?argv[1].split(pathSep).slice(-1)[0]+': ':'')+info)
}

/** @type{T._HelpData} */
const _helpData={
  cliName: 'tests.js',
  syntax: '<runner> [<reporter>] [<testfiles>]',
  details: [
    {
      description:[
        '- Run tests with Node or Bun with bailing after first failing test',
        '  - Requires https://www.npmjs.com/package/@reporters/bail to be installed for Node'
      ]
    },
    {
      tag: '@example',
      description:[
        'test.js node // => "node --test" over default testfiles (see below)'
      ]
    },
    {
      tag: '@example',
      description:[
        'test.js node dot // => "node --test-reporter=dot"'
      ]
    },
    {
      tag: '@example',
      description:[
        'test.js bun dots // => "bun test --reporter=dots""'
      ]
    },
    {
      tag: '@example',
      description:[
        'test.js node "./tests/stubborn.test.js" // runs specified test'
      ]
    },
    {
      tag: '@example',
      description:[
        'test.js node "uno.test.js" "due.test.js" // runs two specified tests'
      ]
    },
    {
      tag: '@param',
      paramName: 'runner',
      description:[
        '- "node" or "bun" (required to avoid accidental execution)',
        '  - ! explicitly allowing to kick off this script (or a parent) with e.g. Node while preferring to run tests with Bun',
        '  - "node" will start "node --test"',
        '  - "bun" will start "bun test --isolate"',
        '    - "--isolate" to avoid "leaked handles between tests due to Bun´s speed optimizations'
      ]
    },
    {
      tag: '@param',
      paramName: 'reporter',
      description:[
        '- Test reporter: "spec" / undefined or "dot" / "dots"',
        '  - for simplicity no other choices',
        '  - NB: Node has "dot", Bun "dots", here both are interchangeable adjusted under the hood',
        '  - NB: Bun has no explicit "spec", it defines it via "no other reporter set", here an explict "spec" is adjusted under the hood',
        '  - default: "spec" (= Node / Bun default)'
      ]
    },
    {
      tag: '@param',
      paramName: 'testfiles',
      description:[
        '- Test files to run, see https://nodejs.org/api/test.html#running-tests-from-the-command-line',
        '  - default = respective runner\'s default '
      ]
    },
    {
      tag: '@returns',
      description:[
        '- No return => writes to stdout'
      ]
    }
  ]
}
;

/** @type{T._HelpToTerminal} */
const _helpToTerminal=function(params){
  if(!params) params={};
  if(!params.indent) params.indent=0;
  if(!params.maxWidth) params.maxWidth=120;
  let {indent}=params;
  const paddingRightScrollbar=5;
  const maxWidth=(process.stdout.columns<params.maxWidth?process.stdout.columns:params.maxWidth)-paddingRightScrollbar;
  let tagpart='';
  const _getLongestTagpartLength=function(){
    const tagParamNameSeparator=' ';
    let myCompare=0;
    let myLength=0;
    _helpData.details.forEach(detail=>{
      if(!detail.tag) return;
      myCompare=detail.tag.length;
      if(detail.paramName) myCompare+=tagParamNameSeparator.length+detail.paramName.length;
      if(myCompare>myLength) myLength=myCompare;
    })
    return myLength;
  }
  const longestTagpartLength=_getLongestTagpartLength();
  /** @type{(detail:{[key:string]:any})=>boolean} */
  const _isExample=function(detail){
    if(!detail.tag) return false;
    if(detail.tag.replace('@','')==='example') return true;
    return false;
  }
  /** @type{(params:{tagpart?:string,descPart:string,indent?:number,tagline?:boolean})=>void} */
  const _log=function(params){
    let myIndent=params.indent??indent;
    let line=' '.repeat(myIndent);
    let lineNumber=0;
    if(params.tagpart) line+=tagpart;
    else for(let i=0;i<params.descPart.length;i++){
      if(params.descPart[i]!==' ') break;
      ++myIndent;
      line+=' ';
    }
    params.descPart.match(/([^ ]+)/g)?.forEach(word=>{
      if((line+' '+word).length>maxWidth){
        console.log(line);
        lineNumber++;
        line=' '.repeat((params.tagline?longestTagpartLength+2+myIndent:myIndent)+(/^ *[\*-] /.test(params.descPart)?2:0));
      }
      line+=(/^ +$/.test(line)?'':' ')+word;
    })
    console.log(line);
  }
  _log({descPart:_helpData.cliName});
  indent+=2;
  _log({descPart:'Syntax: '+_helpData.syntax});
  _helpData.details.forEach(detail=>{
    tagpart=(detail.tag?`${detail.tag} `:'')+(detail.paramName??'');
    if(typeof detail.description!=='object'||detail.description.constructor.name!=='Array'){
      return _log({descPart:tagpart});
    }
    if(detail.tag&&!_isExample(detail)) while(tagpart.length<=longestTagpartLength) tagpart+=' ';
    _log({tagpart:tagpart,descPart:_isExample(detail)?'':' '+(detail.description[0]??''),tagline:detail.tag?true:false});
    detail.description.slice(_isExample(detail)?0:1).forEach(desc=>{
      _log({descPart:desc,indent:indent+2+(!detail.tag?0:_isExample(detail)?2:longestTagpartLength)});
    })
    return;
  })
}

/** @type{T._HelpExit} */
const _helpExit=function(){
  console.log();
  _helpToTerminal({indent:4});
  console.log(EOL.repeat(2));
  exit();
}

/** Reduce error display to err.name and err.message without source code snippet and err.stack */
process.on('uncaughtException',(err)=>{
  console.error(EOL.repeat(2),err.name,err.message,EOL.repeat(2));
});

if(!argv) _errExit('Must run from command line');
// @ts-ignore
await tests(...argv.slice(2));
