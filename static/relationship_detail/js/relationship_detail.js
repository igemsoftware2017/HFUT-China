var bio_pro = angular.module('relationshipDetailApp', ['ngMaterial', 'ngAnimate']);

bio_pro.controller('relationshipDetailController', function ($scope, $http, $location, $mdToast) {

	$scope.errorMsg = "";
	$scope.error = false;
	$scope.relate_detail_info = [];
	$scope.source_name = "";
	$scope.target_name = "";
	$scope.num = 0;

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
			$scope.login(username, password);
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
		$http(opt).success(function(data){
			Custombox.close();
   			if (data.successful) {
				sessionStorage.removeItem('login');
   				window.location.href = "../login_register/login_register.html";
   			} else{
				showToast($mdToast, "Something Strange Happened!!!");
   			}
   		});
	}

	$scope.jumpToSearch = function () {
		window.location.href = "../search_track/search_index.html";
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
		var source_name = sessionStorage.getItem("source_name");
		var target_name = sessionStorage.getItem("target_name");
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/geneRelationship/getThreeSentences',
			method: 'POST',
			data: {
				token: login_token,
				source_name: source_name,
				target_name: target_name,
			},
			headers: { 'Content-Type': 'application/json' }
		};
		$http(opt).success(function (data) {
			if (data.successful) {
				$scope.source_name = source_name;
				$scope.target_name = target_name;
				data.data.forEach(function (r, index) {
					$scope.relate_detail_info.push({
						index: index,
						paper: r.paper,
						sentence: r.sentence,
						paper_id: r.paper_id,
						paper_title: r.paper_title,
						paper_link: r.paper_link,
						paper_keyword: r.paper_keyword,
						paper_abstract: r.paper_abstract,
					})
				});
				$scope.num = data.data.length;
			}
		});
	}

	$scope.init();
});

var last = {
	bottom: true,
	top: false,
	left: false,
	right: true
};

var toastPosition = angular.extend({}, last);

function sanitizePosition() {
	var current = toastPosition;
	if (current.bottom && last.top) current.top = false;
	if (current.top && last.bottom) current.bottom = false;
	if (current.right && last.left) current.left = false;
	if (current.left && last.right) current.right = false;
	last = angular.extend({}, current);
}

var getToastPosition = function () {
	sanitizePosition();
	return Object.keys(toastPosition)
		.filter(function (pos) { return toastPosition[pos]; })
		.join(' ');
}

function showToast($mdToast, msg) {
	var pinTo = getToastPosition();
	var toast = $mdToast.simple()
		.textContent(msg)
		.highlightAction(true)
		.position(pinTo);
	$mdToast.show(toast).then(function (response) {
		if (response == 'ok') {

		}
	});
}
