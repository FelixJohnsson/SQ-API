var socket = io();
//@ts-ignore
var URL = 'http://005fd6a521f1.ngrok.io';
document.addEventListener("keyup", function (event) {
    var value = document.getElementById('messages').value;
    if (event.keyCode === 13 && value.length > 0) {
        var user_data_1 = JSON.parse(localStorage.getItem('user_details'));
        var object = {
            message: value,
            from: user_data_1.id
        };
        socket.emit('message', object);
        document.getElementById('messages').value = '';
    }
});
setInterval(function () {
    var user_data = JSON.parse(localStorage.getItem('user_details'));
    if ((Date.now() - user_data.time_stamp) / 1000 >= 3550) {
        refresh_token();
    }
}, 1000);
//@ts-ignore
var refresh_token = function () {
    var user_data = JSON.parse(localStorage.getItem('user_details'));
    fetch(URL + "/refresh_token/" + user_data.refresh_token)
        .then(function (res) { return res.json(); })
        .then(function (data) {
        user_data.access_token = data.access_token;
        localStorage.setItem('user_details', JSON.stringify(user_data));
    });
};
var to_logged_in_page = function () {
    var user_data = JSON.parse(localStorage.getItem('user_details'));
    window.location.href = URL + "/logged_in/access_token=" + user_data.access_token + "&refresh_token=" + user_data.refresh_token + "&id=" + user_data.id + "&username=" + user_data.username;
};
var outputRoomData = function (data) {
    //@ts-ignore
    document.getElementById('playlist_image').src = data.playlist_image;
    //@ts-ignore
    document.getElementById('playlist_name').innerHTML = data.playlist_name;
    //@ts-ignore
    document.getElementById('description').innerHTML = data.playlist_description;
    //@ts-ignore
    document.getElementById('owner').innerHTML = data.owner_name;
    //@ts-ignore
    document.getElementById('number_of_songs').innerHTML = data.songs.length;
    //@ts-ignore
    document.getElementById('link_to_playlist').href = data.link;
};
var outputPlayers = function (array) {
    var div = document.getElementById('players-in-room-div');
    while (div.firstChild) {
        div.removeChild(div.lastChild);
    }
    array.forEach(function (el) {
        if (el != null || el.username === undefined) {
            var p = document.createElement('P');
            p.classList.add('players');
            var text = document.createTextNode(el.username);
            if (el.username === 'Guest')
                text = document.createTextNode(el.id);
            p.appendChild(text);
            div.appendChild(p);
        }
    });
};
var outputEvent = function (event, string) {
    if (event === void 0) { event = null; }
    if (string === void 0) { string = 'default event'; }
    var div = document.getElementById('room-events');
    var p = document.createElement('P');
    p.id = 'default';
    var text = document.createTextNode(string);
    p.appendChild(text);
    div.appendChild(p);
    div.scrollTop = div.scrollHeight;
};
var outputMessage = function (content) {
};
var request_start = function () {
    var room = window.location.href.split('/')[4];
    var user = window.location.href.split('/')[5];
    fetch(URL + "/request_start/" + room + "/" + user);
    document.getElementById('start').style.display = 'none';
    document.getElementById('pause').style.display = 'block';
    document.getElementById('next').style.display = 'block';
    document.getElementById('show').style.display = 'block';
};
var request_pause = function () {
    var room = window.location.href.split('/')[4];
    var user = window.location.href.split('/')[5];
    var user_data = JSON.parse(localStorage.getItem('user_details'));
    fetch("https://api.spotify.com/v1/me/player", {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user_data.access_token,
            "Content-Type": "application/json"
        }
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
        fetch(URL + "/request_pause/" + room + "/" + user + "/" + data.progress_ms)
            .then(function (res) { return res.json(); });
        document.getElementById('start').style.display = 'block';
        document.getElementById('pause').style.display = 'none';
    });
};
var request_next = function () {
    var room = window.location.href.split('/')[4];
    var user = window.location.href.split('/')[5];
    fetch(URL + "/request_next/" + room + "/" + user)
        .then(function (res) { return res.json(); });
};
var playing_artist;
var playing_track;
var show_track = function () {
    outputEvent('Show', 'Song was: ' + playing_track + ' by ' + playing_artist);
};
var initialized = false;
var init_socket = function () {
    fetch(URL + "/get_room/" + window.location.href.split('/')[4])
        .then(function (res) { return res.json(); })
        .then(function (data) {
        if (data.length > 0) {
            outputRoomData(data[0]);
        }
        else {
            outputEvent('Empty', 'This room is empty.');
        }
    })["catch"](function (error) { return console.log(error); });
    initialized = true;
};
if (!initialized)
    init_socket();
socket.onAny(function (eventName) {
    /// ...
});
socket.on('connect', function (data) {
    console.log('Socket attached');
});
socket.on('Message', function (data) {
    if (data.content.guessed_correctly) {
        outputEvent('Message', data.content.from + ' ' + data.content.value);
    }
    else {
        outputEvent('Message', data.content.from + ': ' + data.content.value);
    }
});
socket.on('Player joined', function (data) {
    outputEvent('Player joined', 'User joined the room');
    outputPlayers(data.content);
});
socket.on('Guest joined', function (data) {
    outputEvent('Guest joined', 'Guest joined the room');
    outputPlayers(data.content);
});
socket.on('Player left', function (data) {
    outputEvent('Player left', 'User left the room');
    outputPlayers(data.content);
});
var first = true;
socket.on('Track started', function (data) {
    if (data.content.show && !first)
        show_track();
    playing_artist = data.content.track.artist;
    playing_track = data.content.track.track_name;
    var user_data = JSON.parse(localStorage.getItem('user_details'));
    fetch("https://api.spotify.com/v1/me/player/play", {
        body: JSON.stringify(data.content.body),
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user_data.access_token,
            "Content-Type": "application/json"
        },
        method: "PUT"
    });
    outputEvent('Track started', 'Track starting ...');
    first = false;
});
socket.on('Track paused', function (data) {
    var user_data = JSON.parse(localStorage.getItem('user_details'));
    fetch("https://api.spotify.com/v1/me/player/pause", {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user_data.access_token,
            "Content-Type": "application/json"
        },
        method: "PUT"
    })
        .then(function (res) { return res.json(); })["catch"](function (error) { return console.log(error); });
    outputEvent('Track paused', 'Track pausing ...');
});
socket.on('Track skipped', function (data) {
    outputEvent('Track skipped', 'Skipping track ...');
});
socket.on('Playlist finished', function (data) {
    outputEvent('Playlist finished', 'Ending playlist ...');
});
socket.on('Room closed', function (data) {
    outputEvent('Room closed', 'Closing room ...');
});
