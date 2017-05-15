var locked = false;

function printEvent(name) {
  $('.events').html('<p>' + name + '</p>');
}
function goLeft(e) {
  if (locked) {
    return;
  }
  locked = true;
  printEvent('Left');
  $('.slider>.slide').first().clone().appendTo(e.data.$el).css('left', e.data.$el.width());
  reOrder(e.data.$el);
  e.data.$el.children().each(function() {
    var $slide = $(this);
    var newLeft = $slide.position().left - $slide.width();
    $slide.animate({left: newLeft}, 250, function() {
      if (-1 > newLeft) {
        $(this).remove();
      }
      locked = false;
    });
  })
}

function goRight(e) {
  if (locked) {
    return;
  }
  locked = true;
  printEvent('Right');
  var $slide = $('.slider>.slide');
  var $delete = $slide.last();
  var offset = $slide.width();
  $slide.last().clone().prependTo(e.data.$el).css('left', '-' + offset + 'px');

  e.data.$el.children().each(function() {

    var $slide = $(this);
    var newLeft = $slide.position().left + $slide.width();
    $slide.animate({left: newLeft}, 250, function() {
      $delete.remove();
      locked = false;
    });
  })
}

function reOrder($el) {
  var left = 0;
  var items = 5;
  $el.children().each(function() {
    $(this).css('left', left + '%');
    $(this).width((100 / items) + '%');
    left += 100 / items;
  })
}

function initCarousel($el) {
  reOrder($el);
  $('.prev').click({$el: $el}, goRight);
  $('.next').click({$el: $el}, goLeft);
  printEvent('Init');

  $(window).resize(function() {
    reOrder($el);
  });
}

$(document).ready(function() {
  initCarousel($('.slider'))  ;
})
