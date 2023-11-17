'use server'

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { _Iuser } from "../interfaces";
import Threads from "../models/thread.model";

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

export const fetchUserPosts = async (userId : string) => {
    try {
        connectToDB();

        // find all threads authored by the user with given user id

        // Todo : populate community

        const threds = await User.findOne({ id : userId})
            .populate({
                path : 'threads',
                model : Threads,
                populate : {
                    path : 'children',
                    model : Threads,
                    populate : {
                        path : 'author',
                        model : Threads,
                        select : 'name image id'
                    }
                }
            })

        return threds;

    } catch (error : any) {
        throw new Error(`Failed to fetch user posts : ${error.message}`)
    }
}