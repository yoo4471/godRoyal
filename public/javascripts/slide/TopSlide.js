$(window).load(function(){
  $('.title').css({ 'top': 90+'px', 'opacity': 1 });
  $('.text').css({ 'opacity': 1 });
  $('.more').css({ 'opacity': 1, 'bottom': 90+'px' });
});
$('#header-carousel').on('slid.bs.carousel', function () {
  $('.title').css({ 'top': 90+'px', 'opacity': 1 });
  $('.text').css({ 'opacity': 1 });
  $('.more').css({ 'opacity': 1, 'bottom': 90+'px' });
});
$('#header-carousel').on('slide.bs.carousel', function () {
  $('.title').css({ 'top': 0+'px', 'opacity': 0 });
  $('.text').css({ 'opacity': 0 });
  $('.more').css({ 'opacity': 0, 'bottom': 0+'px' });
});
function carouselFix() {
  $(".carousel.slide").carousel("pause");
  $('.carousel.slide .item').removeClass('active');
  $('.carousel.slide').find('.item:first').addClass('active');
}
$(document).ready(function() {
  carouselFix();
});
