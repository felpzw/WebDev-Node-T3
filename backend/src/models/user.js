const mongoose = require('../config/db');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    
    categories: [{ 
        type: String, 
        enum: ['tecnologia', 'saude', 'negocios', 'natureza', 'politica'] 
    }],

    subscription: {
        endpoint: String,
        keys: {
            p256dh: String,
            auth: String
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);