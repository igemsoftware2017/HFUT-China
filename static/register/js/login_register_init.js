var mySwiper = new Swiper('.swiper-container', {
	pagination: '.swiper-pagination',
    paginationClickable: true,
    mousewheelControl: true,
    direction: 'vertical'
});

var jumpback = function() {
    console.log(document.referrer);
    window.location.href = document.referrer;
}