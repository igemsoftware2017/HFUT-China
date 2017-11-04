
var searchList = angular.module('searchListApp',['ngMaterial','ui.bootstrap']);
var cacheNum = 2;
var trackNum = 9;
searchList.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);
searchList.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});
searchList.controller('searchListController',function($scope, $http, $location, $mdToast, $sce, $anchorScroll){
	$scope.currentPage = 1;
	$scope.sessionMin = 1;
	$scope.sessionMax = cacheNum;
	$scope.maxSize = 7;
	$scope.perPage = 5;
	$scope.bigTotalItems = 10000;
	$scope.noMore = false;
	$scope.classify = false;
	
	$scope.groups = [];
	$scope.theme = null;
	$scope.tags = ['Community Labs','Entrepreneurship','Environment','Food & Energy','Foundational Research','Health & Medicine','High School','Information Processing','Manufacturing','New Application','Policy & Practices'];
	$scope.chosen = {};
	$scope.tags.forEach(tag => {
		$scope.chosen[tag] = false;
	});
    $scope.key_word = "";
	$scope.track = [];
	$scope.teams = [];
	$scope.goToTop = function() {
		$location.hash("top");
		$anchorScroll();
	}

    $scope.pageChanged = function(page) {
		if (!$scope.classify && page <= $scope.sessionMax && page >= $scope.sessionMin) {
			var opt = {
				url: '/biosearch/turnPage',
				method: 'POST',
				data: {
					page: page-$scope.sessionMin+1,
				},
				headers: { 'Content-Type': 'application/json'}
			};
		} else {
			var opt = {
				url: '/biosearch/randomPage',
				method: 'POST',
				data: {
					page: page,
					keyword: $scope.key_word,
					track: $scope.track,
					theme: $scope.theme
				},
				headers: { 'Content-Type': 'application/json'}
			};
		}
		$scope.classify = false;
		$http(opt).success(function(data){
			if(data.successful){
				if (page == $scope.sessionMax) {
					var opt = {
						url: '/biosearch/getCache',
						method: 'POST',
						data: {
							page: page,
							keyword: $scope.key_word,
							track: $scope.track
						},
						headers: { 'Content-Type': 'application/json'}
					};
					$http(opt).success(function(data){
						if(data.successful){
							$scope.sessionMin = $scope.sessionMax + 1;
							$scope.sessionMax = $scope.sessionMax + cacheNum;
							console.log("min:", $scope.sessionMin, " max:", $scope.sessionMax);
						}
					});
				} else if (page == $scope.sessionMin) {
					var opt = {
						url: '/biosearch/getCache',
						method: 'POST',
						data: {
							page: page,
							keyword: $scope.key_word,
							track: $scope.track
						},
						headers: { 'Content-Type': 'application/json'}
					};
					$http(opt).success(function(data){
						if(data.successful){
							$scope.sessionMax = $scope.sessionMin - 1;
							$scope.sessionMin = $scope.sessionMin - cacheNum;
							console.log("min:", $scope.sessionMin, " max:", $scope.sessionMax);
						}
					});
				} else if (page > $scope.sessionMax || page < $scope.sessionMin) {
					$scope.sessionMin = page;
					$scope.sessionMax = page + cacheNum - 1;
					console.log("min:", $scope.sessionMin, " max:", $scope.sessionMax);
				}
				$scope.teams = data.data.content.map(function(team){
					team.highlight.forEach(function(hightlight){
						team.abstract = team.abstract + "..." + hightlight;
					});
					team.abstract = $sce.trustAsHtml(team.abstract+" ...");
					team.parts = team.biobrick.map(part=>{
						part.img = "../img/"+part.part_type+".png";
						return part;
					});
					if (team.parts.length == 0) {
						team.hasParts = false;
					} else {
						team.hasParts = true;
					}
					return team;
				});
				if ($scope.teams.length == 0) {
					$scope.noMore = true;
					$scope.bigTotalItems = $scope.perPage*$scope.currentPage;
					console.log($scope.bigTotalItems);
				} else {
					$scope.noMore = false;
				}
				
				$('#svg').shCircleLoader('destroy');
				$('#hide-wrapper').removeClass('myHide');
				$('#svg').removeClass('my-svg');
				$scope.goToTop();
			} else {
				console.log(data.error);
			}
		});
    };

    $scope.getGeneInfo = function (name) {
		var login_token = JSON.parse(localStorage.getItem('login'));
		var opt = {
			url: '/design/getParts',
			method: 'POST',
			data: {
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

	$scope.conChoice = function(tag) {
		$scope.currentPage = 1;
		$scope.theme = null;
		$scope.chosen[tag] = !$scope.chosen[tag];
		if ($scope.chosen[tag]) {
			$scope.track.push(tag);
		} else {
			var position = $scope.track.indexOf(tag);
			$scope.track.splice(position, 1);
		}
		$scope.classify = false;
		console.log($scope.chosen);
		$('#hide-wrapper').addClass('myHide');
		$('#svg').addClass('my-svg');
		$('#svg').shCircleLoader();
		$scope.getGroup();
		$scope.getList();
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
   		var login_token = JSON.parse(localStorage.getItem('login'));
   		var opt = {
   			url: '/accounts/logout',
   			method: 'POST',
   			data: JSON.stringify({
   				token: login_token,
   			}),
   			headers: {'Content-Type': 'application/json'}
   		};
   		$http(opt).success(function(data){
			Custombox.close();
   			if (data.successful) {
				localStorage.removeItem('login');
   				window.location.href = "../search_track/search_index.html";
   			} else{
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
			$scope.jumpToSearchResults(key_word);
			onresize();
		}
	}

	$scope.jumpToSearchResults = function(key_word){
		$scope.track = [];
		Object.keys($scope.chosen).forEach(track=>{
			if ($scope.chosen[track]) {
				$scope.track.push(track);
			}
		});

		if ($scope.track == 0) {
			$scope.track = $scope.tags;
		}
		var trackStr = '';
		if ($scope.track.length>0) {
			$scope.track.forEach(track => {
				trackStr = trackStr+"&track="+escape(track);
			});
		} else {
			$scope.tags.forEach(track => {
				trackStr = trackStr+"&track="+escape(track);
			})
		}
		
		url = `../search_track/search_results.html?key_word=${escape(key_word)}`;
		url = url + trackStr;
		window.location.href = url;
	}

	$scope.classifies = function(theme) {
		$scope.theme = theme;
		$scope.classify = true;
		$scope.currentPage = 1;
		$scope.pageChanged(1);
		
		$('#hide-wrapper').addClass('myHide');
		$('#svg').addClass('my-svg');
		$('#svg').shCircleLoader();
	}
	
	$scope.getDetail = function(id) {
		url = `./search_query.html?id=${escape(id)}&keyword=${escape($scope.key_word)}`;
		console.log(url);
		window.location.href = url;
	}

	$scope.getList = function(){
		var opt = {
			url: '/biosearch/randomPage',
			method: 'POST',
			data: {
				track: $scope.track,
				keyword: $scope.key_word,
				page: 1,
				theme: $scope.theme
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			$('#svg').shCircleLoader('destroy');
			$('#hide-wrapper').removeClass('myHide');
			$('#svg').removeClass('my-svg');
			if(data.successful){
				$scope.teams = data.data.content.map(function(team){
					team.highlight.forEach(function(hightlight){
						team.abstract = team.abstract + "..." + hightlight;
					});
					team.abstract = $sce.trustAsHtml(team.abstract+" ...");
					team.parts = team.biobrick.map(part=>{
						part.img = "../img/"+part.part_type+".png";
						return part;
					});
					if (team.parts.length == 0) {
						team.hasParts = false;
					} else {
						team.hasParts = true;
					}
					return team;
				});
				$scope.words = data.data.suggestions;
				if ($scope.teams.length == 0) {
					$scope.noMore = true;
					$scope.bigTotalItems = $scope.perPage*$scope.currentPage;
					console.log($scope.bigTotalItems);
				} else {
					$scope.noMore = false;
				}

			}
		});
	}

	$scope.getGeneInfo = function(part_id) {
		var opt = {
			url: '/biosearch/bioSearchFirst',
			method: 'POST',
			data: {
				_id: part_id,
				keyword: $scope.key_word
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				$scope.teams = data.data.content.map(function(team){
					team.highlight.forEach(function(hightlight){
						team.abstract = team.abstract + "..." + hightlight;
					});
					team.abstract = $sce.trustAsHtml(team.abstract+" ...");
					return team;
				});
			}
		});
	}
	
	$scope.jumpToSearch = function(key_word){
		url = './search_index.html';
		window.location.href=url;
	}

	$scope.getGroup = function() {
		var opt = {
			url: '/biosearch/getGroup',
			method: 'POST',
			data: {
				track: $scope.track
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				$scope.groups = data.data.groups;
			}
		});
	}

	//初始化
	$scope.init = function(){
		var loginSession = localStorage.getItem('login');
		if (loginSession) {
			$scope.isLogin = true;
		}
		else {
			$scope.isLogin = false;
		}
        $scope.key_word = $location.search().key_word;
		$scope.track = $location.search().track;
		if (!$scope.track) {
			$scope.track = $scope.tags.map(tag=>{
				return tag;
			});
			$scope.track.forEach(track => {
				$scope.chosen[track] = true;
			});
		} else if ($scope.track instanceof Array) {
			$scope.track.forEach(track => {
				$scope.chosen[track] = true;
			});
		} else {
			$scope.chosen[$scope.track] = true;
			$scope.track = [$scope.track];
		}
		$scope.getList();
		$scope.getGroup();
		$scope.maxPage = cacheNum;

		$('#svg').shCircleLoader();
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
