const bcrypt = require('bcrypt');
const validator = require('validator');

const User = require('../models/userModel')

const validateAndEncrypt = async (username, email, password, emailPresent=true) => {
    //checks if all fields filled
    if ((emailPresent && !email) || !password || !username) {
        throw Error("All fields must be filled");
    }

    //checks for valid email format
    if (emailPresent && !validator.isEmail(email)) {
        throw Error ("Please Enter a Valid Email");
    }
    
    //checks if the email already exists

    if (emailPresent) {
        const existsEmail = await User.findOne({ email });
        
        if (existsEmail) {
            throw Error("Email already in use");
        }
    }
    
    //checks if the username already exists
    const existsUsername = await User.findOne({ username });
    
    if (existsUsername) {
        throw Error("Username already in use");
    }
    
    //checks if raw password strong enough
    if (!validator.isStrongPassword(password)){
        throw Error ("Password not strong enough");
    }

    //add extra protection to the password so even same passwords are stored differently
    const salt = await bcrypt.genSalt(10);
    
    //encrypts the password
    const hash = await bcrypt.hash(password, salt);

    return { username, email, password: hash }
}

module.exports = validateAndEncrypt