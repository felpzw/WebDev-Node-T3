const mongoose = require('../config/db');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    categories: [{ 
        type: String, 
        enum: ['tecnologia', 'saude', 'negocios', 'natureza', 'politica'] 
    }],

    //Push (endpoint e chaves do navegador)
    subscription: {
        endpoint: String,
        expirationTime: { type: Number, default: null },
        keys: {
            p256dh: String,
            auth: String
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);