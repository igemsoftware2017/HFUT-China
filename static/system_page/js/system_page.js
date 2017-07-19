var system = angular.module('systemApp',['ngMaterial','ngAnimate']);

system.controller('systemController',function($scope, $http, $location, $mdToast){
	
	$scope.compound_info = [];//侧边栏数据
	$scope.compound_tags = [];//导航栏数据
	$scope.message_show = false;//默认侧边栏信息显示
	$scope.gene_message_show = true;//基因信息不显示
	
	
	$scope.jumpToSystem = function(){
  		window.location.href = "../system_page/system_page.html";
  	}
	
	$scope.jumpToGene = function(){
  		window.location.href = "../gene_page/gene_page.html";
  	}
	
	$scope.jumpToProject = function(){
  		window.location.href = "../project_page/project_page.html";
  	}
	//标签模态框
	$scope.tagsDialog = function(){
		Custombox.open({
            target:'#tags',
            effect:'fadein',
       	});
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
	
	$scope.getCompoundResult = function(key_word){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/system/searchCompound',
			method: 'POST',
			data: {
				token: login_token,
				keyword: key_word,
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				$scope.compound_info = [];
				var compound_result = data.data;
				for (var i = 0;i < compound_result.length;i++) {
					$scope.compound_info.push({
						name: compound_result[i].name,
						id: compound_result[i].compound_id,
					});
				}
			}
		});
	}
	
	$scope.compound_by_keyboard = function($event,key_word){
		if ($event.keyCode == 13) {
			$scope.getCompoundResult(key_word);
		}
	}
	
	$scope.getCompoundInfo = function(id){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/system/getCompound',
			method: 'POST',
			data: {
				token: login_token,
				compound_id: id,
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				$scope.message_show = false;
				$scope.gene_message_show = true;
				
				$scope.compound_id = data.data.compound_id;
				$scope.name = data.data.name;
				$scope.nick_name = data.data.nicknames;
				$scope.mol_weight = data.data.mol_weight;
				$scope.exact_mass = data.data.exact_mass;
				$scope.formula = data.data.formula;
			}
		});
	}
	
	$scope.getGeneInfo = function(id){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/system/getGene',
			method: 'POST',
			data: {
				token: login_token,
				gene_id: id,
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				$scope.message_show = true;
				$scope.gene_message_show = false;
				
				$scope.gene_id = data.data.gene_id;
				$scope.gene_name = data.data.name;
				$scope.definition = data.data.definition;
				$scope.organism_short = data.data.organism_short;
				$scope.organism = data.data.organism;
			}
		});
	}
	
	$scope.addCompoundTags = function(compound){
		if($scope.compound_tags.indexOf(compound) == -1){
			$scope.compound_tags.push(compound);
		}
	}
	
	$scope.removeAllCompoundTags = function(){
		$scope.compound_tags = [];
	}
	
	$scope.runCompoundTags = function(){
		
		$('#my-svg').shCircleLoader({
			namespace: 'runLoad',
		});
    	$(".runLoad").css("top", $(window).height() * 0.35);
    	
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/system/getRelatedCompound',
			method: 'POST',
			data: {
				token: login_token,
				compound_tags: $scope.compound_tags,
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				$scope.compound_tags = [];
				$('#my-svg').shCircleLoader('destroy');
				draw(data.data);
			}
		});
		
	}
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