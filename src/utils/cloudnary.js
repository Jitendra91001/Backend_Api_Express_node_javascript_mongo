import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME, 
  api_key: process.env.CLOUDNARY_API_KEY, 
  api_secret:process.env.CLOUNDNARY_SECRET_KEY
});

const cloudnaryonCloud =async function(localFilepath){
    try {
        if(!localFilepath) return null;

       const response = await cloudinary.uploader.upload(localFilepath,{
            resource_type : "auto"
        })

        console.log("file is uploded on cloudnary",response.url);
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilepath);
        return null
    }
}

export {cloudnaryonCloud};