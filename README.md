# trible
opinionated, universal react bootstrap webapp

## Installation

You can clone from this repository or [install the latest version](https://github.com/llyys/trible/releases) as a zip file or a tarball.

```bash
$ git clone https://github.com/llyys/trible
$ cd trible
$ npm install
$ npm run rebuild
```


#Postgresql with docker

https://docs.docker.com/samples/postgres/#start-a-postgres-instance

```
docker run --name trible-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=trible --restart=always -p 5432:5432 -d postgres 
```

To run migrations you can use custom tool.

To generate a new migration step.

node tools\db create new_stepname