
(function () {

$scope.MyFiles=[];

$scope.handler=function(e,files){
    var reader=new FileReader();
    reader.onload=function(e){
        var string=reader.result;
        var obj=$filter('csvToObj')(string);
        //do what you want with obj !
    }
    reader.readAsText(files[0]);
}

app.directive('fileChange',['$parse', function($parse){
  return{
    require:'ngModel',
    restrict:'A',
    link:function($scope,element,attrs,ngModel){
      var attrHandler=$parse(attrs['fileChange']);
      var handler=function(e){
        $scope.$apply(function(){
          attrHandler($scope,{$event:e,files:e.target.files});
        });
      };
      element[0].addEventListener('change',handler,false);
    }
  }

}]);

})();