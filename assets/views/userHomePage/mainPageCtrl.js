app.controller("mainPageCtrl", function ($scope, $http, $location, $filter) {

    if ($scope.loginUserDtls === undefined) {
        $location.path('/');
    } else {
        getAllMeetingsbyuserId();
    }
    ;
    function getAllMeetingsbyuserId() {
        var req = {
            method: 'POST',
            url: '/getAllMeetingsbyuserId',
            data: {user_id: $scope.loginUserDtls.user_id}
        };
        $http(req).success(function (data, status) {
            if (data !== undefined && data.status !== "NO_DATA") {
                for (var count in data) {
                    data[count].start_dt = $filter('date')(new Date(data[count].start_dt), 'yyyy-MM-dd');
                    data[count].end_dt = $filter('date')(new Date(data[count].end_dt), 'yyyy-MM-dd');
                }
                $scope.allMeetings = data;
            } else {
                $scope.noMeeting = "There is not any meeting. Lets create."
            }
        }).error(function (err) {
            if (err) {
                $scope.meetingErrMsg = "Oops! Something went wrong! Please try again.";
            }
        });
    }
    ;

    $scope.askForDelete = function (id) {
        if (confirm('Are you sure you want to cancel this meeting?')) {
            deleteMeeting(id);
        }
    };

    function deleteMeeting(id) {
        var req = {
            method: 'POST',
            url: '/deleteMeeting',
            data: {meeting_id: id}
        };
        $http(req).success(function (data, status) {
            if (data !== undefined && data.status !== "DELETE_FAILURE") {
                getAllMeetingsbyuserId();
            } else {
                $scope.meetingErrMsg = "Oops! Something went wrong! Please try again.";
            }
        }).error(function (err) {
            if (err) {
                $scope.meetingErrMsg = "Oops! Something went wrong! Please try again.";
            }
        });
    }
    ;

});