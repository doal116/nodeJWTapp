import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Please enter an email.'],
            validate: [validator.isEmail, 'Please enter a valid email.'],
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            minlength: [6, 'Minimum characters: 6.'],
            required: [true, 'Enter a password.'],
        }
    }
    , {
        timestamps: true
    }
);

//error handler for signup and login
const errorHandler = (err) => {
    let errors = { email: '', password: '' };

    //duplicate errors
    if (err.code === 11000) {
        errors['email'] = 'Email already registered.';
        return errors;
    }

    //validation erross
    if (err.message.includes('users validation failed')) {
        Object.values(err.errors).forEach((error) => {
            if (error['properties']) {
                errors[error['properties']['path']] = error['properties']['message']
            }
        })
        return errors;
    }

    //Incorrect password
    if (err.message.includes('Incorrect password.')) {
        errors['password'] = 'Incorrect password.';
        return errors;
    }

    //Unregistered email
    if (err.message.includes('Email not registered.')) {
        errors['email'] = 'Email not registered.';
        return errors
    }

    return { email: 'error not caught', password: 'error not caught' };
}

//mongoose hooks pre used for password hashing 
userSchema.pre('save', async function (next) {
    const user = this;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(user.password, salt);
    next();
});

userSchema.statics.signUp = async (email, password) => {
    try {
        const user = await User.create({ email: email, password: password });
        return user;
    } catch (err) {
        const errors = errorHandler(err);
        return { errors };
    }
}

userSchema.statics.login = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) return user;
            else throw new Error('Incorrect password.');
        } else throw new Error('Email not registered.');
    } catch (err) {
        const errors = errorHandler(err);
        return { errors };
    }
}


let User = mongoose.model('users', userSchema);

export default User;