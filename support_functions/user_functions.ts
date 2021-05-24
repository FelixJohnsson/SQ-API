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

const init_user = async (id: String, username:String, oAuth:String) => {
    return new Promise((resolve, reject) => {
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
    
        new_user.save(function (error:any, success:any) {
            if(error) reject(error);
            if(success) resolve(success);
        });
    })

}

const get_user = async (id: String) => {
    return new Promise((resolve, reject) => {
        user_model.find({id:id}, (error:any, success:any) => {
            if(error) reject(404);
            if(success) resolve(success);
        })
    })
}

const update_user = async (id:String, type:String, value?: String | Number) => {
    let filter;
    let update;
    switch(type){
        case 'delete': 
            return new Promise((resolve, reject) => {
                user_model.deleteOne({ id: id }, (error: any, success:any) => {
                    if(error) reject(error);
                    if(success) resolve(success);
                  });
            })
        case 'login':
            return new Promise((resolve, reject) => {
                filter = { id: id };
                update = { $set:{latest_connection: Date.now(), oAuth: value}};
    
                user_model.findOneAndUpdate(filter, update, {useFindAndModify: false, returnOriginal:false}, (error:any, success:any) => {
                    if(error) reject(error);
                    if(success) resolve(success);
                }); 
            })

        break;
        case 'join_room':
            return new Promise((resolve, reject) => {
            filter = { id: id };
            update = { $push: {played_playlists: value}, $set:{latest_connection: Date.now()}};
    
            user_model.findOneAndUpdate(filter, update, {useFindAndModify: false, returnOriginal:false}, (error:any, success:any) => {
                if(error) reject(error);
                if(success) resolve(success);
            }); 
        })
        break;
        case 'correct_guess':
            return new Promise((resolve, reject) => {
            filter = { id: id };
            update = { $inc: {correct_guesses: value}};
            
            user_model.findOneAndUpdate(filter, update, {useFindAndModify: false, returnOriginal:false}, (error:any, success:any) => {
                if(error) reject(error);
                if(success) resolve(success);
            }); 
        })
        case 'incorrect_guess':
            return new Promise((resolve, reject) => {
            filter = { id: id };
            update = { $inc: {incorrect_guesses: value}};
    
            user_model.findOneAndUpdate(filter, update, {useFindAndModify: false, returnOriginal:false}, (error:any, success:any) => {
                if(error) reject(error);
                if(success) resolve(success);
            }); 
        })
        break;
        case 'rooms_won':
            return new Promise((resolve, reject) => {
            filter = { id: id };
            update = { $inc: {rooms_won: 1}};
    
            user_model.findOneAndUpdate(filter, update, {useFindAndModify: false, returnOriginal:false}, (error:any, success:any) => {
                if(error) reject(error);
                if(success) resolve(success);
            }); 
        })
        break;
        case 'rooms_lost':
            return new Promise((resolve, reject) => {
            filter = { id: id };
            update = { $inc: {rooms_lost: 1}};
    
            user_model.findOneAndUpdate(filter, update, {useFindAndModify: false, returnOriginal:false}, (error:any, success:any) => {
                if(error) reject(error);
                if(success) resolve(success);
            }); 
        })
        break;
        case 'new_badge':
            return new Promise((resolve, reject) => {
                console.log('New badge')
            filter = { id: id };
            update = { $inc: {number_of_badges: 1}, $push: {badges: value}};
    
            user_model.findOneAndUpdate(filter, update, {useFindAndModify: false, returnOriginal:false}, (error:any, success:any) => {
                if(error) reject(error);
                if(success) resolve(success);
            }); 
        })
        break;
    }
}



module.exports = {
    init_user,
    get_user,
    update_user,
}