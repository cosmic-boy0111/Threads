'use server'

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { _Iuser } from "../interfaces";

export const updateUser = async ({
    userId,
    username,
    name,
    bio,
    image,
    path 
} : _Iuser ) : Promise<void> => {
    try {

        connectToDB();

        await User.findOneAndUpdate(
            { id : userId},
            {
                username : username.toLowerCase(),
                name,
                bio,
                image,
                onboarded : true,
            },
            { upsert : true },
        )

        if(path === "/profile/edit"){
            revalidatePath(path);
        }

    } catch (error : any) {
        throw new Error(`failed to create/update user : ${error.message}`)
    }
}

export const fetchUser = async ( userId : string | undefined | null ) => {
    try {
        connectToDB();
        return await User
        .findOne({ id : userId })
        // .populate({
        //     path : 'communities',
        //     model : Community
        // })
    } catch (error : any) {
        throw new Error(`failed to fetch user : ${error.message}`)
    }
}