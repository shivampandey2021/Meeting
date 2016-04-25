var commonRouter = require('./commonRouter');
var bcrypt = require('bcrypt-nodejs');
var adminRouter = require('./adminRouter');

exports.loginUser = function (request, response, next) {
    console.log('Inside loginUser:----------------' + JSON.stringify(request.body, null, 4));
    var username = request.body.username;
    var password = request.body.password;
    if (username === undefined || password === undefined) {
        response.status(401);
        response.json({
            "status": 401,
            "message": "Invalid credentials"
        });
        return;
    } else {
        var locaQuery = "SELECT * from users WHERE user_status='ACTIVE' and username='" + username + "'";
        commonRouter.mysql_pool.getConnection(function (err, connection) {

            connection.query(locaQuery, function (err, rows) {
                if (err)
                    return next(err);

                adminRouter.increaseRequestCount(connection, function (increaseResult) {
                    if (increaseResult.status === "FAILURE") {
                        response.status(500);
                        return next();
                    } else {
                        console.log('Query IS :----' + locaQuery + 'Result Is--------' + JSON.stringify(rows[0]) + 'Length is----' + rows.length);
                        if (rows.length === 0) {
                            connection.release();
                            var loginData = new Object();
                            loginData.status = 401;
                            loginData.message = "Invalid credentials";
                            console.log('Rows is:------------ >' + JSON.stringify(loginData));
                            response.send(JSON.stringify(loginData));
                        } else {
                            console.log("Compare pwd=" + bcrypt.hashSync(password));
                            bcrypt.compare(password, rows[0].password, function (err, res) {
                                console.log("Compare pwd=" + res);
                                if (res === null) {
                                    connection.release();
                                    var loginData = new Object();
                                    loginData.status = 401;
                                    loginData.message = "Invalid credentials";
                                    response.send(JSON.stringify(loginData));
                                }
                                if (res === true) {
                                    var loginTimeQuery = "UPDATE users SET is_loggedin = 1, loggedin_time = NOW() WHERE user_id = " + rows[0].user_id + "";
                                    console.log('QUERY IS:-------------- ' + loginTimeQuery);
                                    connection.query(loginTimeQuery, function (err, updateResult) {
                                        connection.release();
                                        if (err)
                                            return next(err);

                                        if (updateResult !== undefined && updateResult.affectedRows === 1) {
                                            var dbUserObj = JSON.stringify(rows);
                                            response.send(dbUserObj);
                                        }
                                    });

                                } else if (res === false) { // If authentication fails, we send a 401 back
                                    connection.release();
                                    var loginData = new Object();
                                    loginData.status = 401;
                                    loginData.message = "Invalid credentials";
                                    response.send(JSON.stringify(loginData));
                                }
                            });
                        }
                    }
                });
            });
        });
    }
};

exports.logOutUser = function (request, response, next) {
    console.log('Goin to logout user:--------------' + request.body.user_id);

    var localQuery = "UPDATE users SET is_loggedin = 0 WHERE user_id = " + request.body.user_id + "";
    commonRouter.mysql_pool.getConnection(function (err, connection) {
        console.log('logout Query Is:-----  ' + localQuery);
        connection.query(localQuery, function (err, result) {
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
                        resData.status = "LOGOUT_SUCCESS";
                        response.send(JSON.stringify(resData));
                    }
                });
            } else {
                var resData = new Object();
                resData.status = "LOGOUT_FAILURE";
                response.send(JSON.stringify(resData));
            }
        });
    });
};