var URL = 'http://005fd6a521f1.ngrok.io';
var refresh_token = function () {
    var user_data = JSON.parse(localStorage.getItem('user_details'));
    fetch(URL + "/refresh_token/" + user_data.refresh_token)
        .then(function (res) { return res.json(); })
        .then(function (data) {
        user_data.access_token = data.access_token;
        user_data.time_stamp = Date.now();
        localStorage.setItem('user_details', JSON.stringify(user_data));
    });
};
setInterval(function () {
    var user_data = JSON.parse(localStorage.getItem('user_details'));
    if ((Date.now() - user_data.time_stamp) / 1000 >= 700) {
        console.log('700 seconds passed, refreshing access_token');
        refresh_token();
    }
}, 1000);
//LOGIN
//SET LOCAL STORAGE
//IF ACCESS_TOKEN ISNT THE SAME
var store_local_storage = function () {
    var url_info = window.location.href.split('/')[4].split('&');
    var user_data = JSON.parse(localStorage.getItem('user_details'));
    if (user_data === null) {
        //FIRST TIME LOGGING IN
        console.log('First login');
        var new_local_storage = {
            access_token: url_info[0].split('=')[1],
            refresh_token: url_info[1].split('=')[1],
            id: url_info[2].split('=')[1],
            display_name: url_info[3].split('=')[1],
            time_stamp: Date.now()
        };
        localStorage.setItem('user_details', JSON.stringify(new_local_storage));
    }
    else if (user_data.access_token === url_info[0].split('=')[1]) {
        //ACCESS_TOKEN IS THE SAME
        console.log('Same access_token');
        if (user_data.time_stamp - Date.now() >= 36000)
            refresh_token();
    }
    else {
        //ACCESS_TOKEN ISNT THE SAME
        console.log('New login');
        var new_local_storage = {
            access_token: url_info[0].split('=')[1],
            refresh_token: url_info[1].split('=')[1],
            id: url_info[2].split('=')[1],
            display_name: url_info[3].split('=')[1],
            time_stamp: Date.now()
        };
        localStorage.setItem('user_details', JSON.stringify(new_local_storage));
    }
};
store_local_storage();
var user_data = JSON.parse(localStorage.getItem('user_details'));
fetch(URL + "/get_user/" + user_data.id)
    .then(function (res) { return res.json(); })
    .then(function (data) {
    document.getElementById('username').innerHTML = "" + data.user[0].username;
    document.getElementById('rooms-won').innerHTML = "Rooms won: " + data.user[0].rooms_won;
    document.getElementById('rooms-lost').innerHTML = "Rooms lost: " + data.user[0].rooms_lost;
    document.getElementById('number-of-badges').innerHTML = "Number of badges: " + data.user[0].number_of_badges;
    document.getElementById('playlist-played').innerHTML = "Played playlists: " + data.user[0].played_playlists.length;
    if (data.user[0].played_playlists.length === 0) {
        document.getElementById('latest-playlist').innerHTML = "Latest playlist played:";
    }
    else {
        document.getElementById('latest-playlist').innerHTML = "Last playlist played: " + data.user[0].played_playlists[0].name;
    }
});
var get_recommended = function () {
    fetch(URL + "/get_recommended")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        console.log(data);
        data.content.forEach(function (el) {
            var container = document.getElementById('inner-div-bottom');
            var div = document.createElement('DIV');
            div.id = el.URI.split(':')[2];
            div.classList.add('playlist-card');
            var img = document.createElement('IMG');
            //@ts-ignore
            img.src = el.img_src;
            div.appendChild(img);
            div.addEventListener('click', function (event) {
                //@ts-ignore
                var URI = event.path[1].id;
                var user_data = JSON.parse(localStorage.getItem('user_details'));
                var id = user_data.id;
                fetch(URL + "/create_room/" + URI + "/" + user_data.access_token + "/" + id)
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                    if (data.status === 200) {
                        window.location.href = (URL + "/room/" + data.room_id + "/" + user_data.id);
                    }
                });
            });
            container.appendChild(div);
        });
    })["catch"](function (err) { return console.log(err); });
};
get_recommended();
var import_playlist = function () {
    var link = document.getElementById('import-playlist').value;
    var URI = link.split('/')[4].split('?')[0];
    var local_storage = JSON.parse(localStorage.getItem('user_details'));
    fetch(URL + "/create_room/" + URI + "/" + local_storage.access_token + "/" + local_storage.id)
        .then(function (res) { return res.json(); })
        .then(function (data) {
        if (data.status === 200) {
            window.location.href = (URL + "/room/" + data.room_id + "/" + local_storage.id);
        }
        else {
        }
    });
};
