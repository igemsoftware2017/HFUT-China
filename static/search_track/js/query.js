var query = angular.module('queryInfoApp', []);
query.config(['$locationProvider', function ($locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}]);

angular.module('queryInfoApp').filter('cut', function () {
	return function (value, wordwise, max, tail) {
		if (!value) return '';

		max = parseInt(max, 10);
		if (!max) return value;
		if (value.length <= max) return value;

		value = value.substr(0, max);
		if (wordwise) {
		var lastspace = value.lastIndexOf(' ');
		if (lastspace != -1) {
			value = value.substr(0, lastspace);
		}
		}

		return value + (tail || ' …');
	};
});
query.controller('queryController', function ($scope, $http,$location, $sce) {
	$scope.name = 'name';
	$scope.year = '2017';
	$scope.track = 'track';
	$scope.type = 'type';
	$scope.keywords = 'keywords keywords keywords keywords keywordsss keywords keywords keywords keywords keywords v keywords keywords keywordsss keywords keywords keywords keywords keywords v ';
	$scope.awards = '';
	$scope.fields = ['description', 'design', 'background', 'human_practice', 'modeling', 'protocol', 'result', 'part'];
	$scope.fieldData = [];
	$scope.recommends = [];
	$scope.link = "";

	$scope.turnTo = function(teamName) {
		var opt = {
			url: '/biosearch/getOneTeam',
			method: 'POST',
			data: {
				teamName: teamName
			},
			headers: { 'Content-Type': 'application/json' }
		};
		$http(opt).success(function(data) {
			if (data.successful) {
				var _id = data.data.id;
				url = `./search_query.html?id=${escape(_id)}&keyword=${escape($scope.searchWord)}`;
				console.log(url);
				window.location.href = url;
			} else {
				console.log("error!");
			}
		})
	}

	$scope.init = function () {
		var loginSession = localStorage.getItem('login');
		if (loginSession) {
			$scope.isLogin = true;
		}
		else {
			$scope.isLogin = false;
		}
		$scope.searchWord = $location.search().keyword;
		var opt = {
			url: '/biosearch/getDetail',
			method: 'POST',
			data: {
				_id: $location.search().id,
				keyword: $location.search().keyword
			},
			headers: { 'Content-Type': 'application/json' }
		};

		$http(opt).success(function (data) {
			if (data.successful) {
				$scope.error = false;
				//success
				$scope.name = data.data.team_name;
				$scope.year = data.data.year;
				$scope.track = data.data.track;
				$scope.type = data.data.type;
				$scope.link = data.data.link;
				$scope.keywords = data.data.keywords;
				if (data.data.medal != 'None') {
					$scope.awards = data.data.awards;
				} else {
					$scope.awards = 'No Medal'
				}
				if (data.data.medal != 'None') {
					$scope.awards = $scope.awards + data.data.medal;
				} else {
					$scope.awards = $scope.awards + '/No Special Prizes';
				}
				$scope.recommends = data.data.recommends;
				$scope.recommends = $scope.recommends.map(recommend=> {
					recommend.keywords = recommend.keywords.split(',');
					recommend.keywords = recommend.keywords.slice(0,5);
					return recommend;
				});
				$scope.fields.forEach(field => {
					var fieldData = {
						name: field,
						data: data.data[field],
						tooMany: false,
						isMore: true
					};
					fieldData.name = field[0].toUpperCase()+field.substring(1, field.length)
					if (!fieldData.data || fieldData.data == "") {
						fieldData.data = "Sorry, this information is empty.";
					} 
					else {
						if (fieldData.data.length > 700) {
							fieldData.tooMany = true;
						}
					}
					$scope.fieldData.push(fieldData);
				});

			} else {
				console.log('false');
			}
			console.log($scope.fieldData);
		});
	}
	$scope.isActive = false;
	//控制展开
	$scope.more = function(index) {
		$scope.fieldData[index].isMore = !$scope.fieldData[index].isMore;
	}
	$scope.packUp = function(index) {
		$scope.fieldData[index].isMore = !$scope.fieldData[index].isMore;
	}

	$scope.menuClick = function () {
		var loginSession = localStorage.getItem('login');
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

	$scope.jumpToSearch = function(key_word){
		url = './search_index.html';
		window.location.href=url;
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
				localStorage.setItem('login', JSON.stringify(data.data.token));
				window.location.reload();
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
			var login_token = JSON.parse(localStorage.getItem('login'));
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
		var login_token = JSON.parse(localStorage.getItem('login'));
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
				localStorage.removeItem('login');
				window.location.reload();
   			} else{
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

