var bio_pro = angular.module('projectApp', ['ngMaterial','ngAnimate']);

bio_pro.controller('projectController', function($scope, $http, $location, $mdToast) {
	$scope.project_info = [];//项目列表
	$scope.isEdit = false;//默认编辑状态为未编辑
	$scope.isChosen = false;//默认未选中
	$scope.device_img_src = './img/logo_design.png';//主体图
	$scope.length = 0;
	//修改密码变量
	$scope.old_password = "";
   	$scope.new_password = "";
   	$scope.re_password = "";
   	//新建项目变量
   	$scope.tracks = [];
   	$scope.new_project_track = "";
	$scope.new_project_name = "";
	//新建分支变量
	$scope.new_device_name = "";
	
	//反转分支的显示状态
	$scope.toggle_device = function(index){
		$scope.getDevices(index, $scope.project_info[index].id);
		$scope.project_info[index].isDeviceShowed = !$scope.project_info[index].isDeviceShowed;
	}
	
	//更新当前页面内容
	$scope.update = function(){
		$scope.project_info = [];
		$scope.init();
	}
	
	//发送http请求从后台数据库导入项目列表到变量project_info中
	$scope.init = function(){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/home/getUserProject',
			method: 'POST',
			data: {
				token: login_token
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				data.data.forEach(function(x) {
					$scope.project_info.push({
						id: x.project_id,
						name: x.project_name,
						devices:[],
						isDeviceShowed: true,
						track: x.track,
						function: x.function,
						creator: x.creator
					});
				})
			}
		});
	}
	
	//发送http请求获取下标为index对应的project_info的所有分支
	$scope.getDevices = function(index, id){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/home/getProjectDevices',
			method: 'POST',
			data: {
				token: login_token,
				project_id: id
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data) {
			$scope.project_info[index].devices = data.data;
		});
	}
	
	//点击分支事件，反转isChosen状态，改为选中；同步中间基因链的图
	$scope.device_clicked = function(device_id,device_name,project_id,len) {
		$scope.isChosen = true;
		$scope.length = len;
		sessionStorage.setItem('chain_id',JSON.stringify(device_id));
		sessionStorage.setItem('project_id',JSON.stringify(project_id));
        var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
            url: '/design/getResultImage',
            method: 'POST',
            data: {
                token: login_token,
                project_id: project_id,
                chain_id: device_id
            },
            headers: { 'Content-Type': 'application/json'}
        };
        $http(opt).success(function(data) {
            if (data.successful) {
                $scope.device_img_src = data.data;
            } else {
            	$scope.device_img_src = './img/logo_design.png';
            }
        });
	}
	
	//反转编辑状态
	 $scope.toggle_edit  = function(){
	 	$scope.isEdit = !$scope.isEdit;
	 }
	
	//删除分支
	$scope.delete_device = function(index,device_id,project_id){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/home/deleteProjectDevice',
			method: 'POST',
			data: JSON.stringify({
				token: login_token,
				project_id: project_id,
				device_id: device_id,
			}),
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if (data.successful) {
				$scope.update();
				showToast($mdToast, "Device deleted successfully");
			} else{
				showToast($mdToast, "Device deleted FAILED");
			}
		});
	}
  	//新建项目模态框
	$scope.showNewProjectDialog = function() {
		Custombox.open({
            target:'#newPro',
            effect:'fadein',
       	});
       
		$http.get('/home/getTracks').success(function(data){
			if (data.successful) {
				var tracks = data.data;
				$scope.tracks = [];
				for (var i = 0;i < tracks.length;i++) {
					$scope.tracks.push({
						track_name:tracks[i].track_name,
						track_id:tracks[i].track_id,
					});
				}
			}
		});
	}
	//确认新建项目
	$scope.create_project = function(new_project_name, new_project_track){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/home/createNewProject',
			method: 'POST',
			data: JSON.stringify({
				token: login_token,
				project_name: new_project_name,
				track: new_project_track,
			}),
			headers: {'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if (data.successful) {
				Custombox.close();
				$scope.update();
				showToast($mdToast, "Project created successfully");
			} else{
				Custombox.close();
				showToast($mdToast, "Project created FAILED");
			}
		});
	}
	//新建分支模态框
	$scope.showNewDeviceDialog = function(project_id){
		sessionStorage.setItem("project_id",project_id);
		Custombox.open({
            target:'#newDev',
            effect:'fadein',
       	});
	}
	//确认新建分支
	$scope.create_device = function(new_device_name){
   		var login_token = JSON.parse(sessionStorage.getItem('login'));
   		var project_id = JSON.parse(sessionStorage.getItem('project_id'));
   		var project_index = JSON.parse(sessionStorage.getItem('project_index'));
   		console.log(project_id);
   		var opt = {
   			url: "/home/createProjectDevice",
   			method: 'POST',
   			data: JSON.stringify({
   				token: login_token,
   				device_name: new_device_name,
   				project_id: project_id
   			}),
   			headers: {'Content-Type': 'applicaiton/json'}
   		}
   		$http(opt).success(function(data){
			if (data.successful) {
				Custombox.close();
				$scope.update();
				showToast($mdToast, "Device created SUCCESS");
			} else {
				Custombox.close();
				showToast($mdToast, "Device created FAILED");
			}
   		})
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
  	
  	$scope.jumpToDesign = function(){
  		window.location.href = "../design_page/design_page.html";
  	}
  	
  	$scope.jumpToSystem = function(){
  		window.location.href = "../system_page/system_page.html";
  	}
  	
  	$scope.jumpToGene = function(){
  		window.location.href = "../gene_page/gene_page.html";
  	}
	
	//删除项目
	$scope.delete_project = function(index, id){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/home/deleteProject',
			method: 'POST',
			data: JSON.stringify({
				token: login_token,
				project_id:id
			}),
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if (data.successful) {
				$scope.project_info.splice(index, 1);
				showToast($mdToast, "Project deleted successfully");
			} else{
				showToast($mdToast, "Project deleted FAILED");
			}
		});
	}
	
	// 页面初始化
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
