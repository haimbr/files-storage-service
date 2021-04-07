const express = require('express');
const User = require('../models/userModel');
const { checkUser } = require('../middleware/auth');

const router = new express.Router();


const handleErrors = (err) => {
    let errors = { email: '', password: '' };
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }
    return errors;
}

router.post('/users/signUp', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 })
        res.status(201).send(user);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    }
})



router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
        res.status(201).send(user);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    }
})

router.post('/users/logout', checkUser, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.cookie('jwt', '', { maxAge: 1 });
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


router.get('/get/files', checkUser, async (req, res) => {
    try {
        await req.user.populate({ path: 'files' }).execPopulate();
        res.send(req.user.files);
    } catch (err) {
        res.status(400).send(err);
    }
})




module.exports = router;