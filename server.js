var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
//CONSOLE FUNCTIONS - DEBUGGING
var chalk = require('chalk');
var print_success_status = function (text) {
    console.log(chalk.underline.bgGreen.black(text));
};
var print_error_status = function (text) {
    console.log(chalk.underline.bgRed.white(text));
};
var print_success_login = function (text) {
    console.log(chalk.underline.bgBlue.black('+') + chalk.underline.bgGreenBright.black(text));
};
var print_error_login = function (text) {
    console.log(chalk.underline.bgBlue.black('+') + chalk.underline.bgRedBright.black(text));
};
var print_general_status = function (text) {
    console.log(chalk.underline.bgWhite.black(text));
};
var log = console.log;
function proxiedLog() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var line = (((new Error('log'))
        .stack.split('\n')[2] || '…')
        .match(/\(([^)]+)\)/) || [, 'not found'])[1];
    log.call.apply(log, __spreadArray([console, line + "\n"], args));
}
console.info = proxiedLog;
var print_line = function (text) {
    console.info(text);
};
//EXPRESS
var express = require('express');
var router = express.Router();
var cors = require('cors');
var cookieParser = require('cookie-parser');
var app = require('express')();
//OTHERS
var querystring = require('querystring');
var request = require('request');
var node_fetch = require('node-fetch');
var ss = require("string-similarity");
require('dotenv').config();
//SERVER
var server = app.listen(process.env.PORT, function () {
    print_success_status('Connected to: ' + process.env.PORT);
});
//SOCKET
var options = { /* ... */};
var io = require('socket.io')(server, options);
exports.io = io;
//DATABASE - MongoDB & Mongoose
var mongoose = require('mongoose');
router.route('/').get(function (req, res) {
    print_general_status('User fetched.');
});
app.use('/api', router);
app.use(express.static("../Frontend/public"))
    .use(cors())
    .use(cookieParser());
//DATABASE
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function (res) { return print_success_status('Connected to MongoDB.'); })["catch"](function (err) { return print_error_status("Can't connect to MongoDB."); });
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
app.get('/', function (req, res) {
    res.send({ title: 'Connection established to the Spotify Quiz API', status: 200 });
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    print_general_status('Connection established to / from: ' + ip);
});
var user_functions = require('./support_functions/user_functions.js');
app.get('/logged_in/:data', function (req, res) {
    var username = req.params.data.split('&')[3].split('=')[1];
    var id = req.params.data.split('&')[2].split('=')[1];
    user_functions.find_user(id)
        .then(function (DB_data) {
        if (DB_data.length === 0) {
            //FIRST LOGIN
            var token = generateRandomString(16);
            user_functions.init_new_user(id, username, token);
            res.send({ title: 'Initialized that user', user: id });
        }
        else {
            //NOT FIRST LOGIN
            var type = 'login';
            var token = generateRandomString(16);
            user_functions.find_update_user(id, type, token)
                .then(function (new_data) {
                res.send({ title: 'Success finding user', user: new_data });
            });
        }
    })["catch"](function (err) {
        res.send({ title: 'Error', user: "Finding user error at /logged_in/:data", errorMessage: err });
        print_line('Error find user.');
    });
});
app.get('/get_user/:id', function (req, res) {
    var id = req.params.id;
    user_functions.find_user(id)
        .then(function (DB_data) {
        if (DB_data.length === 0) {
            res.send({ title: "Error", msg: "Can't find that user", id: id });
        }
        else {
            res.send({ title: "Success", msg: 'Found user', user: DB_data });
        }
    })["catch"](function (err) {
        res.send({ title: 'Error', user: "Finding user error at /get_user/:id", errorMessage: err });
        print_line('Error find user.');
    });
});
//SAVE PLAYLIST INFO
//FIRST TIME PLAYED
//SAVE ROOM INFO
//OPEN ROOM
//UPDATE INDIVIDUAL USER INFO
//PLAY PLAYLIST
//CORRECT GUESS
//INCORRECT GUESS
//WON ROOM
//UPDATE ROOM INFO
//USER LEFT
//USER JOINED
//PLAYBACK STATE
//CURRENT SONG
//GUESS
//TEXT
//REMOVE ROOM INFO
//CLOSE SPECIFIC ROOM
//GET RECOMMENDED PLAYLISTS
//GET USER INFO
//GET PLAYLIST INFO
//GET ROOM INFO
var client_id = '94ac88d39834494da4f490e1b0cb0ef2'; // Your client id
var client_secret = '9b029b88d0364f1590456f0e2f11dd5c'; // Your secret
var redirect_uri = 'http://1077c55ed1e8.ngrok.io/callback'; // Your redirect uri
var stateKey = 'spotify_auth_state';
app.get('/login', function (req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    // your application requests authorization
    var scope = "playlist-modify-public \n\t\t\t\t   playlist-modify-private \n\t\t\t\t   playlist-read-private \n\t\t\t\t   playlist-read-collaborative\n\t\t\t\t   user-library-modify\n\t\t\t\t   user-library-read\n\t\t\t\t   app-remote-control\n\t\t\t\t   user-read-currently-playing\n\t\t\t\t   user-modify-playback-state\n\t\t\t\t   user-read-playback-state\n\t\t\t\t   user-read-recently-played\n\t\t\t\t   user-top-read\n\t\t\t\t   user-read-playback-position";
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});
app.get('/callback', function (req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    }
    else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token, refresh_token = body.refresh_token;
                // we can also pass the token to the browser to make requests from there
                node_fetch("https://api.spotify.com/v1/me", {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + access_token,
                        "Content-Type": "application/json"
                    }
                })
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                    res.redirect('/logged_in/' +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token,
                            id: data.id,
                            username: data.display_name
                        }));
                    print_success_login(data.display_name + ' successfully logged in.');
                });
            }
            else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
                print_error_login('User unsuccessfully logged in.' + { error: 'Invalid token.' });
            }
        });
    }
});
app.get('/refresh_token', function (req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    })["catch"](function (err) {
        console.log(err);
    });
});
