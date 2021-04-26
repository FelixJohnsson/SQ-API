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
var _this = this;
var mongoose = require('mongoose');
var user_schema = new mongoose.Schema({
    id: String,
    username: String,
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
});
var user_model = mongoose.model('user_collection', user_schema);
var init_new_user = function (id, username, oAuth) {
    var new_user = new user_model({
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
    });
    new_user.save(function (err) {
        if (err)
            return console.error(err);
    });
};
var find_user = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model.find({ id: id }, function (err, user) {
                    if (err)
                        return console.error(err);
                    if (user.length > 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); };
var find_update_user = function (id, type, value) { return __awaiter(_this, void 0, void 0, function () {
    var filter, update, _a, new_data, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = type;
                switch (_a) {
                    case 'login': return [3 /*break*/, 1];
                    case 'join_room': return [3 /*break*/, 3];
                    case 'correct_guess': return [3 /*break*/, 4];
                    case 'incorrect_guess': return [3 /*break*/, 6];
                    case 'new_badge': return [3 /*break*/, 7];
                }
                return [3 /*break*/, 8];
            case 1:
                filter = { id: id };
                update = { $set: { latest_connection: Date.now(), oAuth: value } };
                return [4 /*yield*/, user_model.findOneAndUpdate(filter, update, { useFindAndModify: false, returnNewDocument: true }, function (error, success) {
                        if (success)
                            return success;
                        if (error)
                            return error;
                    })];
            case 2:
                new_data = _b.sent();
                return [2 /*return*/, new_data];
            case 3:
                filter = { id: id };
                update = { $push: { played_playlists: value }, $set: { latest_connection: Date.now() } };
                user_model.findOneAndUpdate(filter, update, { useFindAndModify: false }, function (error, success) {
                    if (error)
                        console.log(error);
                });
                return [3 /*break*/, 8];
            case 4:
                filter = { id: id };
                update = { $inc: { correct_guesses: value } };
                return [4 /*yield*/, user_model.findOneAndUpdate(filter, update, { useFindAndModify: false }, function (error, success) {
                        if (error)
                            console.log('ERROR: ' + error);
                    })];
            case 5:
                response = _b.sent();
                return [2 /*return*/, response];
            case 6:
                filter = { id: id };
                update = { $inc: { incorrect_guesses: value } };
                user_model.findOneAndUpdate(filter, update, { useFindAndModify: false }, function (error, success) {
                    if (error)
                        console.log(error);
                });
                return [3 /*break*/, 8];
            case 7:
                filter = { id: id };
                update = { $inc: { number_of_badges: 1 }, $push: { badges: value } };
                user_model.findOneAndUpdate(filter, update, { useFindAndModify: false }, function (error, success) {
                    if (error)
                        console.log(error);
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
module.exports = {
    init_new_user: init_new_user,
    find_user: find_user,
    find_update_user: find_update_user
};
