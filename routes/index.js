module.exports = function (app) {

    var userRouter = require('./module/userRouter');
    var meetingRouter = require('./module/meetingRouter');
    var adminRouter = require('./module/adminRouter');

    /*
     * Routes that can be accessed by any one
     */
    app.post('/login', userRouter.loginUser);
    app.post('/logOutUser', userRouter.logOutUser);

    app.post('/getAllMeetingsbyuserId', meetingRouter.getAllMeetingsbyuserId);
    app.post('/createNewMeeting', meetingRouter.createNewMeeting);
    app.post('/deleteMeeting', meetingRouter.deleteMeeting);


    /*
     * API's for ADMIN USER
     */
    app.get('/getAllUserMeetings', adminRouter.getAllUserMeetings);
    app.get('/getAllLoggedInUser', adminRouter.getAllLoggedInUser);
    app.get('/getDashboardData', adminRouter.getDashboardData);
    app.post('/deleteUserById', adminRouter.deleteUserById);
    app.get('/clearCounter', adminRouter.clearCounter);
    app.get('/getDataAfterCounterCleared', adminRouter.getDataAfterCounterCleared);
};
