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

    $scope.students = [
        {},
    ]
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
        $scope.newSection = function(id){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'create_student_section.html',
                    controller: 'create_student_section_controller',
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

            $scope.enrollStudent = function(id){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'enroll_student.html',
                    controller: 'enroll_student_controller',
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

           $http({method: 'GET', url: urls.API_HOST + '/section_list'}).then(function(response){
                    $scope.section = response.data;
                });
                     
    });

    internon.controller('enroll_student_controller',function(id,urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
       $scope.formdata = {
           coordinator_id: $localStorage.id,
           section_id: id,
       }

        $scope.enrollStudent = function () {
            $http.post(urls.API_HOST + '/enroll_student', $scope.formdata).then(function (response){
                $state.go('user_coordinator.coordinator_section');   
            });
 
        };

    });

     internon.controller('create_student_section_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
       
        $scope.createSection = function () {
            $http.post(urls.API_HOST + '/create_student_section', $scope.formdata).then(function (response){
                $state.go('user_coordinator.coordinator_section');   
            });

        };

    });
   
})();
