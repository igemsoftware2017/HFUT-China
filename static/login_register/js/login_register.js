var lr = angular.module('login-register',['ngMaterial','ngMessages']);

lr.controller("loginCtrl",function($scope,$http,$mdToast){
	
	$scope.login = function(username,password){
		var opt = {
			url: '/accounts/login',
			method: 'POST',
			data: JSON.stringify({
				username: username,
				password: password,
			}),
			headers: {'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if (data.successful) {
				sessionStorage.setItem('login',JSON.stringify(data.data.token));
				window.location.href = "../project_page/project_page.html";
			} else{
				if (data.error.id == '1') {
					showToast($mdToast,data.error.msg);
				} else {
					showToast($mdToast,"LOGIN FAILED!");
				}
			}
		});
	};
	
	$scope.login_by_keyboard = function($event,username,password){
      	if($event.keyCode == 13) {//回车
          	$scope.login(username,password);
      	}
  	};

  	$scope.slideToRegist = function() {
  		mySwiper.slideNext();
  	}
	
}).controller("registerCtrl",function($scope,$http,$mdToast){
		
	$scope.register = function(username,email,password,repassword){
		var opt = {
			url: '/accounts/register',
			method: 'POST',
			data: JSON.stringify({
				username: username,
				email: email,
				password: password,
				repassword: repassword
			}),
			headers: {'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if (data.successful) {
				showToast($mdToast,"Register SUCCESSED!");
			} else {
				if (data.error.id == '1') {
					showToast($mdToast,data.error.msg);
				} else {
					showToast($mdToast,"Register FAILED!");
				}
			}
		});
		
	};
	
	$scope.register_by_keyboard = function($event,username,email,password,repassword){
      	if($event.keyCode == 13) {//回车
          	$scope.register(username,email,password,repassword);
      	}
  	};

  	$scope.slideToLogin = function() {
  		mySwiper.slidePrev();
  	}
	
});

var last = {
	bottom: false,
	top: true,
	left: false,
	right: true
};

var toastPosition = angular.extend({},last);

var sanitizePosition = function(){
	var current = toastPosition;
	if (current.bottom && last.top) current.top = false;
	if (current.top && last.bottom) current.bottom = false;
	if (current.left && last.right) current.right = false;
	if (current.right && last.left) current.left = false;
	last = angular.extend({},current);
};

var getToastPosition = function(){
	sanitizePosition();
	return Object.keys(toastPosition)
		.filter(function(pos){return toastPosition[pos];})
		.join(' ');
};

var showToast = function($mdToast,msg){
	var pinTo = getToastPosition();
	var toast = $mdToast.simple()
		.textContent(msg)
		.highlightAction(true)
		.position(pinTo);
	$mdToast.show(toast);
};