(function($) {
  var $window = $(window),
    $body = $("body"),
    $nav = $("#nav");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: [null, "736px"]
  });

  // Play initial animations on page load.
  $window.on("load", function() {
    window.setTimeout(function() {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Scrolly.
  $("#nav a, .scrolly").scrolly({
    speed: 1000,
    offset: function() {
      return $nav.height();
    }
  });
  var $boxLeft = $("#boxLeft");
  var $boxRight = $("#boxRight");

  $window.scroll(function() {
    var scrollTop = $window.scrollTop();
    var width = $window.width();
    if (width > 768) {
      if (scrollTop >= 250 && scrollTop < 400) {
        $boxLeft.css({ top: -250 + scrollTop });
        $boxRight.css({ top: 250 - scrollTop });
      }
    }
  });
})(jQuery);
