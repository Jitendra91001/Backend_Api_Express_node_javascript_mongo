import mongoose,{Schema} from "mongoose";

const SubscriptionSchema = new Schema({
    Subscriber : {
        type : Schema.Types.ObjectId,
        ref:"User"
    },

    channal : {
        type : Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const subscription = mongoose.model("Subscription",SubscriptionSchema)