(function (){
	var internon = angular.module('internon');
    
    
    internon.controller('coordinator_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };

        $scope.init = function () {
			$http({method: 'GET', url: urls.API_HOST + '/coordinator_profile/'+$localStorage.id}).then(function(response){
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
                    var table = $("<table />");
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                        var row = $("<tr />");
                        var cells = rows[i].split(";");
                        for (var j = 0; j < cells.length; j++) {
                            var cell = $("<td />");
                            cell.html(cells[j]);
                            row.append(cell);
                        }
                        table.append(row);
                    }
                    $("#dvCSV").html('');
                    $("#dvCSV").append(table);
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
        $scope.newSection = function(id){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'create_student_section.html',
                    controller: 'coordinator_section_controller',
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

            $scope.createSection = function () {
                $http.post(urls.API_HOST + '/create_student_section/'+$localStorage.id, $scope.formdata).then(function (response){
                    $state.go('user_coordinator.coordinator_section');   
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


           $http({method: 'GET', url: urls.API_HOST + '/section_list/'+$localStorage.id}).then(function(response){
                $scope.section = response.data;
            });
                     
    });

    // internon.controller('enroll_student_controller',function(id,urls,$http,$auth,$state,$scope,$localStorage,$uibModal){


    // });

     internon.controller('coordinator_enroll_student_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
    

        

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

        $scope.enrollStudent = function () {
            $scope.formdata.section_id = $scope.choice_advertisement.option.value;
                if($scope.formdata.department_id != 'Select Section'){
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

     internon.controller('view_section_students_controller',function(students,urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.students = students;
        // console.log(students);
    });

    
   
})();
