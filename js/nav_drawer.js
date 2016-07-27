;var app = app || {};
(function navDrawerInit() {
  app.navDrawer = app.navDrawer || {};
  app.navDrawer.initNavDrawer = function initNavDrawer() {
    app.navDrawer.isOpen = false;
    app.navDrawer.toggleSelector = "body > div#menuButton";
    $(app.navDrawer.toggleSelector).click(app.navDrawer.toggle);
  };

  app.navDrawer.open = function navDrawerOpen() {
    app.navDrawer.isOpen = true;
    $(app.navDrawer.toggleSelector).css({
      "background-image": "url(\"../assets/icons/hamburger.png\");"
    });
  };

  app.navDrawer.close = function navDrawerClose() {
    app.navDrawer.isOpen = false;
    $(app.navDrawer.toggleSelector).css({
      "background-image": "url(\"../assets/icons/close.png\");"
    });
  };

  app.navDrawer.toggle = function navDrawerToggle() {
    if(app.navDrawer.isOpen) app.navDrawer.close();
    else app.navDrawer.open();
  };



  while(!app.navDrawer.initNavDrawer) {}
  app.navDrawer.initNavDrawer();
})();
