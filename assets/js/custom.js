// Scroll effect on navbar
$(window).scroll(function () {
    if ($(window).scrollTop() >= 330) {
      $("nav").addClass("fixed-header");
      $("nav").css("background", "#0f0f1482");
      $("nav").css("transition", "max-height 0.5s ease 0s");
    } else {
      $("nav").removeClass("fixed-header");
      $("nav").css("background", "none");
    }
  });