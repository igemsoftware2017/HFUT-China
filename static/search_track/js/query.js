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
	$scope.fields = ['description', 'background', 'attribution', 'design', 'human_practice', 'result'];
	$scope.fieldData = [];
	//初始化
	$scope.init = function () {
		var loginSession = sessionStorage.getItem('login');
		console.log(loginSession);
		if (loginSession) {
			$scope.isLogin = true;
		}
		else {
			$scope.isLogin = false;
		}
		
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
				$scope.name = data.data.team_name;
				$scope.year = data.data.year;
				$scope.track = data.data.track;
				// $scope.type = data.data.type;
				$scope.keywords = data.data.keywords;
				// $scope.award = data.data.award;
				$scope.fields.forEach(field => {
					var fieldData = {
						name: field,
						data: data.data[field],
						shortData: data.data[field],
						showData: data.data[field],
						tooMany: false,
						isMore: true
					};
					fieldData.name = field[0].toUpperCase()+field.substring(1, field.length)
					fieldData.data="Generally speaking, our system is a project search engine.				The system is based on a project library that stores information (including the profile, the purpose, the process, the results etc.) of all the teams’ projects in the past years and updates daily to keep up with the times. The system provides a variety of ways for searching information. And by the special processing of the information, we also optimize the searching performance and ensure the effectiveness of search results.In the initial processing of storage, the data is sorted by algorithm through keywords. Content that is relevant to the keywords will be placed ahead. And the searching results will be sorted by algorithm as well.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.";
					fieldData.shortData="Generally speaking, our system is a project search engine.				The system is based on a project library that stores information (including the profile, the purpose, the process, the results etc.) of all the teams’ projects in the past years and updates daily to keep up with the times. The system provides a variety of ways for searching information. And by the special processing of the information, we also optimize the searching performance and ensure the effectiveness of search results.In the initial processing of storage, the data is sorted by algorithm through keywords. Content that is relevant to the keywords will be placed ahead. And the searching results will be sorted by algorithm as well.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.The sorting algorithm itself is a model. When user looks at the searching results, the system will know which kind of information is more useful to the user according to the user's feedback. Through this information collection training and screening model, the system itself will optimize the sorting algorithm.";
					
					if (fieldData.data == "") {
						fieldData.data = "Sorry, this information is empty.";
					} else {
						if (fieldData.data.length > 2000) {
							fieldData.tooMany = true;
							fieldData.shortData = fieldData.data.substring(0, 1000) + "...";
							fieldData.showData = fieldData.shortData;
						}
					}
					$scope.fieldData.push(fieldData);
				});
				// $scope.related = data.data.related;
				if($scope.award==""){$scope.award="Not the winning";}

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
	$scope.isActive = false;

	//控制展开
	$scope.more = function(index) {
		$scope.fieldData[index].isMore = !$scope.fieldData[index].isMore;
		$scope.fieldData[index].showData = $scope.fieldData[index].data;
	}
	$scope.packUp = function(index) {
		$scope.fieldData[index].isMore = !$scope.fieldData[index].isMore;
		$scope.fieldData[index].showData = $scope.fieldData[index].shortData;
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
	// $scope.init();
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