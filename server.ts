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
const { log } = console;
function proxiedLog(...args) {
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

app.use('/api', router);
app.use(express.static("../Frontend/public"))
    .use(cors())
    .use(cookieParser());

//DATABASE
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then((res:Object) => print_success_status('Connected to MongoDB.')) 
.catch((err:Object) => print_error_status("Can't connect to MongoDB."))

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


app.get('/', (req, res) => {
	res.send({title:'Connection established to the Spotify Quiz API', status:200});
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	print_general_status('Connection established to / from: ' + ip)
})



const user_functions = require('./support_functions/user_functions.js');

app.get('/logged_in/:data', (req:any, res:any) => {	
	let username:String = req.params.data.split('&')[3].split('=')[1];
	let id:String = req.params.data.split('&')[2].split('=')[1];

	user_functions.find_user(id)
	.then((DB_data:object[]) => {
		if(DB_data.length === 0){
			//FIRST LOGIN
			let token = generateRandomString(16);
			user_functions.init_new_user(id, username, token);
			res.send({title: 'Initialized that user', user:id})
		} else {
			//NOT FIRST LOGIN
			let type = 'login';
			let token = generateRandomString(16);
			user_functions.find_update_user(id, type, token)
			.then((new_data:any) => {
				res.send({title: 'Success finding user', user:new_data})
			})
			
		}
	})
	.catch((err:any) => {
		res.send({title: 'Error',user:"Finding user error at /logged_in/:data", errorMessage: err})
		print_line('Error find user.');
	})
})

app.get('/get_user/:id', (req:any, res:any) => {
	let id = req.params.id;

	user_functions.find_user(id)
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



















const client_id = '94ac88d39834494da4f490e1b0cb0ef2'; // Your client id
const client_secret = '9b029b88d0364f1590456f0e2f11dd5c'; // Your secret
const redirect_uri = 'http://1077c55ed1e8.ngrok.io/callback'; // Your redirect uri
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


app.get('/callback', function (req:any, res:any) {

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
						print_success_login(data.display_name + ' successfully logged in.')
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

app.get('/refresh_token', function (req:any, res:any) {

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

	request.post(authOptions, function (error:String, response:any, body:any) {
			if (!error && response.statusCode === 200) {
				var access_token = body.access_token;
				res.send({
					'access_token': access_token
				});
			}
		})
		.catch((err:String) => {
			console.log(err)
		})
});




