(() => {
  // helpers.js
  var topHelper = function(request) {
    console.log(`Your request "${request}" will be processed as soon as possible!`);
  };

  // module.example.js
  var purelyExported = function() {
    topHelper("Go to next step");
  };

  // app.example.js
  purelyExported();
})();
