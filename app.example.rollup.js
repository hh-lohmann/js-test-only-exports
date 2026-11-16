// @ts-check

/** Post a request!
 * @type{(request:string)=>any} */
const topHelper=function(request){
  console.log(`Your request "${request}" will be processed as soon as possible!`);
};

// @ts-check


/** An exported function not available via testOnlyExports */
const purelyExported = function(){
  topHelper('Go to next step');
};

purelyExported();
