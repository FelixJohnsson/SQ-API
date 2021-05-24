var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var _this = this;
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
var print_connection_established = function (text) {
    console.log(chalk.underline.bgBlue.black(text));
};
var print_socket_attached = function (text) {
    console.log(chalk.underline.bgGreen.black('+') + chalk.underline.bgBlue.black(text));
};
var print_socket_detached = function (text) {
    console.log(chalk.underline.bgRed.black('-') + chalk.underline.bgRed.black(text));
};
var log = console.log;
function proxiedLog() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    //@ts-ignore
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
app.use(express.static("public"))
    .use(cors())
    .use(cookieParser());
//DATABASE
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function (res) { return print_success_status('Connected to MongoDB.'); })["catch"](function (err) { return print_error_status('Failed to connect to MongoDB.'); });
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
    res.sendFile(__dirname + '/public/landingpage/landingpage.html');
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    print_connection_established('Connection established to / from: ' + ip);
});
//@ts-ignore
var user_functions = require('./support_functions/user_functions.js');
app.get('/logged_in/:data', function (req, res) {
    var username = req.params.data.split('&')[3].split('=')[1];
    var id = req.params.data.split('&')[2].split('=')[1];
    user_functions.get_user(id)
        .then(function (DB_data) {
        if (DB_data.length === 0) {
            //FIRST LOGIN
            var token = generateRandomString(16);
            user_functions.init_user(id, username, token);
        }
        else {
            //NOT FIRST LOGIN
            var type = 'login';
            var token = generateRandomString(16);
            user_functions.update_user(id, type, token);
        }
    })["catch"](function (err) {
        print_line('Error find user.');
    });
    res.sendFile(__dirname + '/public/logged_in/logged_in.html');
});
app.get('/get_user/:id', function (req, res) {
    var id = req.params.id;
    user_functions.get_user(id)
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
//@ts-ignore
var playlist_functions = require('./support_functions/playlist_functions.js');
app.get('/get_recommended', function (req, res) {
    playlist_functions.get_recommended()
        .then(function (DB_data) {
        res.send({ title: 'Success', content: DB_data });
    })["catch"](function (err) {
        res.send({ title: 'Error', user: "Finding user error at /get_user/:id", errorMessage: err });
        print_line('Error find user.');
    });
});
app.get('/post_recommended/:link/:token', function (req, res) {
    var URI = req.params.link.split('/')[4].split('?')[0];
    node_fetch("https://api.spotify.com/v1/playlists/" + URI, {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + req.params.token,
            "Content-Type": "application/json"
        }
    })
        .then(function (res) { return res.json(); })
        .then(function (playlist_object) {
        playlist_functions.add_recommended(playlist_object);
        res.sendStatus(200);
    })["catch"](function (err) {
        res.sendStatus(400);
    });
});
//@ts-ignore
var room_functions = require('./support_functions/room_functions.js');
app.get('/create_room/:URI/:token/:id', function (req, res) {
    node_fetch("https://api.spotify.com/v1/playlists/" + req.params.URI, {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + req.params.token,
            "Content-Type": "application/json"
        }
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
        room_functions.create_new_room(data, req.params.id)
            .then(function (room_data) {
            var object = {
                status: 200,
                room_id: room_data.id
            };
            res.send(object);
        });
    });
});
app.get('/room/:id/:display_name', function (req, res) {
    res.sendFile(__dirname + '/public/room/room.html');
});
app.get('/get_room/:id', function (req, res) {
    room_functions.get_room(req.params.id)
        .then(function (data) {
        res.send(data);
    });
});
app.get('/request_start/:room/:id', function (req, res) {
    var room = req.params.room;
    room_functions.get_room(req.params.room)
        .then(function (room_object) {
        if (room_object[0].paused) {
            var body = {
                context_uri: room_object[0].uri,
                offset: {
                    position: room_object[0].currently_playing_offset
                },
                position_ms: room_object[0].progress_ms
            };
            var track = {
                track_name: room_object[0].currently_playing_track,
                artist: room_object[0].currently_playing_artist
            };
            room_emit(room, 'Track started', { body: body, track: track, show: false });
        }
        else {
            room_functions.update_room(req.params.room, 'Increment room')
                .then(function (room_object) {
                var body = {
                    context_uri: room_object.uri,
                    offset: {
                        position: room_object.currently_playing_offset
                    },
                    position_ms: room_object.progress_ms
                };
                var track = {
                    track_name: room_object.currently_playing_track,
                    artist: room_object.currently_playing_artist
                };
                room_emit(room, 'Track started', { body: body, track: track, show: true });
            });
        }
    });
    res.sendStatus(200);
});
app.get('/request_pause/:room/:id/:offset', function (req, res) {
    var room = req.params.room;
    var offset = req.params.offset;
    room_functions.update_room(room, 'Pause', offset);
    room_emit(room, 'Track paused');
    res.sendStatus(200);
});
app.get('/request_next/:room/:id/', function (req, res) {
    var room = req.params.room;
    room_functions.update_room(req.params.room, 'Increment room')
        .then(function (room_object) {
        var body = {
            context_uri: room_object.uri,
            offset: {
                position: room_object.currently_playing_offset
            },
            position_ms: room_object.progress_ms
        };
        var track = {
            track_name: room_object.currently_playing_track,
            artist: room_object.currently_playing_artist
        };
        room_emit(room, 'Track started', { body: body, track: track, show: true });
    });
    res.sendStatus(200);
});
var room_emit = function (room, title, content) {
    if (title === void 0) { title = 'null'; }
    if (content === void 0) { content = 'null'; }
    io.to(room).emit(title, { content: content });
};
var socket_emit = function (socket, title, content) {
    if (title === void 0) { title = 'null'; }
    if (content === void 0) { content = 'null'; }
    socket.emit(title, { content: content });
};
var init_io = function () {
    io.on('connection', function (socket) { return __awaiter(_this, void 0, void 0, function () {
        var room, id;
        var _this = this;
        return __generator(this, function (_a) {
            room = socket.handshake.headers.referer.split('/')[4];
            id = socket.handshake.headers.referer.split('/')[5];
            socket.join(room);
            user_functions.get_user(id)
                .then(function (user_data) {
                if (user_data.length === 0) {
                    var new_guest_1 = {
                        id: id,
                        username: 'Guest'
                    };
                    room_functions.get_room(room)
                        .then(function (room_data) {
                        if (room_data.length != 0) {
                            var user_in_room = room_data[0].players.findIndex(function (el) { return el.id === id; });
                            if (user_in_room === -1) {
                                room_functions.add_player(room, new_guest_1)
                                    .then(function (room_data) { return room_emit(room, 'Guest joined', room_data.players); });
                            }
                        }
                    });
                }
                else {
                    room_functions.get_room(room)
                        .then(function (room_data) {
                        if (room_data.length != 0) {
                            var user_in_room = room_data[0].players.findIndex(function (el) { return el.id === id; });
                            if (user_in_room === -1) {
                                room_functions.add_player(room, user_data[0])
                                    .then(function (new_room_data) { return room_emit(room, 'Player joined', new_room_data.players); });
                            }
                            else {
                                room_emit(room, 'Player joined', room_data[0].players);
                            }
                        }
                    });
                }
            });
            socket.on('disconnect', function () { return __awaiter(_this, void 0, void 0, function () {
                var room, id;
                return __generator(this, function (_a) {
                    room = socket.handshake.headers.referer.split('/')[4];
                    id = socket.handshake.headers.referer.split('/')[5];
                    room_functions.remove_player(room, id)
                        .then(function (room_data) {
                        room_emit(room, 'Player left', room_data.players);
                        print_socket_detached(id + ' left room: ' + room);
                    });
                    return [2 /*return*/];
                });
            }); });
            socket.on('message', function (object) { return __awaiter(_this, void 0, void 0, function () {
                var room, id;
                return __generator(this, function (_a) {
                    room = socket.handshake.headers.referer.split('/')[4];
                    id = socket.handshake.headers.referer.split('/')[5];
                    room_functions.get_room(room)
                        .then(function (room_data) {
                        room_data = room_data[0];
                        if (room_data.currently_playing_track != null) {
                            var msg = object.message.toUpperCase();
                            var artist = room_data.currently_playing_artist.toUpperCase();
                            var track = room_data.currently_playing_track.toUpperCase();
                            var artist_match = ss.compareTwoStrings(msg, artist);
                            var track_match = ss.compareTwoStrings(msg, track);
                            var complete_match_1 = ss.compareTwoStrings(msg, track + artist);
                            var complete_match_2 = ss.compareTwoStrings(msg, artist + track);
                            if (complete_match_1 >= 0.8 || complete_match_2 >= 0.8) {
                                room_emit(room, 'Message', { value: 'Guessed correctly on the artist and track.', from: object.from, guessed_correctly: true });
                            }
                            else if (artist_match >= 0.8) {
                                room_emit(room, 'Message', { value: 'Guessed correctly on the artist.', from: object.from, guessed_correctly: true });
                            }
                            else if (track_match >= 0.8) {
                                room_emit(room, 'Message', { value: 'Guessed correctly on the track.', from: object.from, guessed_correctly: true });
                            }
                            else {
                                room_emit(room, 'Message', { value: object.message, from: object.from, guessed_correctly: false });
                            }
                        }
                    });
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/];
        });
    }); });
};
init_io();
var client_id = '94ac88d39834494da4f490e1b0cb0ef2'; // Your client id
var client_secret = '9b029b88d0364f1590456f0e2f11dd5c'; // Your secret
var redirect_uri = 'http://005fd6a521f1.ngrok.io/callback'; // Your redirect uri
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
                // @ts-ignore  ??? - Only a void function can be called with the 'new' keyword.
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
                    print_success_login('User successfully logged in');
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
app.get('/refresh_token/:token', function (req, res) {
    // requesting access token from refresh token
    var refresh_token = req.params.token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
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
        else {
            res.send(response);
        }
    });
});
