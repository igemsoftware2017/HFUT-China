var editPro = angular.module('designApp', ['ngMaterial', 'ngAnimate', 'ng-sortable', 'ui.bootstrap.contextMenu']);

editPro.controller('designController', function ($scope, $http, $location, $mdToast) {
	$scope.errorMsg = "";
	$scope.error = false;
	$scope.search_info = [];//搜索结果
	$scope.chain_info = [];//用户编辑的基因链
	$scope.delete_gene = [];
	$scope.hideBottom = true;
	$scope.recommend_info = [];
	$scope.float_right = false;
	$scope.float_left = true;

	$scope.sb = true;//默认展示后面的基因
	$scope.sm = false;//中间的markv
	$scope.sf = false;//后面的markv

	$scope.show_front = function () {
		$scope.sf = true;
		$scope.sm = false;
		$scope.sb = false;
	};

	$scope.show_middle = function () {
		$scope.sf = false;
		$scope.sm = true;
		$scope.sb = false;
	};


	$scope.trashBin = {
		"background": "url('../img/open.png')",
		"background-size": "100%",
		"background-repeat": "no-repeat"
	};


	$scope.show_back = function () {
		$scope.sf = false;
		$scope.sm = false;
		$scope.sb = true;
	};

	$scope.openTrashBin = function () {
		$scope.trashBin.background = "url('../img/open.png')";
	}


	$scope.closeTrashBin = function () {
		$scope.trashBin.background = "url('../img/close.png')";
	}

	$scope.$watchCollection("chain_info", function (newVal, oldVal, scope) {

		var login_token = JSON.parse(localStorage.getItem('login'));
		var chain_id = JSON.parse(sessionStorage.getItem('chain_id'));
		var project_id = JSON.parse(sessionStorage.getItem('project_id'));

		if (scope.chain_info.length > 1) {
			var part_id = scope.chain_info[scope.chain_info.length - 1].part_id;
			var part_id_before = scope.chain_info[scope.chain_info.length - 2].part_id;

			$scope.getMrkvChain(part_id_before, part_id);
		}

		$scope.computeBackground();
		var opt = {
			url: '/design/updateChain',
			method: 'POST',
			data: {
				token: login_token,
				project_id: project_id,
				chain_id: chain_id,
				chain_info: newVal,
			},
			headers: { 'Content-Type': 'application/json' }
		};

		$http(opt).success(function (data) {
			if (data.successful) {
				$scope.delete_gene = [];
			}
		});
	});

	$scope.menuOptions = [
		['remove', function ($itemScope) {
			$scope.clickDelete($itemScope);
		}],
		null,
		['recommend', [
			['front', function ($itemScope) {
				var part_id = $scope.chain_info[$itemScope.$index].part_id;
				$scope.getMrkvChain(null, part_id, 'front');
			}],
			['middle-front', function ($itemScope) {
				if ($itemScope.$index <= 0) {
					return false;
				}
				var part_id = $scope.chain_info[$itemScope.$index].part_id;
				var part_id_before = $scope.chain_info[$itemScope.$index - 1].part_id;
				$scope.getMrkvChain(part_id_before, part_id, 'middle-front');
			}],
			['middle-back', function ($itemScope) {
				if ($itemScope.$index >= $scope.chain_info.length - 1) {
					return false;
				}
				var part_id_before = $scope.chain_info[$itemScope.$index].part_id;
				var part_id = $scope.chain_info[$itemScope.$index + 1].part_id;
				$scope.getMrkvChain(part_id_before, part_id, 'middle-front');
			}],
			['back', function ($itemScope) {
				var part_id = $scope.chain_info[$itemScope.$index].part_id;
				$scope.getMrkvChain(null, part_id, 'back');
			}]
		]]
	];

	$scope.putConfig = {
		group: {
			name: 'd_gene',
			pull: true,
			put: ['s_gene', 'r_gene'],
		},
		ghostClass: "ghost",
		animation: 150,
		handle: '.handle',
	};

	$scope.pullConfig = {
		group: {
			name: 's_gene',
			pull: 'clone',
			put: false,
		},
		sort: false,
		animation: 150,
		handle: '.handle'
	};

	$scope.recommendConfig = {
		group: {
			name: 'r_gene',
			pull: 'clone',
			put: false,
		},
		sort: false,
		animation: 150,
		handle: '.handle',
	};

	$scope.deleteConfig = {
		group: {
			name: 'delete',
			pull: false,
			put: ['d_gene'],
		},
		sort: true,
		animation: 150,
		onAdd: function (evt) {
			$scope.delete_gene = [];
		},
	};

	$scope.clickDelete = function ($itemScope) {
		$scope.chain_info.splice($itemScope.$index, 1)
	}

	$scope.computeBackground = function () {
		for (var i = 0; i < $scope.chain_info.length; i++) {
			if ((Math.floor(i / 5) + 1) % 2 == 0) {
				$scope.chain_info[i].float_right = true;
				$scope.chain_info[i].float_left = false;
				if ((i + 1) % 5 == 0) {
					//头
					$scope.chain_info[i].rb = true;
					$scope.chain_info[i].lt = false;
					$scope.chain_info[i].lb = false;
					$scope.chain_info[i].rt = false;
					$scope.chain_info[i].line = false;
				} else if (i % 5 == 0) {
					//尾
					$scope.chain_info[i].rb = false;
					$scope.chain_info[i].lt = true;
					$scope.chain_info[i].lb = false;
					$scope.chain_info[i].rt = false;
					$scope.chain_info[i].line = false;
				} else {
					//中间
					$scope.chain_info[i].rb = false;
					$scope.chain_info[i].lt = false;
					$scope.chain_info[i].lb = false;
					$scope.chain_info[i].rt = false;
					$scope.chain_info[i].line = true;
				}
			} else {
				$scope.chain_info[i].float_right = false;
				$scope.chain_info[i].float_left = true;
				if ((i + 1) % 5 == 0) {
					//尾
					$scope.chain_info[i].rb = false;
					$scope.chain_info[i].lt = false;
					$scope.chain_info[i].lb = true;
					$scope.chain_info[i].rt = false;
					$scope.chain_info[i].line = false;
				} else if (i % 5 == 0) {
					//头
					$scope.chain_info[i].rb = false;
					$scope.chain_info[i].lt = false;
					$scope.chain_info[i].lb = false;
					$scope.chain_info[i].rt = true;
					$scope.chain_info[i].line = false;
				} else {
					//中间
					$scope.chain_info[i].rb = false;
					$scope.chain_info[i].lt = false;
					$scope.chain_info[i].lb = false;
					$scope.chain_info[i].rt = false;
					$scope.chain_info[i].line = true;
				}
			}
		}
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
				window.location.href = "../project_page/project_page.html";
   			} else{
				showToast($mdToast, "Something Strange Happened!!!");
   			}
   		});
	}
	//页面初始化
	$scope.init = function () {
		var loginSession = localStorage.getItem('login');
		if (loginSession) {
			console.log(loginSession);
			console.log('不为空');
			$scope.isLogin = false;
		}
		else {
			console.log('空');
			$scope.isLogin = true;
		}
		var login_token = JSON.parse(localStorage.getItem('login'));
		var chain_id = JSON.parse(sessionStorage.getItem('chain_id'));
		var project_id = JSON.parse(sessionStorage.getItem('project_id'));
		var opt = {
			url: '/design/getChain',
			method: 'POST',
			data: {
				token: login_token,
				chain_id: chain_id,
				project_id: project_id,
			},
			headers: { 'Content-Type': 'application/json' }
		};
		$http(opt).success(function (data) {
			if (data.successful) {
				$scope.chain_result = data.data;
				for (var i = 0; i < $scope.chain_result.length; i++) {
					$scope.chain_info.push({
						img: '../img/' + $scope.chain_result[i].part_type + '.png',
						name: $scope.chain_result[i].part_name,
						part_id: $scope.chain_result[i].part_id,
					});

					if ((Math.floor(i / 5) + 1) % 2 == 0) {
						$scope.chain_info[i].float_right = true;
						$scope.chain_info[i].float_left = false;
						if ((i + 1) % 5 == 0) {
							//头
							$scope.chain_info[i].rb = true;
							$scope.chain_info[i].lt = false;
							$scope.chain_info[i].lb = false;
							$scope.chain_info[i].rt = false;
							$scope.chain_info[i].line = false;
						} else if (i % 5 == 0) {
							//尾
							$scope.chain_info[i].rb = false;
							$scope.chain_info[i].lt = true;
							$scope.chain_info[i].lb = false;
							$scope.chain_info[i].rt = false;
							$scope.chain_info[i].line = false;
						} else {
							//中间
							$scope.chain_info[i].rb = false;
							$scope.chain_info[i].lt = false;
							$scope.chain_info[i].lb = false;
							$scope.chain_info[i].rt = false;
							$scope.chain_info[i].line = true;
						}
					} else {
						$scope.chain_info[i].float_right = false;
						$scope.chain_info[i].float_left = true;
						if ((i + 1) % 5 == 0) {
							//尾
							$scope.chain_info[i].rb = false;
							$scope.chain_info[i].lt = false;
							$scope.chain_info[i].lb = true;
							$scope.chain_info[i].rt = false;
							$scope.chain_info[i].line = false;
						} else if (i % 5 == 0) {
							//头
							$scope.chain_info[i].rb = false;
							$scope.chain_info[i].lt = false;
							$scope.chain_info[i].lb = false;
							$scope.chain_info[i].rt = true;
							$scope.chain_info[i].line = false;
						} else {
							//中间
							$scope.chain_info[i].rb = false;
							$scope.chain_info[i].lt = false;
							$scope.chain_info[i].lb = false;
							$scope.chain_info[i].rt = false;
							$scope.chain_info[i].line = true;
						}
					}
				}
			}
		});
	}

	//获得搜索结果
	$scope.getSearchResult = function (key_word) {
		var login_token = JSON.parse(localStorage.getItem('login'));
		var opt = {
			url: '/design/searchParts',
			method: 'POST',
			data: {
				token: login_token,
				keyword: key_word
			},
			headers: { 'Content-Type': 'application/json' }
		};
		$http(opt).success(function (data) {
			if (data.successful) {
				var search_result = data.data;
				$scope.search_info = [];
				for (var i = 0; i < search_result.length; i++) {
					$scope.search_info.push({
						img: '../img/' + search_result[i].part_type + '.png',
						name: search_result[i].part_name,
						part_id: search_result[i].part_id,
					});
				}
			}
		});
	}

	$scope.search_by_keyboard = function ($event, key_word) {
		if ($event.keyCode == 13) {//回车
			$scope.getSearchResult(key_word);
		}
	};

	$scope.$watch('$viewContentLoaded', function () {
		var randomNum = Math.floor(Math.random() * 26);
		var randomKey = String.fromCharCode(97 + randomNum);
		$scope.getSearchResult(randomKey);
	});

	//获得马尔科夫链
	$scope.getMrkvChain = function (part_id_before, part_id, position) {
		var login_token = JSON.parse(localStorage.getItem('login'));
		var opt = {
			url: '/design/getMRecommend',
			method: 'POST',
			data: {
				token: login_token,
				part_id_before: part_id_before,
				part_id: part_id,
				position: position
			},
			headers: { 'Content-Type': 'application/json' }
		};
		$http(opt).success(function (data) {
			if (data.successful) {

				$scope.recommend_info = [];
				data.data.recommend_list.forEach(function (r) {
					r.forEach(function (x) {
						$scope.recommend_info.push({
							img: '../img/' + x.part_type + '.png',
							name: x.part_name,
							part_id: x.part_id,
						});
					});
				});
			}
		});
	};

	//获得基因信息
	$scope.getGeneInfo = function (name) {
		var login_token = JSON.parse(localStorage.getItem('login'));
		var opt = {
			url: '/design/getParts',
			method: 'POST',
			data: {
				token: login_token,
				part_name: name,
			},
			headers: { 'Content-Type': 'application/json' }
		};
		$http(opt).success(function (data) {
			if (data.successful) {
				$scope.part_type = data.data.part.part_type;
				$scope.part_nick_name = data.data.part.nickname;
				$scope.part_short_desc = data.data.part.short_desc;
				$scope.description = data.data.part.description;
				$scope.score = data.data.part.score;
				$scope.papers = data.data.paper;
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
