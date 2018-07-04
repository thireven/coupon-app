'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');
const {User} = require('../models/User');


const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

//   if(missing_field){
//   const message = `missing field '${missing_field}' in request query`;
//   console.error(message);
//   return res.status(422).send(message);
// }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );


  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

//   if(nonStringField) {
//     const message = `Incorrect field type: expected string`;
//     console.error(message);
//     return res.status(422).send(message);
// }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  // if(nonTrimmedFields){
	// 	const message = `Cannot start or end with whitespace`;
	// 	console.error(message);
	// 	return res.status(422).send(message);
	// }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

//   if(tooSmall){
//     const message = `fields ${tooSmall} are below the min value of ${fieldSize[tooSmall].min}`;
//     console.error(message);
//     return res.status(422).send(message);
// }
//
// if(tooLarge){
// 		const message = `fields ${tooLarge} are above the max value of ${fieldSize[tooLarge].max}`;
// 		console.error(message);
// 		return res.status(422).send(message);
// 	}

  let {username, password, firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();



  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize(user));
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// checks to see if user is already logged in
router.get('/logged', jwtAuth, (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
  console.log(token);
	const tokenPayload = jwt.verify(token, JWT_SECRET);
  console.log(tokenPayload);
	const _username = tokenPayload.user.username;
  console.log(_username);

  console.log(User.findOne({username: _username}));

	User
		.findOne({username: _username})
		.then(user => {
      console.log(user);
			return res.send(user.accountProfile());
		})
		.catch(err => {
			console.log(err);
			return res.status(500).json({message: 'Internal Server Error'});
		});
});


module.exports = router;
