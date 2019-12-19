const express = require('express');
const helmet = require('helmet')
// const session = require('express-session')//TO SETUP SESSION//
// const KnexSessionStore = require('connect-session-knex')(session);//TO SETUP SESSION//
const db = require('./data/db-config.js')
require('dotenv').config()


const ProjectRouter = require('./projects/project-router.js');
const AuthRouter = require('./projects/user-router.js');

const server = express();

//TO SETUP SESSION//
// const sessionConfig = {
//     name: 'chocolatechip',
//     secret: 'this is a secret',
//     cookie: {
//         maxAge: 1000 * 60 * 10,
//         secure: false,
//         httpOnly: true
//     },
//     resave:false,
//     saveUninitialized:false,

//     store: new KnexSessionStore({
        
//         knex: db,
//         createtable: true,
//         clearInterval: 1000 * 60 * 10,
//         sidfieldname: "sid",
//         tablename: "sessions",
//       })
// }

// server.use(session(sessionConfig));//TO SETUP SESSION//
server.use(helmet());
server.use(express.json());
server.use('/api/projects', ProjectRouter);
server.use('/api/user', AuthRouter);

module.exports = server;