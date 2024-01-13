import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

const UserSchema = new Schema({
    Username:{
        type:String,
        lowercase:true,
        trim:true,
        unique:true,
        index:true,
        // required:true,
    },
    email:{
        type:String,
        lowercase:true,
        trim:true,
        unique:true,
        index:true,
    },
    fullname:{
        type:String,
        lowercase:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
    },
    watchHistroy:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
},{timestamps:true});

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
})

UserSchema.methods.isPasswordCorrect = async function(password){
   const data =  await bcrypt.compare(password,this.password);
   return data;
}

UserSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullname:this.email,
            Username:this.Username,
            fullname:this.fullname
        },
        process.env.ACESS_TOKEN_SECRET,
        {
           expiresIn:process.env.ACESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefressToken = function(){
   return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESS_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESS_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User",UserSchema);
