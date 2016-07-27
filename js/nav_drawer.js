;var app = app || {};
(function navDrawerInit() {
  app.navDrawer = app.navDrawer || {};
  app.content = app.content || {};

  app.navDrawer.initNavDrawer = function initNavDrawer() {
    app.navDrawer.toggleSelector = "body > div#menuButton";
    app.navDrawer.selector = "body > div#menu";
    app.content.selector = "body > div#content";
    $(app.navDrawer.toggleSelector).click(function togglenavbar() {
      app.navDrawer.toggle();
    });
    app.navDrawer.close();
  };

  app.navDrawer.open = function navDrawerOpen() {
    app.navDrawer.isOpen = true;
    $(app.navDrawer.toggleSelector).css({
      "background-image": "url(\"assets/icons/close.png\")"
    });

    $(app.navDrawer.selector).css({
      "display": "block",
      "left": "0px"
    });

    $(app.content.selector).css({
      "left": "320px"
    });

    $("body").css({
      "overflow": "hidden"
    });
  };

  app.navDrawer.close = function navDrawerClose() {
    app.navDrawer.isOpen = false;
    $(app.navDrawer.toggleSelector).css("background-image",
      "url(\"assets/icons/hamburger.png\")"
    );

    $(app.navDrawer.selector).css({
      "display": "none",
      "left": "-320px"
    });

    $(app.content.selector).css({
      "left": "0px"
    });

    $("body").css({
      "overflow": "auto"
    });
  };

  app.navDrawer.toggle = function navDrawerToggle() {
    if(app.navDrawer.isOpen) app.navDrawer.close();
    else app.navDrawer.open();
  };

  $(document).ready(function nb_init() {
    app.navDrawer.initNavDrawer();
  });
})();
