(function (){
	var internon = angular.module('internon');
	internon.controller('students_controller',function(urls,$auth,$http,$state,$scope,$localStorage,$uibModal){

		$scope.logout = function(){
		$auth.logout();
		$localStorage.$reset();
		$state.go('index');
		};


		$scope.init = function () {
			$http({method: 'GET', url: urls.API_HOST + '/student_profile/'+$localStorage.id}).then(function(response){
				$scope.student = response.data;
				$state.go('user_student.student_profile');
			});
		};

		$scope.studentSetting = function(data){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'student_setting.html',
				controller: function(){


				},
				size: 'md',
				resolve: {
						data: function () {
							return data;
						}
					}
				});

				modalInstance.result.then(function (data) {
					return 1;
				});
		};
	});
	internon.controller('student_profile_controller',function(urls,$auth,FileUploader,$http,$state,$scope,$localStorage,$uibModal){
			$http({method: 'GET', url: urls.API_HOST + '/student_profile/'+$localStorage.id}).then(function(response){
				$scope.student = response.data;
                $scope.file = '../Intern-On-DB/storage/app/resume/'+response.data.user_ID+'/'+response.data.resume;
			});

			$scope.editProfile = function(data){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'edit_profile.html',
				controller: function(data,$scope){
					$scope.student = data;
				},
				size: 'md',
				resolve: {
						data: function () {
							return data;
						}
					}
				});

				modalInstance.result.then(function (id) {
					return 1;
				});
			};

			$scope.editPersonal = function(data){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'edit_personal.html',
				controller: function(data,$scope){
					$scope.student = data;
				},
				size: 'md',
				resolve: {
						data: function () {
							return data;
						}
					}
				});

				modalInstance.result.then(function (id) {
					return 1;
				});
			};

			$scope.editEducational = function(data){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'edit_educational.html',
				controller: function(data,$scope){
					$scope.student = data;
				},
				size: 'md',
				resolve: {
						data: function () {
							return data;
						}
					}
				});

				modalInstance.result.then(function (data) {
					return 1;
				});
			};
			
			

			$scope.editPassword = function(id){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'edit_password.html',
				controller: '',
				size: 'md',
				resolve: {
						id: function () {
							return id;
						}
					}
				});

				modalInstance.result.then(function (id) {
					return 1;
				});
			};
			var uploader = $scope.uploader = new FileUploader({
				url: urls.API_HOST + '/upload_resume',
				formData:[{
					id:$localStorage.id,
				}],
				headers: {
					'Authorization': 'Bearer: ' + $auth.getToken()
				}
			});

			uploader.onAfterAddingFile = function(fileItem) {
            	console.info('onAfterAddingFile', fileItem);
        	};

	});
	
	internon.controller('search_advertisement_controller',function(urls,$http,$state,$scope,$localStorage,$uibModal){
		$scope.ads;
		$http({method: 'GET', url: urls.API_HOST + '/search_advertisement/'+$localStorage.id}).then(function(response){
			$scope.ads = response.data;
			$scope.totalItems = $scope.ads.length;
			$scope.currentPage = 1;
			$scope.itemsPerPage = 10;

			$scope.$watch("currentPage", function(){
				setPagingData($scope.currentPage);
			});

			function setPagingData(currentPage){
				var pageData = $scope.ads.slice(
					(currentPage-1) * $scope.itemsPerPage,
					currentPage * $scope.itemsPerPage	
				);
				$scope.aAds = pageData;
			}
		});

		$scope.openAdModal = function(id){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'ad.html',
				controller: 'student_view_advertisement_controller',
				size: 'lg',
				resolve: {
						id: function () {
							return id;
						}
					}
				});

				modalInstance.result.then(function (id) {
					return 1;
				});
		};
	});
	internon.controller('student_view_advertisement_controller',function(id,urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal,$uibModalInstance){
		$scope.ids ={
			ad_id:id,
			student_id: $localStorage.id,
		};

		$http({method: 'GET', url: urls.API_HOST + '/student_view_advertisement/'+id}).then(function(response){
			$scope.ad = response.data;
			$scope.ids.company_id = response.data.company_id;
		});

		$scope.apply = function () {
			$http.post(urls.API_HOST + '/apply', $scope.ids).then(function (response){
				$uibModalInstance.close();
			});
		};

	});
	internon.controller('student_view_application_controller',function(urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
		$http({method: 'GET', url: urls.API_HOST + '/application_list/'+$localStorage.id}).then(function(response){
				$scope.applications = response.data;
		});
	});
	internon.controller('student_sched_controller',function(urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
		$http({method: 'GET', url: urls.API_HOST + '/student_schedule/'+$localStorage.id}).then(function(response){
			$scope.schedules = response.data;
		});
	});
})();