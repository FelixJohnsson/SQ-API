var node_fetch = require('node-fetch');
var mongoose = require('mongoose');
require('dotenv').config();

var user_functions = require('./support_functions/user_functions.js');
var playlist_functions = require('./support_functions/playlist_functions.js');
var room_functions = require('./support_functions/room_functions.js');


mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    /* ---------------USER FUNCTIONS TESTS------------------- */
    //user_functions.init_user(user_object.id, user_object.display_name, user_object.oAuth)
    //user_functions.get_user(user_object.id)

    //user_functions.update_user('felle21','login', 126)
    //user_functions.update_user('felle21','join_room', 112326)
    //user_functions.update_user('felle21','correct_guess', 12)
    //user_functions.update_user('felle21','incorrect_guess', 11)
    //user_functions.update_user('felle21','rooms_won')
    //user_functions.update_user('felle21','rooms_lost')
    //user_functions.update_user('felle21','new_badge', 'ASKDJASJDHAL')
    //user_functions.update_user('Hugo', 'delete')


    /* ---------------PLAYLIST FUNCTIONS TESTS------------------- */
    //playlist_functions.get_recommended()
    /*
    node_fetch("https://api.spotify.com/v1/playlists/37i9dQZF1Epvv3LAKCc65D", {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer BQAuf_Nez1AfrutjDypPVJUDUEUdd1YfzgqOCbzca1IXHh87qc_mlV3mYLtrGDOUGgBHekDbeUerI7vLFPZz343pyhHOSjxh0vYIpDmgsqkFaJKB_TbmfRnjcmlXTjzEgLQvLfNvJYEwtAWOEvZsxqA0ocM7nMMBZQJLzZ0HgAbzueOXGdhJYSWpp_v_o-vjQ4BPPJx40oWHv2PLLgDOGOipzx3VcTNHCp5ElJ9QyHXwKNygh822hEKKb59GZL40V25SSB0lpsdIYg6S6Uk6TZY",
            "Content-Type": "application/json"
        }
        })
        .then(res => res.json())
        .then((data:any) => {
            playlist_functions.add_recommended(data)
            .then(data => console.log(data))
    })*/



        /* ---------------ROOM FUNCTIONS TESTS------------------- */
    /*node_fetch("https://api.spotify.com/v1/playlists/37i9dQZF1Epvv3LAKCc65D", {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer BQAuf_Nez1AfrutjDypPVJUDUEUdd1YfzgqOCbzca1IXHh87qc_mlV3mYLtrGDOUGgBHekDbeUerI7vLFPZz343pyhHOSjxh0vYIpDmgsqkFaJKB_TbmfRnjcmlXTjzEgLQvLfNvJYEwtAWOEvZsxqA0ocM7nMMBZQJLzZ0HgAbzueOXGdhJYSWpp_v_o-vjQ4BPPJx40oWHv2PLLgDOGOipzx3VcTNHCp5ElJ9QyHXwKNygh822hEKKb59GZL40V25SSB0lpsdIYg6S6Uk6TZY",
            "Content-Type": "application/json"
        }
        })
        .then(res => res.json())
        .then((data:any) => {
            room_functions.create_new_room(data, 'felle22')
            .then(data => console.log(data))
    })*/
   


    //room_functions.get_room('1')
    //room_functions.add_player('1', 'PLAYER OBJECT')
    room_functions.update_room('1', 'Increment room')
    .then((data:any) => console.log(data))

}) 

interface NewUser {
    id:String,
    display_name:String,
    oAuth:String
}

let new_user_object: NewUser = {
    id:'Test@',
    display_name: 'Test@ Testsson',
    oAuth: '1234abcd1234'
}

