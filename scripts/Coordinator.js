(function () {
    var internon = angular.module('internon');
    internon.controller('coordinator_controller', function (FileUploader,password, urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $scope.logout = function () {
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };
        $scope.edit = function () {
            password.open_edit_modal();
        }
        $scope.init = function () {
            $http({ method: 'GET', url: urls.API_HOST + '/coordinator_profile/' + $localStorage.id }).then(function (response) {
                $localStorage.symbol = response.data.coordinator_symbol;
                $scope.coordinator = response.data;
                $scope.logo = 'http://localhost/Intern-On-DB/storage/app/pictures/' + $localStorage.id + "/" + response.data.coordinator_pic;
                $state.go('user_coordinator.coordinator_profile');
            });
        };
        $scope.edit_info = function (data, type) {
            var template;
            if (type == 1)
                template = 'edit_profile.html'
            if (type == 2)
                template = 'edit_school_background.html'
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: template,
                controller: function (ngToast, data, type, $scope, urls, $localStorage, $http, $uibModalInstance) {
                    $scope.coordinator = data;
                    $scope.save = function () {
                        $http.post(urls.API_HOST + '/edit_coordinator_profile/' + $localStorage.id, $scope.coordinator).then(function (response) {
                            ngToast.create({
                                className: 'success',
                                content: 'Profile Updated',
                                animation: 'fade'
                            });
                            $uibModalInstance.close();
                        });
                    };
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
                $http({ method: 'GET', url: urls.API_HOST + '/coordinator_profile/' + $localStorage.id }).then(function (response) {
                    $scope.coordinator = {};
                    $scope.coordinator = response.data;
                });
            }, function () {
                $http({ method: 'GET', url: urls.API_HOST + '/coordinator_profile/' + $localStorage.id }).then(function (response) {
                    $scope.coordinator = {};
                    $scope.coordinator = response.data;
                });
            });
        };
    
       
        var uploader = $scope.uploader = new FileUploader({
            url: urls.API_HOST + '/upload_coordinator_pic',
            formData: [{
                id: $localStorage.id,
            }],
            headers: {
                'Authorization': 'Bearer: ' + $auth.getToken()
            }
        });

        uploader.onCompleteAll = function (fileItem) {
            $http({ method: 'GET', url: urls.API_HOST + '/coordinator_profile/' + $localStorage.id }).then(function (response) {
                $scope.coordinator = {};
                uploader.clearQueue();
                $scope.coordinator = response.data;
                $scope.logo = 'http://localhost/Intern-On-DB/storage/app/pictures/' + $localStorage.id + "/" + response.data.coordinator_pic;
                $state.go('user_coordinator.coordinator_profile');
            });
        };

        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            ngToast.create({
                className: 'warning',
                content: 'Invalid File Format',
                animation: 'fade'
            });
        };


        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|'.indexOf(type) !== -1;
            }
        });


    });

    internon.controller('coordinator_section_controller', function (urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $http({ method: 'GET', url: urls.API_HOST + '/section_list/' + $localStorage.id }).then(function (response) {
            $scope.section = response.data;
        });

        $scope.newSection = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'create_student_section.html',
                controller: 'create_section_controller',
                size: 'md',
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });

            modalInstance.result.then(function (id) {
                $http({ method: 'GET', url: urls.API_HOST + '/section_list/' + $localStorage.id }).then(function (response) {
                    $scope.section = {};
                    $scope.section = response.data;
                });
            });
        };



        $scope.viewSectionStudents = function (students) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_section_students.html',
                controller: 'view_section_students_controller',
                size: 'lg',
                resolve: {
                    students: function () {
                        return students;
                    }
                }
            });

            modalInstance.result.then(function (students) {
                return 1;
            });
        };




    });

    internon.controller('create_section_controller', function (ngToast, id, urls, $http, $auth, $state, $scope, $localStorage, $uibModal, $uibModalInstance) {

        $scope.createSection = function () {
            $http.post(urls.API_HOST + '/create_student_section/' + $localStorage.id, $scope.formdata).then(function (response) {
                ngToast.create({
                    className: 'success',
                    content: 'Section Created',
                    animation: 'fade'
                });
                $uibModalInstance.close();
                $state.go('user_coordinator.coordinator_section');
            });
        };

    });

    internon.controller('coordinator_enroll_student_controller', function (urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $scope.choice_advertisement = {
            'option': { 'name': '', 'value': '', 'strict': false },
        };
        $scope.choices_advertisement = [
            { 'name': 'Select Section', 'value': '' },
        ]


        $scope.formdata = {
            section_id: '',
        }
        $scope.symbol = $localStorage.symbol;
        $http({ method: 'GET', url: urls.API_HOST + '/section_list/' + $localStorage.id }).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_advertisement.push({ 'name': response.data[i].section_code, 'value': response.data[i].id, 'strict': true });
            }
        });

        $scope.enrollStudent = function () {
            $scope.formdata.section_id = $scope.choice_advertisement.option.value;
            if ($scope.formdata.section_id != '') {
                $scope.formdata.student_username = $localStorage.symbol + "_" + $scope.formdata.student_username;
                $http.post(urls.API_HOST + '/enroll_student/' + $localStorage.id, $scope.formdata).then(function (response) {
                    $state.go('user_coordinator.coordinator_enroll_students');

                });
            }
        };


        $scope.enrollStudentCSV = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'enroll_csv.html',
                controller: "coordinator_enroll_student_controller",
                size: 'md',
            });
        };
        $scope.uploadCSV = function () {
            $scope.students = [];
            var fileUpload = document.getElementById("fileUpload");
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
            if (regex.test(fileUpload.value.toLowerCase())) {
                if (typeof (FileReader) != "undefined") {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var table = document.createElement("table");
                        var rows = e.target.result.split("\n");
                        for (var i = 0; i < rows.length; i++) {
                            var row = table.insertRow(-1);
                            var cells = rows[i].split(",");
                            if(i >= 1 && i < rows.length-1)
                                $scope.students.push({'username': cells[0], 'firstname': cells[1], 'lastname': cells[2], 'email': cells[3], 'contact_no': cells[4]});
                            for (var j = 0; j < cells.length; j++) {
                                var cell = row.insertCell(-1);
                                cell.innerHTML = cells[j];
                            }
                        }
                        var dvCSV = document.getElementById("dvCSV");
                        dvCSV.innerHTML = "";
                        dvCSV.appendChild(table);
                    }
                    reader.readAsText(fileUpload.files[0]);
                } else {
                    alert("This browser does not support HTML5.");
                }
            } else {
                alert("Please upload a valid CSV file.");
            }

            console.log($scope.students);
        }

        $scope.enrollBatchStudent = function () {
            $http.post(urls.API_HOST + '/enroll_batch_student/' + $localStorage.id, {students:$scope.students,section_id:$scope.choice_advertisement.option.value}).then(function (response) {
                // console.log(response);
                $uibModalInstance.close();
           });
        }

        $scope.enrollStudentModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'enroll_student.html',
                controller: "coordinator_enroll_student_controller",
                size: 'lg',
            });
        };

    });

    internon.controller('view_section_students_controller', function (password, students, urls, $http, $auth, $state, $scope, $localStorage, $uibModal, $uibModalInstance) {
        $scope.students = students;
        // console.log(students);
        $scope.reset = function (id) {
            password.open_reset_modal(id);
        }

        $scope.profileModal = function (student) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'student_profile_modal.html',
                controller: function (student, $scope) {
                    $scope.student = student;
                    $scope.logo = 'http://localhost/Intern-On-DB/storage/app/pictures/' + student.user_ID + "/" + student.student_pic;
                    console.log(student);
                },
                size: 'lg',
                resolve: {
                    student: function () {
                        return student;
                    }
                }
            });

            modalInstance.result.then(function (student) {
                return 1;
            });
        };


        $scope.delete_account = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'confirm_modal.html',
                controller: function (id, urls, $scope, $http, $uibModalInstance) {
                    $scope.yes = function () {
                        console.log("POWER");
                    };

                    $scope.no = function () {
                        $uibModalInstance.dismiss();

                    };
                },
                size: 'md',
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });

            modalInstance.result.then(function (students) {
                return 1;
            });
        };
    });

    internon.controller('coordinator_grades_controller', function (urls, Utilities, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $scope.choice_advertisement = {
            'option': { 'name': '', 'value': '', 'strict': false },
        };
        $scope.choices_advertisement = [
            { 'name': 'Select Section', 'value': '' },
        ]

        $http({ method: 'GET', url: urls.API_HOST + '/section_list/' + $localStorage.id }).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_advertisement.push({ 'name': response.data[i].section_code, 'value': response.data[i].id, 'strict': true });
            }
        });

        $scope.class_grade = [];
        $scope.toggled = function (open) {
            if ($scope.choice_advertisement.option.value != "") {
                $http({ method: 'GET', url: urls.API_HOST + '/view_section_students/' + $scope.choice_advertisement.option.value }).then(function (response) {
                    $scope.students = {};
                    $scope.students = response.data;
                    $scope.class_grade = [];
                    for (var i = 0; i < response.data.length; i++) {
                        var grade;
                        if (response.data[i].student.grade == null) {
                            grade = 0;
                        } else {
                            grade = response.data[i].student.grade.grade;
                        }

                        $scope.class_grade.push({ 'Lastname': response.data[i].student.student_lastname, 'Firstname': response.data[i].student.student_firstname, 'grade': grade });
                    }
                });
            } else {
                $scope.students = {};
            }
            $scope.convert = function (hours) {
                return Utilities.convert(hours)
            }
        };

        $scope.download_report = function () {
            console.log($scope.class_grade);
        }
        $scope.viewRendered = function (timecard, total) {
            console.log(timecard + " " + total);

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_rendered.html',
                controller: function (Utilities, timecard, total, $scope, $uibModalInstance) {
                    $scope.timecards = timecard;
                    $scope.total = total;
                    $scope.convert = function (hours) {
                        return Utilities.convert(hours)
                    }
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

        $scope.viewGrade = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_grade.html',
                controller: "",
                size: 'lg',
            });
        };

        $scope.viewReports = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_reports.html',
                controller: "",
                size: 'lg',
            });
        };

        $scope.viewGrade = function (grade, tot) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_grade.html',
                controller: function (grade, tot, $scope) {
                    $scope.grade = grade;
                    $scope.tot = tot;
                },
                size: 'lg',
                resolve: {
                    grade: function () {
                        return grade;
                    },
                    tot: function () {
                        return tot;
                    }
                }
            });
        };

        $scope.viewReports = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_reports.html',
                controller: function () {

                },
                size: 'lg',
            });
        };
    });

})();
