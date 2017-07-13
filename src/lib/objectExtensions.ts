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