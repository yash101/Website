;var app = app || {};
(function navDrawerInit() {
  app.navDrawer = app.navDrawer || {};
  app.navDrawer.initNavDrawer = function initNavDrawer() {
    app.navDrawer.isOpen = false;
  };

  app.navDrawer.open = function navDrawerOpen() {
    app.navDrawer.isOpen = true;
  };
})();
