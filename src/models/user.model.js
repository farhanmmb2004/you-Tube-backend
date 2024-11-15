import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
const userSchema=new Schema({
username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
},
fullname:{
    type:String,
    required:true,
    lowercase:true,
    trim:true,
},
avtar:{
    type:String,
    required:true,
},
coverImage:{
    type:String,
},
watchHistory:[{
    type:Schema.Types.ObjectId,
    ref:"video"
}],
password:{
    type:String,
    required:[true,'password is required'],
    refreshToken:{
        type:String
    }
}
},{
    timestamps:true
}) 
userSchema.pre("save",async function (next) {
    if(this.isModified("password")){
    return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
});
userSchema.methods.isPasswordCorrect=async function(password){
return await bcrypt.compare(password,this.password);
}   
userSchema.methods.generateAccessToken=function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },'danish-bhai-jinda-hote-na',{
    expiresIn:'1d'
    })
}
userSchema.methods.generateRefresToken=function(){
    jwt.sign({
        _id:this._id,
    },'danish-bhai-jinda-hote-na',{
    expiresIn:'10d'
    })
}
export const User=mongoose.model("User",userSchema);