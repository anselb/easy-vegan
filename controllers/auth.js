const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = function (app) {
    //
    app.get('/logout', function (req, res, next) {
        res.clearCookie('nToken');
        res.redirect('/');
    });

    //
    app.get('/login', function (req, res, next) {
        res.render('login', {
            bodyClass: 'login',
            pageTitle: 'Log in'
        });
    });

    //
    app.get('/sign-up', function (req, res, next) {
        res.render('sign-up', {
            bodyClass: 'sign-up',
            pageTitle: 'Sign Up'
        });
    });

    //
    app.post('/login', function (req, res, next) {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({ username }, 'username password').then((user) => {
            if (!user) {
                return res.status(401).send({ message: 'Wrong username or password' });
            }

            user.comparePassword(password, (err, isMatch) => {
                if (!isMatch) {
                    return res.status(401).send({ message: 'Wrong username or password' });
                }

                const token = jwt.sign(
                    { _id: user._id, username: user.username }, process.env.SECRET,
                    { expiresIn: '60 days' }
                );

                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                res.redirect('/');
            });

        }).catch((err) => {
            console.log(err);
        });
    });

    //
    app.post('/sign-up', function (req, res) {
        const username = req.body.postUsername;
        const password = req.body.postPassword;
        const postPasswordConfirm = req.body.postPasswordConfirm;

        if (password !== postPasswordConfirm) {
            res.redirect('/sign-up')
        }

        const user = new User({
            username: username,
            password: password
        });

        user.save().then((user) => {
            const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
                expiresIn: '60 days'
            });

            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });

            res.redirect('/');

        }).catch((err) => {
            console.log('Sign up', err);
            res.status(400).send({ err });
        });
    });
}
