(function (){
	var internon = angular.module('internon');
    internon.controller('coordinator_controller',function(password,urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };
        $scope.edit = function(){
            password.open_edit_modal();
        }
        $scope.init = function () {
			$http({method: 'GET', url: urls.API_HOST + '/coordinator_profile/'+$localStorage.id}).then(function(response){
				$localStorage.symbol = response.data.coordinator_symbol;
                $scope.coordinator = response.data;
				$state.go('user_coordinator.coordinator_profile');
			});
		};

        $scope.uploadCSV =function () {
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
            if (regex.test($("#fileUpload").val().toLowerCase())) {
                if (typeof (FileReader) != "undefined") {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var table = $("<table/>");
                        var rows = e.target.result.split("\n");
                        for (var i = 1; i < rows.length-1; i++) {
                            var row = $("<tr />");
                            var cells = rows[i].split(",");
                            $scope.students.push({'name':cells[0],'school':cells[1],'strict':true});
                            for (var j = 0; j < cells.length; j++) {
                                var cell = $("<td />");
                                cell.html(cells[j]);
                                row.append(cell);
                            }
                            table.append(row);
                        }
                        $("#dvCSV").html('');
                        $("#dvCSV").append(table);
                        console.log($scope.students);
                    }
                    reader.readAsText($("#fileUpload")[0].files[0]);
                } else {
                    alert("This browser does not support HTML5.");
                }
            } else {
                alert("Please upload a valid CSV file.");
            }
        };
   

    });

    internon.controller('coordinator_section_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $http({method: 'GET', url: urls.API_HOST + '/section_list/'+$localStorage.id}).then(function(response){
                $scope.section = response.data;
        });

        $scope.newSection = function(id){
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
                        $http({method: 'GET', url: urls.API_HOST + '/section_list/'+$localStorage.id}).then(function(response){
                                $scope.section = {};
                                $scope.section = response.data;
                        });
                    });
            };
           
 

             $scope.viewSectionStudents = function(students){
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

    internon.controller('create_section_controller',function(ngToast,id,urls,$http,$auth,$state,$scope,$localStorage,$uibModal,$uibModalInstance){
        
         $scope.createSection = function () {
                $http.post(urls.API_HOST + '/create_student_section/'+$localStorage.id, $scope.formdata).then(function (response){
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

    internon.controller('coordinator_enroll_student_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.choice_advertisement = {
                'option': {'name': '','value':'','strict':false},
        };
        $scope.choices_advertisement = [
            {'name':'Select Section','value':''},
        ]


        $scope.formdata = {
            section_id:'',
        }
        $scope.symbol = $localStorage.symbol;
        $http({method: 'GET', url: urls.API_HOST + '/section_list/'+$localStorage.id}).then(function(response){
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_advertisement.push({'name':response.data[i].section_code,'value':response.data[i].id,'strict':true});
            }
        });

        $scope.enrollStudent = function () {
            $scope.formdata.section_id = $scope.choice_advertisement.option.value;
                if($scope.formdata.section_id != ''){
                    $scope.formdata.student_username = $localStorage.symbol+"_"+ $scope.formdata.student_username;
                    $http.post(urls.API_HOST + '/enroll_student/'+$localStorage.id, $scope.formdata).then(function (response){
                        $state.go('user_coordinator.coordinator_enroll_students');  

                    }); 
                }
            };
            
        $scope.enrollStudentModal = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'enroll_student.html',
                    controller: "coordinator_enroll_student_controller",
                    size: 'lg',
                    });
            };

    });

    internon.controller('view_section_students_controller',function(password,students,urls,$http,$auth,$state,$scope,$localStorage,$uibModal,$uibModalInstance){
        $scope.students = students;
        // console.log(students);
        $scope.reset = function(id){
            password.open_reset_modal(id);
        }

        $scope.delete_account = function(id){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'confirm_modal.html',
                    controller: function(id,urls,$scope,$http,$uibModalInstance){
                        $scope.yes = function(){
                            console.log("POWER");
                        };

                        $scope.no = function(){
                            $uibModalInstance.dismiss();

                        };
                    },
                    size: 'md',
                    resolve: {
                        id: function(){
                            return id;
                        }
                    }
                });

            modalInstance.result.then(function (students) {
                return 1;
            });
        };
    });

    internon.controller('coordinator_grades_controller',function(urls,Utilities,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.choice_advertisement = {
                'option': {'name': '','value':'','strict':false},
        };
        $scope.choices_advertisement = [
            {'name':'Select Section','value':''},
        ]

        $http({method: 'GET', url: urls.API_HOST + '/section_list/'+$localStorage.id}).then(function(response){
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_advertisement.push({'name':response.data[i].section_code,'value':response.data[i].id,'strict':true});
            }
        });

        $scope.select = function(){
            // console.log($scope.choice_advertisement);
            if($scope.choice_advertisement.option.value != ""){
                $http({method: 'GET', url: urls.API_HOST + '/view_section_students/'+$scope.choice_advertisement.option.value}).then(function(response){
                $scope.students = {};
                $scope.students = response.data;
                // console.log($scope.students);            
                });
            }
            $scope.convert = function(hours){
                return Utilities.convert(hours)
            }
        }
        

        $scope.viewRendered = function(timecard,total){
                        console.log(timecard+" "+total);
            
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'view_rendered.html',
                    controller: function(Utilities,timecard,total,$scope,$uibModalInstance){
                        $scope.timecards = timecard;
                        $scope.total = total;
                        $scope.convert = function(hours){
                            return Utilities.convert(hours)
                        }
                    },
                    size: 'lg',
                    resolve:{
                        timecard: function(){
                                return timecard;
                        },
                        total: function(){
                                return total;
                        }
                    }
                });
        };

        $scope.viewGrade = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'view_grade.html',
                    controller: "",
                    size: 'lg',
                    });
        };      
    
        $scope.viewReports = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'view_reports.html',
                    controller: "",
                    size: 'lg',
                    });
            };
            
    });

})();
