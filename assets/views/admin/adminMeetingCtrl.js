app.controller("adminMeetingCtrl", function ($scope, $http, $location) {

    if ($scope.loginUserDtls === undefined) {
        $location.path('/');
    }

    function getAllMeetings() {
        var req = {
            method: 'GET',
            url: '/getAllUserMeetings',
        };
        $http(req).success(function (data, status) {
            if (data !== undefined && data.length >= 1) {
                $scope.allUsersMeetings = data;
            } else {
                $scope.noMeetingMsg = "HOLA!! Not any meetings.";
            }
        }).error(function (err) {
            if (err) {
                $scope.meetingErrMsg = "Oops! Something went wrong! Please try again."
            }
        });
    }
    ;

    getAllMeetings();

    setInterval(function () {
        if ($scope.loginUserDtls !== undefined && $scope.realTimeFlag === false) {
            getAllMeetings();
        }
    }, 3000);

    $scope.askForDelete = function (id) {
        if (confirm('Are you sure you want to delete this meeting?')) {
            deleteMeeting(id);
        }
    };

    function deleteMeeting(id) {
        var req = {
            method: 'POST',
            url: '/deleteMeeting',
            data: {meeting_id: id}
        };
        $http(req).success(function (data) {
            if (data !== undefined && data.status !== "DELETE_FAILURE") {
                getAllMeetings();
            } else {
                $scope.meetingErrMsg = "Oops! Something went wrong! Please try again."
            }
        }).error(function (err) {
            if (err) {
                $scope.meetingErrMsg = "Oops! Something went wrong! Please try again."
            }
        });
    }
});