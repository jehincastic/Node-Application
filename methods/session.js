const UserSession = require('../models/userSeesion'),
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
    }
}