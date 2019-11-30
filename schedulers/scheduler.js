const { sessionScheduler } = require("./sessionScheduler");

let schedulerFlag = true;

const intervalFunc = () => {
    return new Promise((resolve, reject) => {
        if (schedulerFlag) {
            schedulerFlag = false;
            Promise.all([sessionScheduler()])
                .then(data => {
                    schedulerFlag = true;
                    console.log("Scheduler Done....", new Date())
                    resolve(true);
                })
                .catch(err => {
                    schedulerFlag = true;
                    console.log("Scheduler Catch...", new Date());
                    reject(true);
                })
        } else {
            resolve(true);
        }
    })
}

module.exports = {
    scheduler: () => {
        intervalFunc()
            .then(() => {
                console.log("First Time Scheduler Completed....", new Date());
                setInterval(intervalFunc, 60000);
            })
            .catch(() => {
                console.log("First Time Scheduler Error....", new Date());
                setInterval(intervalFunc, 60000);
            })
    }
}