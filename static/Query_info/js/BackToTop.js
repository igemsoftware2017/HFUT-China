//页面加载完毕后出发
window.onload = function(){
	var OnButton = document.getElementById("backbutton");
	var timer = null;//计时器变量
	var isTop = true;
	var clientHeight = document.documentElement.clientHeight;//获取页面可视区的高度759
	
	window.onscroll = function(){
		var osTop = document.documentElement.scrollTop || document.body.scrollTop;
		if(osTop >= clientHeight){
			OnButton.style.display = 'block';
		}else{
			OnButton.style.display = 'none';
		}
		if(!isTop){
			clearInterval(timer);
			//alert("滚动着");
		}
		isTop = false;
	}
	
	OnButton.onclick = function(){
		timer = setInterval(function(){
				//获取滚动条的位置;
				var osTop = document.documentElement.scrollTop || document.body.scrollTop;
				var speed = osTop / 5;
				document.body.scrollTop = osTop - speed;
				isTop = true;
				if(speed == 0){
					clearInterval(timer);
				}
			},30);

	}
	var OnloadButton = document.getElementById("onload");
	var par = OnloadButton.parentNode.parentNode;
	var ps = par.children[2];
	OnloadButton.onclick = function(){
		ps.style.height="auto";	
	}
}