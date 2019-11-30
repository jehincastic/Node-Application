const { invalidateSession } = require("../methods/session"),
    thirtyMinutes = 30 * 1000 * 60;

module.exports = {
    sessionScheduler: () => {
        return new Promise((resolve, reject) => {
            const time = new Date(new Date() - thirtyMinutes);
            invalidateSession(time)
                .then(data => {
                    resolve("Session Invalidation Completed")
                })
                .catch(err => {
                    reject("Session Invalidation Failed")
                })
        })
    }
}