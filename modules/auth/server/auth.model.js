const mongoose = require('mongoose'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    AutoIncrement = require('mongoose-sequence'),
    Schema = mongoose.Schema;

const authSchema = new Schema({
    fullname: {
        type: String
    },
    dob: {
        type: Date
    },
    email: {
        type: String,
        unique: true
    },
    facebook: {
        id:{
            type: String,
            trim: true
        },
        token:{
            type: String
        },
        name:{
            type: String
        },
        email:{
            type: String
        }
    },
    salt: String,
    hash: String
});

authSchema.plugin(AutoIncrement, { inc_field: 'userId' });

authSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

authSchema.methods.checkPassword = (password) => {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return hash === this.hash;
}

authSchema.methods.generateJwt = function () {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        id: this.userId,
        fullname: this.fullname,
        exp: parseInt(expiry.getTime() / 1000),
    }, "My Secret");
}

mongoose.model('Auth', authSchema);