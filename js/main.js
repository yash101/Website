;var app = app || {};
(function init() {
  app.location = app.location || {};
  if(window.location.href.indexOf(window.location.href.length - 1) == "/") {
    app.location.path = app.location.path || window.location.href.substring(0, window.location.href.length - 1);
  } else {
    app.location.path = app.location.path || window.location.href;
  }

  app.location.getAbsolutePath = app.location.getAbsolutePath || function getAbsolutePath(path) {
    return app.location.path + path;
  };
})();
