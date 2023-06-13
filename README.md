# Name That Player
Name That Player is a baseball player guessing game based on historical season statistics. A user is presented with hitting and/or pitching statistics of a former or current MLB player, and must deduce who it is based on the data. Players are allowed unlimited tries at guessing thhe correct player.

## Folder Structure
The client and server code are organized as a monorepo. As the folder names indicate, the `server/` folder contains the NestJS server, and the `client/` contains a Nuxt 3 front-end.

## Install
```bash
git clone https://github.com/andydeforest/name-that-player
cd name-that-player
```

### Configure & start server
```bash
cd server/
npm install
cp .env.example .env
# After updating your .env with your database credentials
npm run db:seed
# Launch server in dev mode
npm run start:dev
```

### Configure & start client
```bash
cd client/
npm install
# Launch client in dev mode
npm run dev
```