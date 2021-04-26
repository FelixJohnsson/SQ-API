var mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    id:String,
    username:String,
    latest_connection: Date,
    first_connection: Date,
    played_playlists: [String],
    number_of_badges: Number,
    badges: [String],
    correct_guesses: Number,
    incorrect_guesses: Number,
    rooms_won: Number,
    rooms_lost: Number,
    oAuth: String
})

const user_model = mongoose.model('user_collection', user_schema);

const init_new_user = (id: String, username:String, oAuth:String) => {
    const new_user = new user_model({
        username: username,
        id: id,
        socket: 0,
        latest_connection: Date.now(),
        first_connection: Date.now(),
        played_playlists: [],
        number_of_badges: 0,
        badges: [],
        correct_guesses: 0,
        incorrect_guesses: 0,
        rooms_won: 0,
        rooms_lost: 0,
        oAuth: oAuth
    })
    new_user.save(function (err) {
        if (err) return console.error(err);
    });
}

const find_user = async (id: String) => {
    const response = await user_model.find({id:id}, (err, user) => {
        if (err) return console.error(err);
        if(user.length > 0){
            return true;
        } else {
            return false;
        }
    })
    return response;
}

const find_update_user = async (id:String, type:String, value?: String | Number) => {
    let filter;
    let update;
    switch(type){
        case 'login':
            filter = { id: id };
            update = { $set:{latest_connection: Date.now(), oAuth: value}};

            let new_data = await user_model.findOneAndUpdate(filter, update, {useFindAndModify: false,returnNewDocument: true}, (error:any, success:any) => {
                if(success) return success;
                if(error) return error;
            }); 
            return new_data;
        break;
        case 'join_room':
            filter = { id: id };
            update = { $push: {played_playlists: value}, $set:{latest_connection: Date.now()}};
    
            user_model.findOneAndUpdate(filter, update, {useFindAndModify: false}, (error:any, success:any) => {
                if(error) console.log(error);
            }); 
        break;
        case 'correct_guess':
            filter = { id: id };
            update = { $inc: {correct_guesses: value}};
            
            const response = await user_model.findOneAndUpdate(filter, update, {useFindAndModify: false}, (error:any, success:any) => {
                if(error) console.log('ERROR: ' + error);
            }); 
            return response;
        case 'incorrect_guess':
            filter = { id: id };
            update = { $inc: {incorrect_guesses: value}};
    
            user_model.findOneAndUpdate(filter, update, {useFindAndModify: false}, (error:any, success:any) => {
                if(error) console.log(error);
            }); 
        break;
        case 'new_badge':
            filter = { id: id };
            update = { $inc: {number_of_badges: 1}, $push: {badges: value}};
    
            user_model.findOneAndUpdate(filter, update, {useFindAndModify: false}, (error:any, success:any) => {
                if(error) console.log(error);
            }); 
        break;
    }
}



module.exports = {
    init_new_user,
    find_user,
    find_update_user,
}