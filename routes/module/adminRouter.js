var commonRouter = require('./commonRouter');

exports.getAllUserMeetings = function (request, response, next) {
    console.log('Inside get All user meeting:-------------------');

    var localQuery = "SELECT * FROM meeting WHERE is_active = 1";
    commonRouter.mysql_pool.getConnection(function (err, connection) {
        console.log('getAllUserMeetings Query Is:-----  ' + localQuery);
        connection.query(localQuery, request.body, function (err, result) {
            connection.release();
            if (err)
                return next(err);
            if (result !== undefined && result.length >= 1) {
                response.send(JSON.stringify(result));
            } else {
                var resData = new Object();
                resData.status = "NO_DATA";
                response.send(JSON.stringify(resData));
            }
        });
    });
};

exports.getAllLoggedInUser = function (request, response, next) {
    console.log('Inside gett all logged in Users:----------------by Admin:---');

    var localQuery = "SELECT * FROM users WHERE is_loggedin = 1 AND is_active = 1";
    commonRouter.mysql_pool.getConnection(function (err, connection) {
        console.log('get All logged in users Query Is:-----  ' + localQuery);
        connection.query(localQuery, request.body, function (err, result) {
            connection.release();
            if (err)
                return next(err);

            if (result !== undefined && result.length >= 1) {
                response.send(JSON.stringify(result));
            } else {
                var resData = new Object();
                resData.status = "NO_DATA";
                response.send(JSON.stringify(resData));
            }
        });
    });
};

exports.getDashboardData = function (request, response, next) {
    console.log('Inside get Dashboard data for Admin:-----------');

    var localQuery = "SELECT (SELECT COUNT(*) FROM users WHERE is_active = 1) total_users, "
            + "(SELECT COUNT(*) FROM users WHERE is_loggedin = 1 AND is_active = 1) loggedin_users, "
            + "(SELECT COUNT(*) FROM meeting WHERE is_active = 1) total_meetings";
    commonRouter.mysql_pool.getConnection(function (err, connection) {
        console.log('get dashboard data for Admin Query Is:-----  ' + localQuery);
        connection.query(localQuery, request.body, function (err, result) {
            connection.release();
            if (err)
                return next(err);

            if (result !== undefined) {
                response.send(JSON.stringify(result));
            } else {
                var resData = new Object();
                resData.status = "NO_DATA";
                response.send(JSON.stringify(resData));
            }
        });
    });
};

exports.deleteUserById = function (request, response, next) {
    console.log('Going to delete loggedIn user:---------------' + request.body.user_id);

    var localQuery = "UPDATE users SET is_active = 0 WHERE user_id = " + request.body.user_id + "";
    commonRouter.mysql_pool.getConnection(function (err, connection) {
        console.log('delete user Query Is:-----  ' + localQuery);
        connection.query(localQuery, function (err, result) {
            connection.release();
            if (err)
                return next(err);

            if (result !== undefined && result.affectedRows === 1) {
                var resData = new Object();
                resData.status = "DELETE_SUCCESS";
                response.send(JSON.stringify(resData));
            } else {
                var resData = new Object();
                resData.status = "DELETE_FAILURE";
                response.send(JSON.stringify(resData));
            }
        });
    });
};

exports.clearCounter = function (request, response, next) {
    console.log('Inside clear all counter:----------------');

    var clearUserQuery = "UPDATE users SET is_active = 0";
    commonRouter.mysql_pool.getConnection(function (err, connection) {

        connection.beginTransaction(function (err) {

            console.log('clear user Query Is:-----  ' + clearUserQuery);
            connection.query(clearUserQuery, function (err, userResult) {
                if (err)
                    return next(err);

                if (userResult !== undefined && userResult.affectedRows >= 1) {
                    clearMeetingsCounter(connection, function (meetingResult) {
                        if (meetingResult.status === "FAILURE") {
                            connection.rollback(function () {
                                response.status(500);
                                return next();
                            });
                        } else {
                            setCounterClearTime(connection, function (meetingResult) {
                                if (meetingResult.status === "FAILURE") {
                                    connection.rollback(function () {
                                        response.status(500);
                                        return next();
                                    });
                                } else {
                                    connection.commit(function (err) {
                                        if (err) {
                                            connection.rollback(function () {
                                                return next(err);
                                            });
                                        } else {
                                            connection.release();
                                            var resData = new Object();
                                            resData.status = "SUCCESS";
                                            response.send(JSON.stringify(resData));
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    connection.release();
                    var resData = new Object();
                    resData.status = "FAILURE";
                    response.send(JSON.stringify(resData));
                }
            });
        });
    });
};

function clearMeetingsCounter(connection, callback) {
    var clearMeetingQuery = "UPDATE meeting SET is_active = 0";
    console.log('clear meeting Query Is:-----  ' + clearMeetingQuery);
    connection.query(clearMeetingQuery, function (err, meetingResult) {
        if (err) {
            var resData = new Object();
            resData.status = "FAILURE";
            resData.error = err;
            callback(resData);
        } else {
            if (meetingResult !== undefined && meetingResult.affectedRows >= 1) {
                var resData = new Object();
                resData.status = "SUCCESS";
                callback(resData);
            } else {
                var resData = new Object();
                resData.status = "FAILURE";
                callback(resData);
            }
        }
    });
}
;

function setCounterClearTime(connection, callback) {
    console.log('Going to set counter clear time:--------------');
    var newDate = new Date();
    var counterQuery = "UPDATE request_number_and_counter SET last_counter_time = NOW(), number_of_request = 0";
    console.log('set counter clear time Query Is:-----  ' + counterQuery);
    connection.query(counterQuery, function (err, counterResult) {
        if (err) {
            var resData = new Object();
            resData.status = "FAILURE";
            resData.error = err;
            callback(resData);
        } else {
            if (counterResult !== undefined && counterResult.affectedRows >= 1) {
                exports.lastCounterClearTime = newDate;
                var resData = new Object();
                resData.status = "SUCCESS";
                callback(resData);
            } else {
                var resData = new Object();
                resData.status = "FAILURE";
                callback(resData);
            }
        }
    });
}
;

exports.increaseRequestCount = function (connection, callback) {
    console.log('Going to increase request count:---------------');
    var counterQuery = "UPDATE request_number_and_counter SET number_of_request = (number_of_request+1)";
    console.log('set counter clear time Query Is:-----  ' + counterQuery);
    connection.query(counterQuery, function (err, counterResult) {
        if (err) {
            var resData = new Object();
            resData.status = "FAILURE";
            resData.error = err;
            callback(resData);
        } else {
            if (counterResult !== undefined && counterResult.affectedRows >= 1) {
                var resData = new Object();
                resData.status = "SUCCESS";
                callback(resData);
            } else {
                var resData = new Object();
                resData.status = "FAILURE";
                callback(resData);
            }
        }
    });
};

exports.getDataAfterCounterCleared = function (request, response, next) {

    var localQuery = "SELECT (SELECT COUNT(*) FROM meeting WHERE is_active = 1 AND dt_created > DATE_FORMAT((SELECT last_counter_time FROM request_number_and_counter),'%Y-%m-%d %T')) scheduled_meeting, "
            + "(SELECT COUNT(*) FROM meeting WHERE is_active = 0 AND dt_created > DATE_FORMAT((SELECT last_counter_time FROM request_number_and_counter),'%Y-%m-%d %T')) cancelled_meeting, "
            + "(SELECT number_of_request FROM request_number_and_counter) total_request";
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