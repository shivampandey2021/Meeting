app.controller("createMeetingCtrl", function ($scope, $http, $location) {

    if ($scope.loginUserDtls === undefined) {
        $location.path('/');
    }
    
    $scope.createMeeting = function (meetingObj) {
        var req = {
            method: 'POST',
            url: '/createNewMeeting',
            data: {meeting_name: meetingObj.name, start_dt: meetingObj.startDate, start_time: meetingObj.startTime, end_dt: meetingObj.EndDate,
                end_time: meetingObj.EndTime, created_by: $scope.loginUserDtls.user_id, created_by_name: $scope.loginUserDtls.full_name,
                created_by_email: $scope.loginUserDtls.email}
        };
        $http(req).success(function (data, status) {
            if (data.status !== "INSERT_FAILURE") {
                $location.path('mainPage');
            } else {
                $scope.createMeetingErr = "Oops! Something went wrong. Please try again.";
            }
        }).error(function (err) {
            if (err) {
                $scope.createMeetingErr = "Oops! Something went wrong. Please try again.";
            }
        });
    };

});