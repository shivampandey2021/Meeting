var commonRouter = require('./commonRouter');
var adminRouter = require('./adminRouter');

exports.getAllMeetingsbyuserId = function (request, response, next) {
    console.log('Inside gett All Meeting By user_id:=-----------' + request.body.user_id);

    var localQuery = "SELECT * FROM meeting WHERE created_by = " + request.body.user_id + " AND is_active = 1";
    commonRouter.mysql_pool.getConnection(function (err, connection) {
        console.log('getAllMeeting Query Is:-----  ' + localQuery);
        connection.query(localQuery, function (err, result) {
            connection.release();
            if (err)
                return next(err);

            if (result !== undefined && result.length > 0) {
                response.send(JSON.stringify(result));
            } else {
                var resData = new Object();
                resData.status = "NO_DATA";
                response.send(JSON.stringify(resData));
            }
        });
    });
};

exports.createNewMeeting = function (request, response, next) {
    request.body.dt_created = new Date();

    console.log('Inside create new Meeting:-------------' + JSON.stringify(request.body, null, 4));

    var localQuery = "INSERT INTO meeting SET ?";
    commonRouter.mysql_pool.getConnection(function (err, connection) {
        console.log('createNewMeeting Query Is:-----  ' + localQuery);
        connection.query(localQuery, request.body, function (err, result) {
            connection.release();
            if (err)
                return next(err);
            if (result !== undefined) {
                adminRouter.increaseRequestCount(connection, function (increaseResult) {
                    if (increaseResult.status === "FAILURE") {
                        response.status(500);
                        return next();
                    } else {
                        var resData = new Object();
                        resData.status = "INSERT_SUCCESS";
                        response.send(JSON.stringify(resData));
                    }
                });
            } else {
                var resData = new Object();
                resData.status = "INSERT_FAILURE";
                response.send(JSON.stringify(resData));
            }
        });
    });
};

exports.deleteMeeting = function (request, response, next) {
    console.log('Going to delete Meeting:----------------' + request.body.meeting_id);

    var localQuery = "UPDATE meeting SET is_active = 0 WHERE meeting_id = " + request.body.meeting_id + "";
    commonRouter.mysql_pool.getConnection(function (err, connection) {
        console.log('deleteMeeting Query Is:-----  ' + localQuery);
        connection.query(localQuery, request.body, function (err, result) {
            connection.release();
            if (err)
                return next(err);
            if (result !== undefined && result.affectedRows === 1) {
                adminRouter.increaseRequestCount(connection, function (increaseResult) {
                    if (increaseResult.status === "FAILURE") {
                        response.status(500);
                        return next();
                    } else {
                        var resData = new Object();
                        resData.status = "DELETE_SUCCESS";
                        response.send(JSON.stringify(resData));
                    }
                });
            } else {
                var resData = new Object();
                resData.status = "DELETE_FAILURE";
                response.send(JSON.stringify(resData));
            }
        });
    });
};
