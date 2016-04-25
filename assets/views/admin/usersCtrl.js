app.controller("adminUsersCtrl", function ($scope, $http, $location, $filter) {

    if ($scope.loginUserDtls === undefined) {
        $location.path('/');
    } else {
        getAllLoggedInUser();
    }
    ;

    function getAllLoggedInUser() {
        var req = {
            method: 'GET',
            url: '/getAllLoggedInUser'
        };
        $http(req).success(function (data, status) {
            if (data !== undefined && data.status !== "NO_DATA") {
                $scope.allLoggedInUsers = data;
            } else {
                $scope.noLoggedInUser = "There is not any logged-in user."
            }
        }).error(function (err) {
            if (err) {
                $scope.loggedinUserErr = "Oops! Something went wrong! Please try again.";
            }
        });
    }
    ;

    setInterval(function () {
        if ($scope.loginUserDtls !== undefined && $scope.realTimeFlag === false) {
            getAllLoggedInUser();
        }
    }, 3000);

    $scope.timeAgo = function (createTime) {
        var d1 = new Date(createTime);
        var d2 = new Date();
        var miliseconds = d2 - d1;
        var seconds = miliseconds / 1000;
        var minutes = seconds > 60 ? seconds / 60 : 0;
        var hours = minutes > 60 ? minutes / 60 : 0;
        var days = hours > 24 ? hours / 24 : 0;
        if (days > 0)
            return Math.round(days) + " days ago";
        if (hours > 0)
            return Math.round(hours) + " hours ago";
        if (minutes > 0)
            return Math.round(minutes) + " minutes ago";
        return Math.round(seconds) + " seconds ago";
    };

    $scope.askForDeleteUser = function (id) {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUser(id);
        }
    };
    
    function deleteUser(id){
        var req = {
            method: 'POST',
            url: '/deleteUserById',
            data: {user_id: id}
        };
        $http(req).success(function (data) {
            if (data !== undefined && data.status !== "DELETE_FAILURE") {
                getAllLoggedInUser();
            } else {
                $scope.loggedinUserErr = "Oops! Something went wrong! Please try again.";
            }
        }).error(function (err) {
            if (err) {
                $scope.loggedinUserErr = "Oops! Something went wrong! Please try again.";
            }
        });
    }
});