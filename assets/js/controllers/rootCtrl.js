app.controller("rootCtrl", function ($scope, $http, $location) {

    $scope.logoutFlag = false;
    $scope.realTimeFlag = false;

    $scope.loginUser = function (loginUser) {
        $scope.loginFailMsg = "";

        $http.post('/login',
                {"username": loginUser.loginEmail, "password": loginUser.loginPassword})
                .success(function (data, status, header, config) {
                    if (data.status !== 401) {
                        $scope.logoutFlag = true;
                        $scope.loginUserDtls = data[0];
                        if ($scope.loginUserDtls.user_role === "ADMIN") {
                            $location.path('/homePage/admin');
                        } else {
                            $location.path('mainPage');
                        }
                    } else {
                        $scope.loginFailMsg = "Invalid Email Or Password.";
                    }

                }).error(function (err) {
            if (err) {
                $scope.loginFailMsg = "Invalid Email Or Password."
            }
        });
    };

    $scope.logoutUser = function () {
        if ($scope.loginUserDtls !== undefined) {
            var req = {
                method: 'POST',
                url: '/logOutUser',
                data: {user_id: $scope.loginUserDtls.user_id}
            };
            $http(req).success(function (data, status) {
                if (data !== undefined && data.status !== "LOGOUT_FAILURE") {
                    $scope.loginUserDtls = undefined;
                    $location.path("/");
                    $scope.logoutFlag = false;
                } else {
                    $scope.logoutErrMsg = "Oops! Something went wrong. Please try again.";
                }
            }).error(function (err) {
                if (err) {
                    $scope.logoutErrMsg = "Oops! Something went wrong. Please try again."
                }
            });
        }
    };

    window.onbeforeunload = function ()
    {
        return $scope.logoutUser();
    };

});