
//this can be used as
// app.get('/', wrap(async (req, res) => { ... }))
let wrap = fn => (...args) => fn(...args).catch(args[2])
/*
actually it is the same...
function wrap (cb) { // 1
    return function (req, res, next) { // 3
        cb(req, res, next).catch(next) // 4
    }
}
*/