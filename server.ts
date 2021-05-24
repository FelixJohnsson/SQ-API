//CONSOLE FUNCTIONS - DEBUGGING
const chalk = require('chalk');
const print_success_status = (text:String) => {
	console.log(chalk.underline.bgGreen.black(text));
}
const print_error_status = (text:String) => {
	console.log(chalk.underline.bgRed.white(text));
}
const print_success_login = (text:String) => {
	console.log(chalk.underline.bgBlue.black('+') + chalk.underline.bgGreenBright.black(text));
}
const print_error_login = (text:String) => {
	console.log(chalk.underline.bgBlue.black('+') + chalk.underline.bgRedBright.black(text));
}
const print_general_status = (text:String) => {
	console.log(chalk.underline.bgWhite.black(text));
}
const print_connection_established = (text:String) => {
	console.log(chalk.underline.bgBlue.black(text));
}
const print_socket_attached = (text:String) => {
	console.log(chalk.underline.bgGreen.black('+') + chalk.underline.bgBlue.black(text));
}
const print_socket_detached = (text:String) => {
	console.log(chalk.underline.bgRed.black('-') + chalk.underline.bgRed.black(text));
}

const { log } = console;
function proxiedLog(...args:[]) {
	//@ts-ignore
  const line = (((new Error('log'))
    .stack.split('\n')[2] || '…')
    .match(/\(([^)]+)\)/) || [, 'not found'])[1];
  log.call(console, `${line}\n`, ...args);
}
console.info = proxiedLog;

const print_line = (text:String) => {
	console.info(text)
}



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

router.route('/').get((req:Request, res:any) => {
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
.then((res:Object) => print_success_status('Connected to MongoDB.')) 
.catch((err:Object) => print_error_status('Failed to connect to MongoDB.'))

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
 var generateRandomString = function (length:Number) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};


app.get('/', (req:any, res:any) => {
	res.sendFile(__dirname + '/public/landingpage/landingpage.html');
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	print_connection_established('Connection established to / from: ' + ip)
})


//@ts-ignore
const user_functions = require('./support_functions/user_functions.js');

app.get('/logged_in/:data', (req:any, res:any) => {	
	let username:String = req.params.data.split('&')[3].split('=')[1];
	let id:String = req.params.data.split('&')[2].split('=')[1];

	user_functions.get_user(id)
	.then((DB_data:object[]) => {
		if(DB_data.length === 0){
			//FIRST LOGIN
			let token = generateRandomString(16);
			user_functions.init_user(id, username, token);
		} else {
			//NOT FIRST LOGIN
			let type = 'login';
			let token = generateRandomString(16);
			user_functions.update_user(id, type, token)
		}
	})
	.catch((err:any) => {
		print_line('Error find user.');
	})
	res.sendFile(__dirname + '/public/logged_in/logged_in.html');
})

app.get('/get_user/:id', (req:any, res:any) => {
	let id = req.params.id;

	user_functions.get_user(id)
	.then((DB_data:object[]) => {
		if(DB_data.length === 0){
			res.send({title: "Error", msg: "Can't find that user", id:id})
		} else {
			res.send({title: "Success", msg: 'Found user', user:DB_data})
		}
	})
	.catch((err:any) => {
		res.send({title: 'Error',user:"Finding user error at /get_user/:id", errorMessage: err})
		print_line('Error find user.');
	})
})

//@ts-ignore
const playlist_functions = require('./support_functions/playlist_functions.js');
app.get('/get_recommended', (req:any, res:any) => {

	playlist_functions.get_recommended()
	.then((DB_data:object[]) => {
		res.send({title: 'Success', content:DB_data})
	})
	.catch((err:any) => {
		res.send({title: 'Error',user:"Finding user error at /get_user/:id", errorMessage: err})
		print_line('Error find user.');
	})
})
app.get('/post_recommended/:link/:token', (req:any, res:any) => {
	let URI = req.params.link.split('/')[4].split('?')[0];
	node_fetch(`https://api.spotify.com/v1/playlists/${URI}`, {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + req.params.token,
            "Content-Type": "application/json"
        }
        })
        .then((res:any) => res.json())
        .then((playlist_object:any) => {
            playlist_functions.add_recommended(playlist_object)
			res.sendStatus(200);
		})
		.catch((err:any) => {
			res.sendStatus(400);
		})
})

//@ts-ignore
const room_functions = require('./support_functions/room_functions.js')

app.get('/create_room/:URI/:token/:id', (req:any, res:any) => {
	node_fetch(`https://api.spotify.com/v1/playlists/${req.params.URI}`, {
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + req.params.token,
    "Content-Type": "application/json"
  }
})
.then((res:any) => res.json())
.then((data:any) => {
	room_functions.create_new_room(data, req.params.id)
	.then((room_data:any) => {
		let object = {
			status: 200,
			room_id: room_data.id
		}
		res.send(object);
	})

})
});

app.get('/room/:id/:display_name', (req:any, res:any) => {
	res.sendFile(__dirname + '/public/room/room.html');
})

app.get('/get_room/:id', (req:any, res:any) => {
	room_functions.get_room(req.params.id)
	.then((data:any) => {
		res.send(data)
	}) 
})



app.get('/request_start/:room/:id', (req:any, res:any) => {
	let room = req.params.room;
	room_functions.get_room(req.params.room)
	.then((room_object:any) => {
		if(room_object[0].paused){
			let body = {
				context_uri: room_object[0].uri,
				offset: {
					position: room_object[0].currently_playing_offset
				},
				position_ms: room_object[0].progress_ms
			}
			let track = {
				track_name: room_object[0].currently_playing_track,
				artist: room_object[0].currently_playing_artist
			} 
			room_emit(room, 'Track started', {body:body, track:track, show:false})
		} else {
			room_functions.update_room(req.params.room, 'Increment room')
			.then((room_object:any) => {
				let body = {
					context_uri: room_object.uri,
					offset: {
						position: room_object.currently_playing_offset
					},
					position_ms: room_object.progress_ms
				}
				let track = {
					track_name: room_object.currently_playing_track,
					artist: room_object.currently_playing_artist
				} 
				room_emit(room, 'Track started', {body:body, track:track, show:true})
			}) 
		}
	})
	res.sendStatus(200);
})
app.get('/request_pause/:room/:id/:offset', (req:any, res:any) => {
	let room = req.params.room;
	let offset:number = req.params.offset;
	room_functions.update_room(room, 'Pause', offset)
	room_emit(room, 'Track paused')
	res.sendStatus(200);
})
app.get('/request_next/:room/:id/', (req:any, res:any) => {
	let room = req.params.room;
	room_functions.update_room(req.params.room, 'Increment room')
	.then((room_object:any) => {
		let body = {
			context_uri: room_object.uri,
			offset: {
				position: room_object.currently_playing_offset
			},
			position_ms: room_object.progress_ms
		}
		let track = {
			track_name: room_object.currently_playing_track,
			artist: room_object.currently_playing_artist
		} 
		room_emit(room, 'Track started', {body:body, track:track, show:true})
	}) 
	res.sendStatus(200);
})


const room_emit = (room:String, title:String = 'null', content:any = 'null') => {
    io.to(room).emit(title, {content: content})
}
const socket_emit = (socket:any, title:String = 'null', content:String = 'null') => {
    socket.emit(title, {content: content});
}

const init_io = () => {
    
    io.on('connection', async (socket:any) => {
		
		let room:string = socket.handshake.headers.referer.split('/')[4];
		let id:string = socket.handshake.headers.referer.split('/')[5];


		socket.join(room);

		user_functions.get_user(id)
		.then((user_data:any) => {
			if(user_data.length === 0){
				let new_guest = {
					id: id,
					username: 'Guest',
				}
				room_functions.get_room(room)
				.then((room_data:any) => {
					if(room_data.length != 0){
						let user_in_room = room_data[0].players.findIndex((el:any) => el.id === id)
						if(user_in_room === -1){
							room_functions.add_player(room, new_guest)
							.then((room_data) => room_emit(room, 'Guest joined', room_data.players))
						}
					}
				})
			} else {
				room_functions.get_room(room)
				.then((room_data:any) => {
					if(room_data.length != 0){
						let user_in_room = room_data[0].players.findIndex((el:any) => el.id === id)
						if(user_in_room === -1){
							room_functions.add_player(room, user_data[0])
							.then((new_room_data) => room_emit(room, 'Player joined', new_room_data.players))
						} else {
							room_emit(room, 'Player joined', room_data[0].players)
						}
					}
				})
			}
		})

		socket.on('disconnect', async () => {
			let room:string = socket.handshake.headers.referer.split('/')[4];
			let id:string = socket.handshake.headers.referer.split('/')[5];
			room_functions.remove_player(room, id)
			.then(room_data => {
				room_emit(room, 'Player left', room_data.players);
				print_socket_detached(id + ' left room: ' + room)
			})
		})
		socket.on('message', async (object) => {
			let room:string = socket.handshake.headers.referer.split('/')[4];
			let id:string = socket.handshake.headers.referer.split('/')[5];
			room_functions.get_room(room)
			.then((room_data) => {
				room_data = room_data[0];
				if(room_data.currently_playing_track != null){
					let msg = object.message.toUpperCase();
					let artist = room_data.currently_playing_artist.toUpperCase();
					let track = room_data.currently_playing_track.toUpperCase();

					let artist_match = ss.compareTwoStrings(msg, artist);
					let track_match = ss.compareTwoStrings(msg, track);
					let complete_match_1 = ss.compareTwoStrings(msg, track + artist);
					let complete_match_2 = ss.compareTwoStrings(msg, artist + track);

					if(complete_match_1 >= 0.8 || complete_match_2 >= 0.8){room_emit(room, 'Message', {value: 'Guessed correctly on the artist and track.', from: object.from, guessed_correctly: true});}
					else if(artist_match >= 0.8){
						room_emit(room, 'Message', {value: 'Guessed correctly on the artist.', from: object.from, guessed_correctly: true});
					} else if (track_match >= 0.8){
						room_emit(room, 'Message', {value: 'Guessed correctly on the track.', from: object.from, guessed_correctly: true});
					} else {
						room_emit(room, 'Message', {value: object.message, from: object.from, guessed_correctly: false});
					}

				}

			})
		})
	})

}
init_io();

















const client_id = '94ac88d39834494da4f490e1b0cb0ef2'; // Your client id
const client_secret = '9b029b88d0364f1590456f0e2f11dd5c'; // Your secret
const redirect_uri = 'http://005fd6a521f1.ngrok.io/callback'; // Your redirect uri
var stateKey = 'spotify_auth_state';

app.get('/login', function (req: Request, res:any) {

	var state = generateRandomString(16);
	res.cookie(stateKey, state);

	// your application requests authorization
	const scope = `playlist-modify-public 
				   playlist-modify-private 
				   playlist-read-private 
				   playlist-read-collaborative
				   user-library-modify
				   user-library-read
				   app-remote-control
				   user-read-currently-playing
				   user-modify-playback-state
				   user-read-playback-state
				   user-read-recently-played
				   user-top-read
				   user-read-playback-position`;

	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: client_id,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
		}));
});


app.get('/callback', (req:any, res:any):void => {

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
	} else {
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

		request.post(authOptions, function (error:any, response:any, body:any) {
			if (!error && response.statusCode === 200) {

				var access_token = body.access_token,
				refresh_token = body.refresh_token;

			
				// we can also pass the token to the browser to make requests from there
				node_fetch("https://api.spotify.com/v1/me", {
						headers: {
							Accept: "application/json",
							Authorization: "Bearer " + access_token,
							"Content-Type": "application/json"
						}
					})
					.then((res:any) => res.json())
					.then((data:any) => {
						res.redirect('/logged_in/' +
							querystring.stringify({
								access_token: access_token,
								refresh_token: refresh_token,
								id: data.id,
								username: data.display_name
							}));
							print_success_login('User successfully logged in');
					})
			} else {
				res.redirect('/#' +
					querystring.stringify({
						error: 'invalid_token'
					}));
				print_error_login('User unsuccessfully logged in.' + {error: 'Invalid token.'});
			}
		});
	}
});

app.get('/refresh_token/:token', function (req:any, res:any) {

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

	request.post(authOptions, function (error:String, response:any, body:any) {
			if (!error && response.statusCode === 200) {
				var access_token = body.access_token;
				res.send({
					'access_token': access_token
				});
			} else {
				res.send(response)
			}
		})

});




