var query = angular.module('queryInfoApp', []);
query.config(['$locationProvider', function ($locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}]);
/*  回弹按钮指令
 * */
query.directive('backButton', function() {
    return {
        restrict: 'E',
        template:   '<div id="back-button">' +
                        '<img src="./img/backToTop.png"/>' +
                    '</div>',
        replace: true,
        //功能
        compile: function (elem, attr) {
            elem.bind('click', function () {
                $('html,body').animate({scrollTop:0}, 300);
            });
        }
    }
});

query.controller('queryController', function ($scope, $http,$location) {
	$scope.name = 'name';
	$scope.year = '2017';
	$scope.track = 'track';
	$scope.type = 'type';
	$scope.keywords = 'keywords keywords keywords keywords keywordsss keywords keywords keywords keywords keywords v keywords keywords keywordsss keywords keywords keywords keywords keywords v ';
	$scope.award = 'award';
	if($scope.award==""){$scope.award="Not the winning";}
	$scope.description = 'ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss1234567891234567891234ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss1234567891234567891234ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss1234567891234567891234ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss1234567891234567891234ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss123456789123456789123456789123456789123456789123456789123456789123456789123456789sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';
	if($scope.description==""){$scope.description="Sorry, this information is empty.";}
	$scope.background = 'kkkkkkkkkkkkkkkkkk';
	if($scope.background==""){$scope.background="Sorry, this information is empty.";}
	$scope.attribution = '';
	if($scope.attribution==""){$scope.attribution="Sorry, this information is empty.";}
	$scope.design = '';
	if($scope.design==""){$scope.design="Sorry, this information is empty.";}
	$scope.human_practice = '';
	if($scope.human_practice==""){$scope.human_practice="Sorry, this information is empty.";}
	$scope.result = '';
	if($scope.result==""){$scope.result="Sorry, this information is empty.";}
	$scope.related = [];
	if($scope.related==""){$scope.related="Sorry, this information is empty.";}
	
	//初始化
	$scope.init = function () {
		// console.log($location.search().id);
		var opt = {
			url: '/biosearch/getDetail',
			method: 'POST',
			data: {
				_id: $location.search().id
			},
			headers: { 'Content-Type': 'application/json' }
		};
		$http(opt).success(function (data) {
			if (data.successful) {
				$scope.error = false;
				//success
				console.log("successful == true");
				$scope.name = data.data.team_name;
				$scope.year = data.data.year;
				$scope.track = data.data.track;
				// $scope.type = data.data.type;
				$scope.keywords = data.data.keywords;
				// $scope.award = data.data.award;
				$scope.description = data.data.description;
				if ($scope.description=="") {$scope.description="123"}
				$scope.background = data.data.background;
				$scope.attribution = data.data.attribution;
				$scope.design = data.data.design;
				$scope.human_practice = data.data.human_practice;
				$scope.result = data.data.result;
				// $scope.related = data.data.related;

			} else {
				console.log('false');
				//false
				$scope.error = true;
				if (data.error.id == '1') {
					$scope.errorMsg = data.error.msg;
				} else {
					$scope.errorMsg = "LOGIN FAILED!";
				}
			}
		});
	}
	$scope.isMore = true;

	$scope.isActive = false;
	$scope.more = function () {
		$scope.isMore = false;
	}

	$scope.packUp = function () {
		$scope.isMore = true;
	}

	$scope.menuClick = function () {
		var loginSession = sessionStorage.getItem('login');
		if (loginSession) {
			$scope.isLogin = false;
		}
		else {
			$scope.isLogin = true;
		}
	}

	$scope.jumpToSystem = function () {
		window.location.href = "../system_page/system_page.html";
	}

	$scope.jumpToGene = function () {
		window.location.href = "../gene_page/gene_page.html";
	}

	$scope.jumpToProject = function () {
		window.location.href = "../project_page/project_page.html";
	}

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
				} else {
					$scope.errorMsg = "LOGIN FAILED!";
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
	$scope.changePasswordDialog = function () {
		Custombox.open({
			target: '#cgPwd',
			effect: 'fadein',
		});
	}
	//确认修改密码
	$scope.change_password = function (old_password, new_password, re_password) {
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
				headers: { 'Content-Type': 'application/json' }
			};
			$http(opt).success(function (data) {
				if (data.successful) {
					Custombox.close();
					showToast($mdToast, "Password changed successfully");
				} else {
					Custombox.close();
					showToast($mdToast, "Password changed FAILED");
				}
			});
		}
	}
	//登出模态框
	$scope.logoutDialog = function () {
		Custombox.open({
			target: '#logout',
			effect: 'fadein',
		});
	}
	//确认登出
	$scope.log_out = function () {
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/accounts/logout',
			method: 'POST',
			data: JSON.stringify({
				token: login_token,
			}),
			headers: { 'Content-Type': 'application/json' }
		};
		$http(opt).success(function (data) {
			if (data.successful) {
				Custombox.close();
				window.location.href = "../login_register/login_register.html";
			} else {
				Custombox.close();
				showToast($mdToast, "Something Strange Happened!!!");
			}
		});
	}

});
$(function () {
	$(window).scroll(function () {
		var scrollTop = $(document).scrollTop();
		var contentItems = $("#content-div").find(".content_info");
		var currentItem = "aDescription";
		contentItems.each(function () {
			var contentItem = $(this);
			var offsetTop = contentItem.offset().top;
			if (scrollTop > offsetTop - 150) {
				currentItem = contentItem.attr("id");
			}
		});
		if (currentItem != $("#content-div").find(".content_info").attr("href")) {
			$(".left-menu").find(".current").removeClass("current");
			if(document.getElementById("a" + currentItem)){
				document.getElementById("a" + currentItem).classList.add("current");				
			}
		}
	});
});