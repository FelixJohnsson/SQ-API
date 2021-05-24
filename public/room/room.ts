const socket = io();
//@ts-ignore
const URL = 'http://005fd6a521f1.ngrok.io';

interface room_object {
    id:String,
    started: Boolean,
    owner_name: String,
    players:[],
    playlist_uri: String,
    playlist_description: String,
    playlist_image: String,
    playlist_name: String,
    uri: String,
    link: String,
    songs: [],
    badge_limit: Number,
    currently_playing_offset: Number,
    currently_playing_track: String,
    currently_playing_artist: String,
    currently_playing_number: Number,
    first_connection: Date,
}

document.addEventListener("keyup", (event) => {
    let value = document.getElementById('messages').value;
    if (event.keyCode === 13 && value.length > 0) {
        
        let user_data = JSON.parse(localStorage.getItem('user_details'))
        let object = {
            message: value,
            from: user_data.id
        }
        socket.emit('message', object);
        document.getElementById('messages').value = '';
    }
    
});

setInterval(() => {
    let user_data = JSON.parse(localStorage.getItem('user_details'))
    if((Date.now() - user_data.time_stamp) / 1000 >= 3550){
        refresh_token();
    }
}, 1000)

//@ts-ignore
const refresh_token = () => {
    let user_data = JSON.parse(localStorage.getItem('user_details'))
    fetch(`${URL}/refresh_token/${user_data.refresh_token}`)
    .then((res) => res.json())
    .then((data) => {
        user_data.access_token = data.access_token;
        localStorage.setItem('user_details', JSON.stringify(user_data));
    })
}
const to_logged_in_page = () => {
    let user_data = JSON.parse(localStorage.getItem('user_details'))
    window.location.href = `${URL}/logged_in/access_token=${user_data.access_token}&refresh_token=${user_data.refresh_token}&id=${user_data.id}&username=${user_data.username}`;
}

const outputRoomData = (data:room_object) => {
    //@ts-ignore
    document.getElementById('playlist_image').src = data.playlist_image
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
}

const outputPlayers = (array:any[]) => {
    let div = document.getElementById('players-in-room-div')
    while (div.firstChild) {
        div.removeChild(div.lastChild);
      }
    array.forEach((el) => {
        if(el != null || el.username === undefined){
            const p = document.createElement('P');
            p.classList.add('players');
            let text = document.createTextNode(el.username);
            if(el.username === 'Guest') text = document.createTextNode(el.id);
            p.appendChild(text);
            div.appendChild(p);
        }
    })
}

const outputEvent = (event:string = null, string:string = 'default event') => {
    const div = document.getElementById('room-events');
    const p = document.createElement('P');
    p.id = 'default';
    let text = document.createTextNode(string);
    p.appendChild(text);
    div.appendChild(p);
    div.scrollTop = div.scrollHeight;
}
const outputMessage = (content:any) => {

}

const request_start = () => {
    let room = window.location.href.split('/')[4];
    let user = window.location.href.split('/')[5];
    fetch(`${URL}/request_start/${room}/${user}`)

    document.getElementById('start').style.display = 'none';
    document.getElementById('pause').style.display = 'block';
    document.getElementById('next').style.display = 'block';
    document.getElementById('show').style.display = 'block';
}

const request_pause = () => {
    let room = window.location.href.split('/')[4];
    let user = window.location.href.split('/')[5];
    let user_data = JSON.parse(localStorage.getItem('user_details'))
    fetch("https://api.spotify.com/v1/me/player", {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user_data.access_token,
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((data) => {
        fetch(`${URL}/request_pause/${room}/${user}/${data.progress_ms}`)
        .then((res) => res.json())
            document.getElementById('start').style.display = 'block';
            document.getElementById('pause').style.display = 'none';
    })
}

const request_next = () => {
    let room = window.location.href.split('/')[4];
    let user = window.location.href.split('/')[5];

    fetch(`${URL}/request_next/${room}/${user}`)
    .then((res) => res.json())
}

let playing_artist;
let playing_track;
const show_track = () => {
    outputEvent('Show', 'Song was: ' + playing_track + ' by ' + playing_artist);
}









let initialized = false;
const init_socket = () => {
    fetch(`${URL}/get_room/${window.location.href.split('/')[4]}`)
    .then(res => res.json())
    .then(data => {
        if(data.length > 0){
            outputRoomData(data[0]);
        }else{
            outputEvent('Empty', 'This room is empty.')
        }
    })
    .catch((error:any) => console.log(error))
    initialized = true;
}
if (!initialized) init_socket();

interface Event {
    title:string,
    content?:string[]
}
socket.onAny((eventName) => {
    /// ...
});

socket.on('connect', (data:Event) => {
    console.log('Socket attached')
});
socket.on('Message', (data:Event) => {
    if(data.content.guessed_correctly){
        outputEvent('Message', data.content.from + ' ' + data.content.value)
    } else {
        outputEvent('Message', data.content.from + ': ' + data.content.value)
    }
});
socket.on('Player joined', (data:Event) => {
    outputEvent('Player joined', 'User joined the room')
    outputPlayers(data.content);
});
socket.on('Guest joined', (data:Event) => {
    outputEvent('Guest joined', 'Guest joined the room')
    outputPlayers(data.content);
});

socket.on('Player left', (data:Event) => {
    outputEvent('Player left', 'User left the room')
    outputPlayers(data.content);
});

let first = true;
socket.on('Track started', (data:Event) => {

    if(data.content.show && !first) show_track();
    playing_artist = data.content.track.artist;
    playing_track = data.content.track.track_name;
    let user_data = JSON.parse(localStorage.getItem('user_details'))
    fetch("https://api.spotify.com/v1/me/player/play", {
			body: JSON.stringify(data.content.body),
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + user_data.access_token,
				"Content-Type": "application/json"
			},
			method: "PUT"
        })
    outputEvent('Track started', 'Track starting ...')
    first = false;
});
socket.on('Track paused', (data:Event) => {
    let user_data = JSON.parse(localStorage.getItem('user_details'))
    fetch("https://api.spotify.com/v1/me/player/pause", {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user_data.access_token,
            "Content-Type": "application/json"
        },
        method: "PUT"
    })
    .then((res:any) => res.json())
    .catch((error:any) => console.log(error))

    outputEvent('Track paused', 'Track pausing ...')
});
socket.on('Track skipped', (data:Event) => {
    outputEvent('Track skipped', 'Skipping track ...')
});
socket.on('Playlist finished', (data:Event) => {
    outputEvent('Playlist finished', 'Ending playlist ...')
});
socket.on('Room closed', (data:Event) => {
    outputEvent('Room closed', 'Closing room ...')
});