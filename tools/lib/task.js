// https://medium.com/@tarkus/build-automation-with-vanilla-javascript-74639ec98bad

/*
 * Minimalistic script runner. Usage example:
 *
 *     node tools/db.js migrate
 *     Starting 'db:migrate'...
 *     Finished 'db:migrate' in 25ms
 */

function run(task, action, ...args) {
  const command = process.argv[2];
  const taskName = command && !command.startsWith('-') ? `${task}:${command}` : task;
  const start = new Date();
  console.log(`Starting '${taskName}'...\n`);
  return Promise.resolve()
    .then(() => action(...args))
    .then(() => {
      console.log(`Finished '${taskName}' after ${new Date().getTime() - start.getTime()}ms\n`);
    }, err => {
      console.error(err.message)
      process.stderr.write(`${err.stack}\n`)
    })
    .catch(err => {
      console.error(err)
    });
}

process.nextTick(() => require.main.exports());
module.exports = (task, action) => run.bind(undefined, task, action);