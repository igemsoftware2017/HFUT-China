
var searchList = angular.module('searchListApp',['ngMaterial','ngAnimate']);
var vari;
searchList.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);
searchList.controller('searchListController',function($scope, $http, $location, $mdToast, $sce){
	var trackNum = 9;
	$scope.tags = ['Foundational Advance','Biochemistry','Hardware','Microbiology','Manufacturing','Medicine','Diagnostics','Environment','Genetic engineering'];
	$scope.chosen = {};
	$scope.tags.forEach(tag => {
		$scope.chosen[tag] = false;
	});
    $scope.key_word = "";
	$scope.track = [];
	$scope.teams = [];
	$scope.search_info = [];

	$scope.conChoice = function(tag) {
		$scope.chosen[tag] = !$scope.chosen[tag];
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
			Custombox.close();
   			if (data.successful) {
				sessionStorage.removeItem('login');
   				window.location.href = "../login_register/login_register.html";
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
			$scope.getTrackInfo(key_word);
			onresize();
		}
	}

	$scope.jumpToSearchResults = function(key_word){
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
		url = `../search_track/search_results.html?key_word=${$scope.key_word}`;
		url = url + trackStr;
		window.location.href = url;
	 	var opt = {
		 	url: '/biosearch/biobrick',
		 	method: 'POST',
		 	data: {
		 		track: trackStr,//母鸡。。。
		 		keyword: key_word,
		 	},
		 	headers: { 'Content-Type': 'application/json'}
		 };
		$http(opt).success(function (data) {
			if (data.successful) {
				$scope.error = false;
				//success
				console.log("successful == true");
				$scope.pageNum = data.data.pageNum;
				$scope.track_info = [];
				var track_result = data.data;
				for (var i = 0;i < track_result.length;i++) {
					$scope.track_info.push({
						title: track_result[i].title,
						key:track_result[i].key,
						abstract: track_result[i].absract,
					});
				}

			} else {
				console.log('false');
				//false
				$scope.error = true;
				if (data.error.id == '1') {
					$scope.errorMsg = data.error.msg;
				} else {
					$scope.errorMsg = "error!";
				}
			}
		});
	}

	
	$scope.getDetail = function(id) {
		url = `./search_query.html?id=${id}`;
		console.log(url);
		window.location.href = url;
	}

	$scope.getList = function(){
		$scope.track = [];
		Object.keys($scope.chosen).forEach(track=>{
			if ($scope.chosen[track]) {
				$scope.track.push(track);
			}
		});
		var opt = {
			url: '/biosearch/firstPage',
			method: 'POST',
			data: {
				track: $scope.track,
				keyword: $scope.key_word
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				console.log(data.data);
				$scope.teams = data.data.content.map(function(team){
					team.highlight.forEach(function(hightlight){
						team.abstract = team.abstract + "..." + hightlight;
					});
					team.abstract = $sce.trustAsHtml(team.abstract+" ...");
					return team;
				});
				$scope.words = data.data.suggestions;
				$scope.search_info = [];
				data.data.parts.forEach(part => {
					$scope.search_info.push({
						img: '../img/' + part.part_type + '.png',
						name: part.part_name,
						part_id: part._id
					});
				});
				
			}
		});
		// $scope.teams = [{
        //     "id": "AV3_VJJor5lUclF2BU31",
        //     "title": "2015-Tsinghua",
        //     "keywords": "chromoprotein encouraged references respiration Lethbridge co-activator oneidensis experience Synechococcus biomaterials",
        //     "abstract": "Attended small Jamboree held in Taiwan by NCTU, gave presentation on behalf of our team.Attended small Jamboree held in Taiwan by NCTU, gave presentation on behalf of our team.A wonderful presentation giver.Zhou Chen: Experiment design.Designed and help made hardware tutorial.Huang Yiming: Experiment design and a lot of bench-work.",
        //     "highlight": {
        //         "result": [" untreated (kept in dark) group.Eventually, we successfully fused two <b>proteins</b> with the seamless cloning, as is supported by the appearance of 4-5kb bands in"],
        //         "modeling": ["According to the above assumption, we know that the translational level of the <b>protein</b> when the lac operator per unit concentration is not inhibited"],
        //         "safety": [" normal bacterial activity, any improper disposal of ccdB <b>protein</b> and plasmids containing ccdB gene will pose serious results to the natural bacterial"],
        //         "design": [" (the fusion <b>protein</b>) from a kinase to a phosphatase.The blue-light-sensitive LOV domain in its soluble light sensor YF1 is derived from a <b>protein</b> termed"],
        //         "description": [" light input and the <b>protein</b> expression output based on previous results.All being said, we still needed to first determine the basic parameter of this"]
        //     },
        //     "score": 3.3272107,
        //     "hits": 0
        // }, {
        //     "id": "AV3_VQzcr5lUclF2BU8P",
        //     "title": "2016-Uppsala",
        //     "keywords": "TAT-Apoptin antibiotics mechanical encryption calcitonin LC-Cutinase fusicoccin tetracycline controlled polystyrene",
        //     "abstract": "Attributions Here we thank the people who made this project possible  Thank you for all of the support during the spring and summer, and for making it possible for us to do lab work during the summer.Mikael NissbeckLab course teaching assistantiGEM guru  Thank you for all your patience and the technical support about experimental procedures.Sethu Madhava Rao GunjaLab course teaching assistant  Thank you for all of the patience and the technical support about ",
        //     "highlight": {
        //         "safety": [" <b>protein</b> would have to get into the nucleus.The booklet \u0093Common sense for laboratory work\u0094 by IBG, Uppsala University was available in the lab for quick"],
        //         "description": [" <b>protein</b> is interesting firstly because it is about half the size of other fluorescent <b>proteins</b> that are being used today, making it suitable as a"]
        //     },
        //     "score": 2.6258528,
        //     "hits": 0
        // }, {
        //     "id": "AV3_VLmar5lUclF2BU5Y",
        //     "title": "2016-Denver_Biolabs",
        //     "keywords": "bacteriocins cementation TeamProtoCat antibiotics Acinetobacter propionate Description fluorescence recombinase antimicrobial",
        //     "abstract": "The fluorimeter and optical density sensor we built was based on a design by the We relied on the DIY receptor design instructions created by We were inspired by a previous oxytocin project by We received their submitted oxytocin-neurophysin part from iGEM HQ and are working on We want to thank the University of Colorado Boulder and Colorado State University 2016 iGEM teams for helping us with our Jamboree presentation, providing us with a solid protocol for ",
        //     "highlight": {
        //         "description": [" mating pathway and produce measureable green fluorescent <b>protein</b>.2) Create an oxytocin quality sensor using a G-<b>protein</b> coupled receptor in yeast: The"]
        //     },
        //     "score": 1.6240408,
        //     "hits": 0
        // }, {
        //     "id": "AV3_VJ6Hr5lUclF2BU4T",
        //     "title": "2015-USTC",
        //     "keywords": "scaffoldin antibiotic-resistant dioxygenase polyphosphate antibiotic extermination exterminateon inhabitants diphosphate light-induced",
        //     "abstract": "Instructors of USTC project outreach through social network and activities, managing experiment design in modeling, pattern analysis and feasibility demonstration, main hardware engineer on CRISPR-Cas9 system on efflux system, wiki writer, experiment experts in molecular arrangement, control circuit based on Rasberry Pi and Arduino and physical hardware",
        //     "highlight": {
        //         "result": [",OprF, a bigger porin compared with OmpF in E. coli, is extracted from P.aeruginosa? transmembrane <b>protein</b> AcrB and EmrE to strongly block drug efflux"],
        //         "safety": [", along with goggles, masks and gloves to toally <b>protect</b> oneself considering extreme pungent odor volatilizing when painting.To prevent possible hurt"],
        //         "description": [" harmful to their metabolism and reproduction.When absence of chemical, there is no molecules bind to the chemoreceptors, cheW, an intracellular <b>protein</b>, is"],
        //         "human_practice": [" species under the threats of human destruction, humans should not look for ways to <b>protect</b> them just to cover up their bad damage to them.We are"]
        //     },
        //     "score": 1.4816236,
        //     "hits": 0
        // }, {
        //     "id": "AV3_VFdar5lUclF2BU1s",
        //     "title": "2015-Cooper_Union",
        //     "keywords": "flowthrough CRISPR-Cas expression transcription peristaltic nitrogenase Synechocystis temperature bioeconomy environments",
        //     "abstract": "Hardware team members closely collaborated to insure that all these different parts would work together This was the coding part of the project.This project is a continuation of work started by the 2014 Cooper Union iGEM team.It involves coding the arduino to control the loomino device along with designing the team website.The wet work of this project encompassed all genetic engineering components.Members that designed and built Loomino to fulfill the mechanics",
        //     "highlight": {
        //         "result": [" to confirm that the proper sequences were present in the plasmids.At this point, we only need to purify the <b>proteins</b> from the Rosetta cells and test"],
        //         "protocol": ["-stranded-dna-cdna-using-t4-rna-ligase-19 : Gel Extraction - http://www.aun.edu.eg/molecular_biology/gene&<b>protein</b>/Gel%20extraction-Qiagen.pdf10 : Miniprep"],
        //         "safety": [" essentially make any sequence rapidly may make it more challenging to <b>protect</b> intellectual property.We addressed some of those concerns in a \"white paper"]
        //     },
        //     "score": 1.3143444,
        //     "hits": 0
        // }, {
        //     "id": "AV3_VIZNr5lUclF2BU3V",
        //     "title": "2015-Sherbrooke",
        //     "keywords": "Dronpa145N interviews automation collaborated perception computational Biohackspace beneficial development illuminated",
        //     "abstract": "With that in mind, this page is intended to attribute, for every person that contributed to our project, the work they have achieved to make this into a reality.Alexandre England: Team Leader for Instrumentation related work, Heat Transfer Simulation with Comsol software, Mechanical and electrical design of the platformGuillaume Robitaille Beaumier: Team Leader for Mechatronix related work, BananaBoard design, Centrifuge mechanical designKevin Albert: TAC s ",
        //     "highlight": {
        //         "protocol": [", streptinomycin, chloramphenicol and glucose at working concentration and incubated overnight.(2000) and uses three <b>protein</b> for the lambda phage: bet, gam, exo.It"]
        //     },
        //     "score": 0.8035151,
        //     "hits": 0
        // }];
	}
	
	//初始化
	$scope.init = function(){
		var loginSession = sessionStorage.getItem('login');
		if (loginSession) {
			$scope.isLogin = true;
		}
		else {
			$scope.isLogin = false;
		}
        $scope.key_word = $location.search().key_word;
		$scope.track = $location.search().track;
		$scope.tags = ['Foundational Advance','Biochemistry','Hardware','Microbiology','Manufacturing','Medicine','Diagnostics','Environment','Genetic engineering'];
		$scope.track.forEach(track => {
			$scope.chosen[track] = true;
		})
        $scope.getList();
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
