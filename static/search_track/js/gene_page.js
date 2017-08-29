var gene = angular.module('geneApp',['ngMaterial','ngAnimate']);
var vari;

gene.controller('geneController',function($scope, $http, $location, $mdToast){
	
	$scope.gene_info = [];
	//登录模态框
	$scope.loginDialog = function () {
		Custombox.open({
			target: '#login',
			effect: 'fadein',
		})
	}

	//确认登录
	$scope.log_in = function (username, password) {
		var opt = {
			url: '/accounts/login',
			method: 'POST',
			data: JSON.stringify({
				username: username,
				password: password,
			}),
			headers: { 'Content-Type': 'application/json' }
		};
		$http(opt).success(function (data) {
			if (data.successful) {
				$scope.error = false;
				sessionStorage.setItem('login', JSON.stringify(data.data.token));
				window.location.href = "../project_page/project_page.html";
			} else {
				$scope.error = true;
				if (data.error.id == '1') {
					$scope.errorMsg = data.error.msg;
					// showToast($mdToast, data.error.msg);
				} else {
					$scope.errorMsg = "LOGIN FAILED!";
					// showToast($mdToast, "LOGIN FAILED!");
				}
			}
		});
	};

	$scope.login_by_keyboard = function ($event, username, password) {
		if ($event.keyCode == 13) {//回车
			$scope.log_in(username, password);
		}
	};
	//修改密码模态框
	$scope.changePasswordDialog = function(){
		Custombox.open({
            target:'#cgPwd',
            effect:'fadein',
       	});
	}
	//确认修改密码
	$scope.change_password = function(old_password,new_password,re_password){
   	 	if (old_password.length == 0 || new_password.length == 0 || re_password.length == 0) {
   	 		Custombox.close();
   	 		showToast($mdToast, "Please Complete Your Info");
   		 	return;
   	 	} else {
   			var login_token = JSON.parse(sessionStorage.getItem('login'));
   			var opt = {
   				url: '/accounts/changePassword',
   				method: 'POST',
   				data: JSON.stringify({
   					token: login_token,
   					old_password: old_password,
   					new_password: new_password,
   					re_password: re_password
   				}),
   				headers: {'Content-Type': 'application/json'}
   			};
   			$http(opt).success(function(data){
   				if (data.successful) {
   					Custombox.close();
   					showToast($mdToast, "Password changed successfully");
   				} else{
   					Custombox.close();
   					showToast($mdToast, "Password changed FAILED");
   				}
   			});
   	 	}
   	}
	//登出模态框
	$scope.logoutDialog = function(){
		Custombox.open({
            target:'#logout',
            effect:'fadein',
       	});
	}
	//确认登出
	$scope.log_out = function(){
   		var login_token = JSON.parse(sessionStorage.getItem('login'));
   		var opt = {
   			url: '/accounts/logout',
   			method: 'POST',
   			data: JSON.stringify({
   				token: login_token,
   			}),
   			headers: {'Content-Type': 'application/json'}
   		};
   		$http(opt).success(function(data){
   			if (data.successful) {
   				Custombox.close();
   				window.location.href = "../login_register/login_register.html";
   			} else{
				Custombox.close();
				showToast($mdToast, "Something Strange Happened!!!");
   			}
   		});
   	}
	
	$scope.jumpToSearchIndex = function () {
		window.location.href = "../search_track/search_index.html";
	}
	
	$scope.jumpToSystem = function(){
  		window.location.href = "../system_page/system_page.html";
  	}
	
	$scope.jumpToGene = function(){
  		window.location.href = "../gene_page/gene_page.html";
  	}
	
	$scope.jumpToProject = function(){
  		window.location.href = "../project_page/project_page.html";
  	}
	
	$scope.getGeneInfo = function(key_word){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		jQuery(onresize());
		$(document).ready(function(){ 
				resize(); 
			}); 
		vari=1;
		var opt = {
			url: '/geneRelationship/searchGenes',
			method: 'POST',
			data: {
				token: login_token,
				keyword: key_word,
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				$scope.gene_info = [];
				var gene_result = data.data;
				for (var i = 0;i < gene_result.length;i++) {
					$scope.gene_info.push({
						name: gene_result[i],
					});
				}
			}
		});

	}
	
	$scope.gene_info_by_board = function($event,key_word){
		if ($event.keyCode == 13) {
			$scope.getTrackInfo(key_word);
			onresize();
		}
	}
	
	$scope.visualGene = function(name){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/geneRelationship/getRelatedGene',
			method: 'POST',
			data: {
				token: login_token,
				gene_name: name,
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				draw(data.data);
			}
		});
	}
	
	//初始化
/*	$scope.init = function(){
		$scope.getRandomGene();
	}*/
	$scope.init = function () {
		var loginSession = sessionStorage.getItem('login');
		if (loginSession) {
			console.log(loginSession);
			console.log('不为空');
			$scope.isLogin = false;
		}
		else {
			console.log('空');
			$scope.isLogin = true;
		}
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/home/getUserProject',
			method: 'POST',
			data: {
				token: login_token
			},
			headers: { 'Content-Type': 'application/json' }
		};
		$http(opt).success(function (data) {
			if (data.successful) {
				data.data.forEach(function (x) {
					$scope.project_info.push({
						id: x.project_id,
						name: x.project_name,
						devices: [],
						isDeviceShowed: true,
						track: x.track,
						function: x.function,
						creator: x.creator
					});
				})
			}
		});

		$scope.getRandomGene();
	}

	$scope.init();
});

var last = {
	bottom: true,
	top: false,
	left: false,
	right: true
};

var toastPosition = angular.extend({},last);

function sanitizePosition(){
	var current = toastPosition;
	if (current.bottom && last.top) current.top = false;
	if (current.top && last.bottom) current.bottom = false;
	if (current.right && last.left) current.left = false;
	if (current.left && last.right) current.right = false;
	last = angular.extend({},current);
}

var getToastPosition = function(){
	sanitizePosition();
	return Object.keys(toastPosition)
		.filter(function(pos) { return toastPosition[pos]; })
		.join(' ');
} 

function showToast($mdToast, msg){
	var pinTo = getToastPosition();
	var toast = $mdToast.simple()
		.textContent(msg)
		.highlightAction(true)
		.position(pinTo);
	$mdToast.show(toast).then(function(response){
		if(response == 'ok'){
			
		}
	});
}

$(document).ready(function(){ 
	
		//resize(); 
	}); 

/*function resize(){
	var elem=document.getElementById("logo");
	elem.style.position="absolute";
	elem.style.left="0px";
	elem.style.top="0px";
	elem.style.height="10px";
	alert("123");
	logo.style.left="0px";
	logo.style.top="0px";
	logo.style.height="0px";
	logo.style.width="0px";
	sea.style.height="50px";
	sea.style.width="600px";
	sea_btn.style.height="50px";
	sea_btn.style.width="50px";

	$(".search_c").css({ 
		 position: "absolute", 
		left: ($(window).width() - $(".search_c").outerWidth())/2
		 });   
	}*/

function cover(){
	document.form.sea.src="img/cver.png";
	
}
function remove(){
	document.form.sea.src="img/sea_b_img.png";
}

//点完标签（可多选）
$scope.getTrackInfo = function(key_word,track){
	var opt = {
		url: '',
		method: 'POST',
		data: {
			track: [track1,track2,track3,track4,track5,track6,track7,track8,track9,track10],//假设10个
			keyword: key_word,
		},
		headers: { 'Content-Type': 'application/json'}
	};
	$http(opt).success(function(data){
		if(data.successful){
			$scope.track_info = [];
			var track_result = data.data;
			for (var i = 0;i < track_result.length;i++) {
				$scope.track_info.push({
					title: track_result[i].title,
					time:track_result[i].times,
					key:track_result[i].key,
					abstract: track_result[i].absract,
				});
			}
		}
	});
}