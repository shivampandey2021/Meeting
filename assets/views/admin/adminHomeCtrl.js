app.controller("adminHomeCtrl", function ($scope, $http, $location, $filter) {

    if ($scope.loginUserDtls === undefined) {
        $location.path('/');
    } else {
        getDashboardData();
        getDataAftrCountrCleared();
    }
    ;

    function getDashboardData() {
        var req = {
            method: 'GET',
            url: '/getDashboardData'
        };
        $http(req).success(function (data, status) {
            if (data !== undefined && data.status !== "NO_DATA") {
                $scope.dashboardData = data[0];
            } else {
                $scope.noDashboardData = "Oops! Something went wrong! Please try again.";
            }
        }).error(function (err) {
            if (err) {
                $scope.noDashboardData = "Oops! Something went wrong! Please try again.";
            }
        });
    }
    ;
    
    function getDataAftrCountrCleared(){
        var req = {
            method: 'GET',
            url: '/getDataAfterCounterCleared'
        };
        $http(req).success(function (data, status) {
            if (data !== undefined && data.status !== "NO_DATA") {
                $scope.dashboardDataAfterClear = data[0];
            } else {
                $scope.noDashboardData = "Oops! Something went wrong! Please try again.";
            }
        }).error(function (err) {
            if (err) {
                $scope.noDashboardData = "Oops! Something went wrong! Please try again.";
            }
        });
    };

    setInterval(function () {
        if ($scope.loginUserDtls !== undefined && $scope.realTimeFlag === false) {
            getDashboardData();
            getDataAftrCountrCleared();
        }
    }, 3000);

    $scope.stopRealTimeReport = function () {
        $scope.$parent.realTimeFlag = true;
    };

    $scope.startRealTimeReport = function () {
        $scope.$parent.realTimeFlag = false;
    };

    $scope.clearCounter = function () {
        if (confirm('Are you sure you want to clear counter?')) {
            var req = {
                method: 'GET',
                url: '/clearCounter'
            };
            $http(req).success(function (data, status) {
                if (data !== undefined && data.status !== "FAILURE") {
                    getDashboardData();
                } else {
                    $scope.noDashboardData = "Oops! Something went wrong! Please try again.";
                }
            }).error(function (err) {
                if (err) {
                    $scope.noDashboardData = "Oops! Something went wrong! Please try again.";
                }
            });
        }
    };
    
    
});