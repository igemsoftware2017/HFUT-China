var gene = angular.module('searchApp',['ngMaterial','ngAnimate']);
var vari;

gene.controller('searchController',function($scope, $http, $location, $mdToast){
	var trackNum = 9;
	$scope.tags1 = ['Foundational Advance','Biochemistry','Hardware','Microbiology','Manufacturing'];
	$scope.tags2 = ['Medicine','Diagnostics','Environment','Genetic engineering'];
	$scope.chosen = [];
	for (var i = 0; i < trackNum; i++) {
		$scope.chosen.push(false);
	}
	$scope.key_word = "";

	$scope.conChoice = function(tag) {
		console.log(tag);
		$scope.chosen[tag] = !$scope.chosen[tag];
	}
	
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
	
	$scope.jumpToSystem = function(){
  		window.location.href = "../system_page/system_page.html";
  	}
	
	$scope.jumpToGene = function(){
  		window.location.href = "../gene_page/gene_page.html";
  	}
	
	$scope.jumpToProject = function(){
  		window.location.href = "../project_page/project_page.html";
  	}
	
	$scope.gene_info_by_board = function($event,key_word){
		if ($event.keyCode == 13) {
			$scope.getTrackInfo(key_word);
			onresize();
		}
	}

	$scope.jumpToSearch = function(key_word){
		var trackStr = ''
		for (var i = 0; i<trackNum; i++) {
			if ($scope.chosen[i]) {
				if (i < 5) {
					trackStr = trackStr+"&track="+$scope.tags1[i];
				} else {
					trackStr = trackStr+"&track="+$scope.tags2[i-5];
				}
			}
		}
		url = `../search_track/search_beta1.html?key_word=${$scope.key_word}`;
		url = url + trackStr;
		window.location.href = url;
		// var opt = {
		// 	url: '/biosearch/firstPage',
		// 	method: 'POST',
		// 	data: {
		// 		track: track,//假设10个
		// 		keyword: key_word,
		// 	},
		// 	headers: { 'Content-Type': 'application/json'}
		// };
		// $http(opt).success(function(data){
		// 	if(data.successful){
		// 		console.log(data.data)
		// 	}
		// });
	}
	//初始化
	$scope.init = function(){
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
