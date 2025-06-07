import mongoose from "mongoose";
import crypto from 'crypto'

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        maxLength: 15,
        minLength: 8,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                // Use a regular expression to check if the value is a valid email address
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
            },
            message: props => `${props.value} is not a valid email address.`,
        },
    },
    password: {
        type: String,
        required: true,
	select:false
    },
    image: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },

    role: {
        type: String,
        default: "user"
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,




})


userSchema.methods.generateResetToken = async function () {
    let resetToken = crypto.randomBytes(16).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetPasswordExpire = Date.now() + 15 * 60 * 60 * 1000

    return resetToken;
}


const User = mongoose.model("User", userSchema)


export default User