/**
 * to wrap async action into trycatch function
 * router.get('/getData/:code', trycatch(async (req, res, next) => {
      let data = await api.get(req.params.code);
      res.json(data);
  }));
 */

//export const trycatch = fn => (...args) => fn(...args).catch(args[2]);
export const trycatch = fn => (req, res, next) => fn(req, res).catch(next);

export const isFunction = (x) => typeof x === 'function';

// helper mehtod to print out object methods
export function printObjectFunctions(obj) {
  var result = [];
  for (var id in obj) {
    try {
      if (typeof(obj[id]) == "function") {
        result.push(id + ": " + obj[id].toString());
      }
    } catch (err) {
      result.push(id + ": inaccessible");
    }
  }
  return result.join("\n");
}

export function callbackToPromise(method, ...args) {
  return new Promise(function(resolve, reject) {
      return method(...args, function(err, result) {
          return err ? reject(err) : resolve(result);
      });
  });
}