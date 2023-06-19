# Name That Player
Name That Player is a baseball player guessing game based on historical season statistics. A user is presented with hitting and/or pitching statistics of a former or current MLB player, and must deduce who it is based on the data. Players are allowed unlimited tries at guessing thhe correct player.

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm run dev
```

## Project structure

```
root
├── apps
│   ├── client
│   │   ├── app.vue
│   │   ├── apps
│   │   ├── public
│   │   └── tsconfig.json
│   └── server
│       ├── src
│       ├── test
│       └── tsconfig.app.json
├── dist
│   └── apps
│       └── server
├── nest-cli.json
├── nuxt.config.ts
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```