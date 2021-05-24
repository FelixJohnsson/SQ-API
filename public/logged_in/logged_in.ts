const URL = 'http://005fd6a521f1.ngrok.io';

interface user_details{
    access_token: String,
    refresh_token: String,
    id:String,
    display_name: String,
    time_stamp:Number,
}
const refresh_token = () => {
    let user_data = JSON.parse(localStorage.getItem('user_details'))
    fetch(`${URL}/refresh_token/${user_data.refresh_token}`)
    .then((res) => res.json())
    .then((data) => {
        user_data.access_token = data.access_token;
        user_data.time_stamp = Date.now();
        localStorage.setItem('user_details', JSON.stringify(user_data));
    })
}

setInterval(() => {
    let user_data = JSON.parse(localStorage.getItem('user_details'));
    if((Date.now() - user_data.time_stamp) / 1000  >= 700) {
        console.log('700 seconds passed, refreshing access_token')
        refresh_token();
    }
}, 1000)

//LOGIN
    //SET LOCAL STORAGE
        //IF ACCESS_TOKEN ISNT THE SAME

const store_local_storage = () => {
    let url_info = window.location.href.split('/')[4].split('&');
    let user_data = JSON.parse(localStorage.getItem('user_details'));
    if(user_data === null){
        //FIRST TIME LOGGING IN
        console.log('First login')
        let new_local_storage:user_details = {
            access_token:url_info[0].split('=')[1],
            refresh_token: url_info[1].split('=')[1],
            id:url_info[2].split('=')[1],
            display_name: url_info[3].split('=')[1],
            time_stamp: Date.now(),
        }
        localStorage.setItem('user_details', JSON.stringify(new_local_storage));
    } else if (user_data.access_token === url_info[0].split('=')[1]){
        //ACCESS_TOKEN IS THE SAME
        console.log('Same access_token')
        if(user_data.time_stamp - Date.now() >= 36000) refresh_token();
    } else {
        //ACCESS_TOKEN ISNT THE SAME
        console.log('New login')
        let new_local_storage:user_details = {
            access_token:url_info[0].split('=')[1],
            refresh_token: url_info[1].split('=')[1],
            id:url_info[2].split('=')[1],
            display_name: url_info[3].split('=')[1],
            time_stamp: Date.now(),
        }
        localStorage.setItem('user_details', JSON.stringify(new_local_storage));
    }
}
store_local_storage();

let user_data = JSON.parse(localStorage.getItem('user_details'))
fetch(`${URL}/get_user/${user_data.id}`)
.then((res:Response) => res.json())
.then((data) => {
    document.getElementById('username').innerHTML = `${data.user[0].username}`;
    document.getElementById('rooms-won').innerHTML = `Rooms won: ${data.user[0].rooms_won}`;
    document.getElementById('rooms-lost').innerHTML = `Rooms lost: ${data.user[0].rooms_lost}`;
    document.getElementById('number-of-badges').innerHTML = `Number of badges: ${data.user[0].number_of_badges}`;
    document.getElementById('playlist-played').innerHTML = `Played playlists: ${data.user[0].played_playlists.length}`;
    if (data.user[0].played_playlists.length === 0){
        document.getElementById('latest-playlist').innerHTML = `Latest playlist played:`;
    } else {
        document.getElementById('latest-playlist').innerHTML = `Last playlist played: ${data.user[0].played_playlists[0].name}`;
    }
    
});

const get_recommended = () => {
    fetch(`${URL}/get_recommended`)
    .then((res:Response) => res.json())
    .then((data:any) => {
        console.log(data)
        data.content.forEach(el => {
            let container = document.getElementById('inner-div-bottom');
            let div = document.createElement('DIV');
            div.id = el.URI.split(':')[2];
            div.classList.add('playlist-card');
            let img = document.createElement('IMG');
            //@ts-ignore
            img.src = el.img_src;
            div.appendChild(img);
            div.addEventListener('click', (event) => {
                //@ts-ignore
                let URI = event.path[1].id;
                let user_data = JSON.parse(localStorage.getItem('user_details'));
                let id = user_data.id;
                fetch(`${URL}/create_room/${URI}/${user_data.access_token}/${id}`)
                .then(res => res.json())
                .then(data => {
                    if(data.status === 200){
                        window.location.href = (`${URL}/room/${data.room_id}/${user_data.id}`)
                    }
                })
            })
            container.appendChild(div);
        })
    })
    .catch(err => console.log(err))
}
get_recommended();

const import_playlist = () => {
    let link = document.getElementById('import-playlist').value;
    let URI = link.split('/')[4].split('?')[0];
    let local_storage = JSON.parse(localStorage.getItem('user_details'));

    fetch(`${URL}/create_room/${URI}/${local_storage.access_token}/${local_storage.id}`)
    .then(res => res.json())
    .then(data => {
        if(data.status === 200){
            window.location.href = (`${URL}/room/${data.room_id}/${local_storage.id}`)
        } else {

        }
    })

}
