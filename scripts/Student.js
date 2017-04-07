(function () {
	var internon = angular.module('internon');
	internon.controller('students_controller', function (password, urls, $auth, $http, $state, $scope, $localStorage, $uibModal) {

		$scope.logout = function () {
			$auth.logout();
			$localStorage.$reset();
			$state.go('index');
		};


		$scope.init = function () {
			$http({ method: 'GET', url: urls.API_HOST + '/student_profile/' + $localStorage.id }).then(function (response) {
				$scope.student = response.data;
				$state.go('user_student.student_profile');
			});
		};

		$scope.edit = function () {
			password.open_edit_modal();
		}
	});
	internon.controller('student_profile_controller', function (urls, $auth, FileUploader, $http, $state, $scope, $localStorage, $uibModal) {
		$http({ method: 'GET', url: urls.API_HOST + '/student_profile/' + $localStorage.id }).then(function (response) {
			$scope.student = response.data;
			$scope.file = '../Intern-On-DB/storage/app/resume/' + response.data.user_ID + '/' + response.data.resume;
		});

		var uploader_pic = $scope.uploader_pic = new FileUploader({
            url: urls.API_HOST + '/upload_student_pic',
            formData: [{
                id: $localStorage.id,
            }],
            headers: {
                'Authorization': 'Bearer: ' + $auth.getToken()
            }
        });

        uploader_pic.onCompleteAll = function (fileItem) {
			$http({ method: 'GET', url: urls.API_HOST + '/student_profile/' + $localStorage.id }).then(function (response) {
				$scope.student = {};
				$scope.student = response.data;
                uploader_pic.clearQueue();
                $scope.logo = 'http://localhost/Intern-On-DB/storage/app/pictures/' + $localStorage.id + "/" + response.data.student_pic;
            });
        };

        uploader_pic.onWhenAddingFileFailed = function (item, filter, options) {
            ngToast.create({
                className: 'warning',
                content: 'Invalid File Format',
                animation: 'fade'
            });
        };


        uploader_pic.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|'.indexOf(type) !== -1;
            }
        });

		$scope.edit_info = function (data, type) {
			var template;
			if (type == 1)
				template = 'edit_profile.html'
			if (type == 2)
				template = 'edit_personal.html'
			if (type == 3)
				template = 'edit_educational.html'
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: template,
				// backdrop: 'static',
				controller: function (ngToast, urls, $http, $uibModalInstance, $localStorage, data, $scope) {
					$scope.formdata = data;

					$scope.save = function () {
						$http.post(urls.API_HOST + '/edit_student_profile/' + $localStorage.id, $scope.formdata).then(function (response) {
							ngToast.create({
								className: 'success',
								content: 'Profile Updated',
								animation: 'fade'
								// console.log($scope.formdata);
							});
							$uibModalInstance.close();
						});
					};
					$scope.close = function () {
						$uibModalInstance.dismiss();
					}
				},
				size: 'md',
				resolve: {
					data: function () {
						return data;
					}
				}
			});

			modalInstance.result.then(function (id) {
				$http({ method: 'GET', url: urls.API_HOST + '/student_profile/' + $localStorage.id }).then(function (response) {
					$scope.student = {};
					$scope.student = response.data;
					$scope.file = {};
					$scope.file = '../Intern-On-DB/storage/app/resume/' + response.data.user_ID + '/' + response.data.resume;
				});
			}, function () {
				$http({ method: 'GET', url: urls.API_HOST + '/student_profile/' + $localStorage.id }).then(function (response) {
					$scope.student = {};
					$scope.student = response.data;
					$scope.file = {};
					$scope.file = '../Intern-On-DB/storage/app/resume/' + response.data.user_ID + '/' + response.data.resume;
				});
			});
		}

		$scope.viewCoordinator = function (data) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'view_coordinator.html',
				controller: function ($scope, data) {
					$scope.coordinator = data;
				},
				size: 'lg',
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

		var uploader = $scope.uploader = new FileUploader({
			url: urls.API_HOST + '/upload_resume',
			formData: [{
				id: $localStorage.id,
			}],
			headers: {
				'Authorization': 'Bearer: ' + $auth.getToken()
			}
		});

		uploader.onAfterAddingFile = function (fileItem) {
			console.info('onAfterAddingFile', fileItem);
		};

		uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|doc|docx|'.indexOf(type) !== -1;
            }
        });

	});

	internon.controller('search_advertisement_controller', function (urls, $http, $state, $scope, $localStorage, $uibModal) {
		$scope.ads = {};
		$http({ method: 'GET', url: urls.API_HOST + '/search_advertisement/' + $localStorage.id }).then(function (response) {
			$scope.ads = response.data;
			$scope.totalItems = $scope.ads.length;
			$scope.currentPage = 1;
			$scope.itemsPerPage = 10;

			$scope.$watch("currentPage", function () {
				setPagingData($scope.currentPage);
			});

			function setPagingData(currentPage) {
				var pageData = $scope.ads.slice(
					(currentPage - 1) * $scope.itemsPerPage,
					currentPage * $scope.itemsPerPage
				);
				$scope.aAds = pageData;
			}
		});

		$scope.openAdModal = function (id) {
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
				$http({ method: 'GET', url: urls.API_HOST + '/search_advertisement/' + $localStorage.id }).then(function (response) {
					$scope.ads = {};
					$scope.ads = response.data;
					$scope.totalItems = $scope.ads.length;
					$scope.currentPage = 1;
					$scope.itemsPerPage = 10;

					$scope.$watch("currentPage", function () {
						setPagingData($scope.currentPage);
					});

					function setPagingData(currentPage) {
						var pageData = $scope.ads.slice(
							(currentPage - 1) * $scope.itemsPerPage,
							currentPage * $scope.itemsPerPage
						);
						$scope.aAds = pageData;
					}
				});
			});
		};
	});
	internon.controller('student_view_advertisement_controller', function (ngToast, id, urls, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal, $uibModalInstance) {
		$scope.ids = {
			ad_id: id,
			student_id: $localStorage.id,
		};

		$http({ method: 'GET', url: urls.API_HOST + '/student_view_advertisement/' + id }).then(function (response) {
			$scope.ad = response.data;
			$scope.ids.company_id = response.data.company_id;
			$scope.logo = 'http://localhost/Intern-On-DB/storage/app/pictures/' + $scope.ad.company_id + "/" + $scope.ad.company.company_logo;
			console.log($scope.logo);
		});

		$scope.apply = function () {
			$http.post(urls.API_HOST + '/apply', $scope.ids).then(function (response) {

				ngToast.create({
					className: 'success',
					content: 'Application Successful',
					animation: 'fade'
				});
				$uibModalInstance.close();
			});
		};

	});
	internon.controller('student_view_application_controller', function (urls, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal) {
		$http({ method: 'GET', url: urls.API_HOST + '/application_list/' + $localStorage.id }).then(function (response) {
			$scope.applications = response.data;
		});

		// 	$scope.ads;

		// $http({method: 'GET', url: urls.API_HOST + '/search_advertisement/'+$localStorage.id}).then(function(response){
		// 	$scope.ads = response.data;
		// });


		$scope.viewApplication = function (id) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'viewApplication.html',
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
	internon.controller('student_sched_controller', function (urls, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal) {
		$http({ method: 'GET', url: urls.API_HOST + '/student_schedule/' + $localStorage.id }).then(function (response) {
			$scope.schedules = response.data;
		});
	});

	internon.controller('student_timecard_controller', function (Utilities, urls, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal) {
		$http({ method: 'GET', url: urls.API_HOST + '/student_timecard/' + $localStorage.id }).then(function (response) {
			$scope.intern = response.data[0];
			$scope.intern.rendered_hours = Utilities.convert($scope.intern.rendered_hours);

			for (var x = 0; x < $scope.intern.timecard.length; x++) {
				$scope.intern.timecard[x].hours_render = Utilities.convert($scope.intern.timecard[x].hours_render);
			}
		});
	});
})();