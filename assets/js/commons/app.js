"use strict";

var app = angular.module('myApp', ['ngRoute']);

//rout provider

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/login', {
                    templateUrl: 'views/login/login.html',
                }).
                when('/mainPage', {
                    templateUrl: 'views/userHomePage/mainPage.html',
                    controller: 'mainPageCtrl'
                }).
                when('/createMeeting', {
                    templateUrl: 'views/meeting/createMeeting.html',
                    controller: 'createMeetingCtrl'
                }).
                when('/homePage/admin', {
                    templateUrl: 'views/admin/adminHomePage.html',
                    controller: 'adminHomeCtrl'
                }).
                when('/meetingPage/admin', {
                    templateUrl: 'views/admin/adminMeetingPage.html',
                    controller: 'adminMeetingCtrl'
                }).
                when('/usersPage/admin', {
                    templateUrl: 'views/admin/users.html',
                    controller: 'adminUsersCtrl'
                }).
                otherwise({
                    redirectTo: '/login'
                });
    }]);