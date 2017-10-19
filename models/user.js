const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username        : { type: String,
                        required: true,
                        // validate: {
                        //     validator: function(verifyName, cb) {
                        //         UserSchema.findOne({ username: verifyName }, function (err, docs) {
                        //             cb(docs.length == 0);
                        //         });
                        //     },
                        //     message: 'User already exists!'
                        // }
                    },
    password        : { type: String, select: false },
    createdAt       : { type: Date },
    updatedAt       : { type: Date }
});

UserSchema.pre('save', function (next) {
    const date = new Date();
    this.updatedAt = date;
    if (!this.createdAt) {
        this.createdAt = date;
    }

    // let self = this;
    // userModel.findOne({ username : self.username }, function (err, user) {
    //     if (!user.length) {
    //         console.log(user.length)
    //         next();
    //     } else {
    //         console.log('user exists: ', self.username);
    //         next(new Error('User exists!'));
    //     }
    // });

    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
}

let userModel = mongoose.model('User', UserSchema);
module.exports = userModel
