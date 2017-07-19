$(function(){
	var h = $(window).height() - $('.navbar').height() - 0.1;
	$('.mainDash').height(h * 0.65);
	$('.mySidebar').height(h);
	$('.bottombar').height(h * 0.35);
})
