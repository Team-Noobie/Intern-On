(function () {
    var internon = angular.module('internon');
    internon.controller('sv_controller', function (password, urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $scope.logout = function () {
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };

        $scope.init = function () {
            $http({ method: 'GET', url: urls.API_HOST + '/sv_profile/' + $localStorage.id }).then(function (response) {
                $scope.sv = response.data;
                $state.go('user_company_SV.sv_profile');
            });
        };

        $scope.edit = function () {
            password.open_edit_modal();
        }

        $scope.edit_info = function (data, type) {
            var template;
            if (type == 1)
                template = 'edit_profile.html'
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: template,
                controller: function (ngToast, data, type, $scope, urls, $localStorage, $http, $uibModalInstance) {
                    $scope.sv = data;
                    $scope.save = function () {
                        $http.post(urls.API_HOST + '/edit_sv_profile/' + $localStorage.id, $scope.sv).then(function (response) {
                            ngToast.create({
                                className: 'success',
                                content: 'Profile Updated',
                                animation: 'fade'
                            });
                            $uibModalInstance.close();
                        });
                    }
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    };
                },
                size: 'md',
                resolve: {
                    data: function () {
                        return data;
                    },
                    type: function () {
                        return type;
                    }
                }
            });

            modalInstance.result.then(function (id) {
                $http({ method: 'GET', url: urls.API_HOST + '/sv_profile/' + $localStorage.id }).then(function (response) {
                    $scope.sv = {};
                    $scope.sv = response.data;
                });
            }, function () {
                $http({ method: 'GET', url: urls.API_HOST + '/sv_profile/' + $localStorage.id }).then(function (response) {
                    $scope.sv = {};
                    $scope.sv = response.data;
                });
            });
        };
    });
    internon.controller('sv_intern_list_controller', function (Utilities, password, urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {

        $scope.viewRendered = function (timecard, total) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_rendered.html',
                controller: function (Utilities, timecard, total, $scope, $uibModalInstance) {
                    $scope.timecards = timecard;
                    $scope.total = total;
                },
                size: 'lg',
                resolve: {
                    timecard: function () {
                        return timecard;
                    },
                    total: function () {
                        return total;
                    }
                }
            });
        };



        $scope.choice_status = {
            'option': { 'name': '', 'value': '' },
        };

        $scope.choices_status = [
            { 'name': 'All Applicants', 'value': '' },
            { 'name': 'Active', 'value': 'Active' },
            { 'name': 'Done', 'value': 'Done' },
        ];

        $http({ method: 'GET', url: urls.API_HOST + '/sv_profile/' + $localStorage.id }).then(function (response) {
            $http({ method: 'GET', url: urls.API_HOST + '/sv_intern_list/' + response.data.department_id }).then(function (response) {
                $scope.interns = response.data;
                for (var i = 0; i < response.data.length; i++) {
                    $scope.interns[i].rendered_hours = Utilities.convert($scope.interns[i].rendered_hours);
                    // console.log(Utilities.convert(response.data[i].rendered_hours));
                    for (var x = 0; x < $scope.interns[i].timecard.length; x++) {
                        $scope.interns[i].timecard[x].hours_render = Utilities.convert($scope.interns[i].timecard[x].hours_render);
                    }
                }
            });
        });

        $scope.viewReport = function (data) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_report_modal.html',
                controller: function (data, $scope) {
                    $scope.report = data;
                },
                size: 'sm',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
        }

        $scope.addReportModal = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'add_report_modal.html',
                controller: function (id, urls, $localStorage, $scope, $http, $uibModalInstance) {
                    $scope.today = function () {
                        $scope.dt = new Date();
                    };
                    $scope.today();

                    $scope.formdata = {
                        sv_id: $localStorage.id,
                    }
                    $scope.save = function () {
                        $scope.formdata.date = ($scope.dt.getYear() + 1900) + "-" + ($scope.dt.getMonth() + 1) + "-" + $scope.dt.getDate();

                        $http.post(urls.API_HOST + '/sv_report/' + id, $scope.formdata).then(function (response) {
                            $uibModalInstance.close();
                        });
                    };
                },
                size: 'sm',
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });

            modalInstance.result.then(function (id) {
                $http({ method: 'GET', url: urls.API_HOST + '/sv_profile/' + $localStorage.id }).then(function (response) {
                    $http({ method: 'GET', url: urls.API_HOST + '/sv_intern_list/' + response.data.department_id }).then(function (response) {
                        $scope.interns = {};
                        $scope.interns = response.data;
                    });
                });

            });
        };

        $scope.viewRendered = function (timecard, total) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_rendered.html',
                controller: function (Utilities, timecard, total, $scope, $uibModalInstance) {
                    $scope.timecards = timecard;
                    $scope.total = total;
                },
                size: 'lg',
                resolve: {
                    timecard: function () {
                        return timecard;
                    },
                    total: function () {
                        return total;
                    }
                }
            });
        };

    });
    internon.controller('sv_grade_controller', function (urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $scope.choice_status = {
            'option': { 'name': '', 'value': '' },
        };

        $scope.choices_status = [
            { 'name': 'All Interns', 'value': '' },
            { 'name': 'Active', 'value': 'Active' },
            { 'name': 'Done', 'value': 'Done' },
        ];

        $http({ method: 'GET', url: urls.API_HOST + '/sv_profile/' + $localStorage.id }).then(function (response) {
            $http({ method: 'GET', url: urls.API_HOST + '/sv_intern_list/' + response.data.department_id }).then(function (response) {
                $scope.interns = response.data;
            });
        });
        $scope.gradeModal = function (student) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'interns_grade_modal.html',
                controller: function ($localStorage, student, $scope, $http, $uibModalInstance) {
                    $scope.student = student;
                    $scope.PR = 0;
                    $scope.effectiveness = 0;
                    $scope.punctuality = 0;
                    $scope.competence = 0;
                    $scope.cooperation = 0;
                    $scope.parseFloat = function (value) {
                        return parseFloat(value);
                    }
                    $scope.formdata = {};
                    $scope.save = function () {
                        $scope.formdata.sv_id = $localStorage.id;
                        $scope.formdata.student_id = student.user_ID;
                        $scope.formdata.grade = $scope.parseFloat($scope.PR)+$scope.parseFloat($scope.effectiveness)+$scope.parseFloat($scope.punctuality)+$scope.parseFloat($scope.competence)+$scope.parseFloat($scope.cooperation);
                        $scope.formdata.punctuality = $scope.parseFloat($scope.punctuality);
                        $scope.formdata.competence = $scope.parseFloat($scope.competence);
                        $scope.formdata.effectiveness = $scope.parseFloat($scope.effectiveness);
                        $scope.formdata.cooperation = $scope.parseFloat($scope.cooperation);
                        $scope.formdata.pr = $scope.parseFloat($scope.PR);
                        $http.post(urls.API_HOST + '/grade_intern', $scope.formdata).then(function (response) {
                            $uibModalInstance.close();
                        });
                    }
                },
                size: 'md',
                resolve: {
                    student: function () {
                        return student;
                    }
                }
            });

            modalInstance.result.then(function (id) {
                return 1;
            });
        };
    });
})();