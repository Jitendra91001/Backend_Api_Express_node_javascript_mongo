import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { cloudnaryonCloud } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(userId)=>{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefressToken()

    user.refressToken=refreshToken
   await user.save({validateBeforeSave:false})

   return {accessToken,refreshToken}
    
  } catch (error) {
    throw new ApiError(500,"something went wrong while generating refresh token and access token");
  
  }
}

const ragisterUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //     message:"welcome"
  // })

  const { Username, fullname, email, password } = req.body;
  // console.log({
  //     UserName:Username,
  //     fullname:fullname,
  //     email:email,
  //     password:password
  // })
  if ([Username, fullname, email, password].some((err) => err?.trim() === "")) {
    return res.ApiError(400, "All fields is required");
  }

  const existedUser =await User.findOne({
    $or: [{ Username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarlocalPath = req.files?.avatar[0].path;
//   const coverImagelocalPath = req.files?.coverImage[0].path;
let coverImagelocalPath;
if(req.files && req.files.coverImage && req.files.coverImage.length > 0){
    coverImagelocalPath = req.files.coverImage[0].path;

}

  if (!avatarlocalPath) {
    throw new ApiError(400, "Avatarlocalfile file is required");
  }
 const avatar= await cloudnaryonCloud(avatarlocalPath)
 const coverImage= await cloudnaryonCloud(coverImagelocalPath)
 if(!avatar){
    throw new ApiError(400, "Avatar file is required");
 }

 const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    password,
    Username,
    email,
 })

 const createdUser = await User.findById(user._id).select(
    "-password -refressToken"
 )

 if(!createdUser){
    throw new ApiError(500,"Something went wrong while ragister the user");
 }

 console.log(createdUser);

 return res.status(201).json(
    new ApiResponse(200,createdUser,"User ragister successfuly")
 )

});

const loginUser = asyncHandler(async(req,res) => {
// req body -> body
//username or email
//find the user if user not exist throw error
//check the password
//access and refresh token
//send the cookies sequre

const {Username,email,password} = req.body;
// if([Username,email,password].some((err)=>err.trim() === "")){
//   throw new ApiError(400,"Username or password is requred");
// }

if(!Username || !email){
  throw new ApiError(400,"Username or email is requred");
}

const user = await User.findOne({
  $or: [{Username},{email}]
})

if(!user){
  throw new ApiError(400,"user does not exist");
}

const isPassword = await user.isPasswordCorrect(password);

if(isPassword){
  throw new ApiError(401,"Invalid password")
}

const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
const loggedInUser=User.findById(user._id).select("-password -refreshToken")

const option = {
  httpOnly:true,
  secure:true
}

return  res.status(200)
.cookie("accessToken",accessToken,option)
.cookie("refreshToken",refreshToken,option)
.json(
  new ApiResponse(
    {
      user : loggedInUser,accessToken,refreshToken
    },"User logged In Successfully"
  )
)



})

const logoutUser = asyncHandler(async(req,res)=>{
   User.findById()
})

export { 
  ragisterUser,
  loginUser,
  logoutUser
 };
