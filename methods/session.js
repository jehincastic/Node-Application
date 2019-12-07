const UserSession = require('../models/userSession'),
      keyGeneration = require("./keyGeneration"),
      { successResponse, failureResponse } = require('../methods/response');

module.exports = {
    sessionGeneratorRegister: (user, res) => {
        const userSession = new UserSession({
            userId: user['_id'],
            sessionId: keyGeneration.sessionIdGenerator(),
            loggedInTime: new Date()
        });
        userSession.save()
            .then(result => {
                const responseData = {
                    _id: user['_id'],
                    name: user['name'],
                    email: user['email'],
                    sessionId: result['sessionId']
                };
                successResponse(res, responseData);
            })
            .catch(err => {
                failureResponse(res, err);
            });
    },
    sessionGeneratorLogin: (user, res) => {
        const newUserSession = new UserSession({
            userId: user['_id'],
            sessionId: keyGeneration.sessionIdGenerator(),
            loggedInTime: new Date()
        });
        UserSession
            .updateMany(
                {
                    userId: user['_id'], 
                    expired: false
                }, { 
                    expired: true, 
                    loggedOutMode: "FORCE" 
                }
            )
            .then(data => {
                newUserSession.save()
                    .then(result => {
                        const responseData = {
                            _id: user['_id'],
                            name: user['name'],
                            email: user['email'],
                            sessionId: result['sessionId']
                        };
                        successResponse(res, responseData);
                    })
                    .catch(err => {
                        failureResponse(res, err);
                    })
            })
            .catch(err => {
                failureResponse(res, err);
            })
    },
    invalidateSession: (time) => {
        return new Promise((resolve, reject) => {
            UserSession
                .updateMany(
                    {
                        "loggedInTime": {"$lt": time}, 
                        "expired": false
                    }, { 
                        expired: true, 
                        loggedOutMode: "TIMED OUT" 
                    }
                )
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    validateAndUpdateSession: (req, res, next) => {
        const { sessionId, userId } = req.body;
        if (sessionId && userId) {
            UserSession.findOne({sessionId})
                .then(userSession => {
                    if (userSession) {
                        if (!userSession.expired && userSession.userId == userId) {
                            UserSession.findOneAndUpdate({sessionId}, {loggedInTime: new Date()})
                                .then(data => {
                                    next();
                                })
                                .catch(err => {
                                    failureResponse(res, "Could Not Authenticate");
                                })
                        } else {
                            failureResponse(res, userSession.userId != userId ? "Invalid Session" : "Session Expired");
                        }
                    } else {
                        failureResponse(res, "Invalid Session");
                    }
                })
                .catch(err => {
                    failureResponse(res, "Could Not Authenticate");
                })
        } else {
            failureResponse(res, sessionId ? 'User Id Missing' : 'Session Id Missing')
        }
    }
}