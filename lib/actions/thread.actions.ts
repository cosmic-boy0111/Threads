'use server'

import { revalidatePath } from "next/cache";
import Threads from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { _Ithread } from "../interfaces";

export const createThread = async ( 
    {  
        text,
        author,
        communityId,
        path
    } : _Ithread
) => {

    try {
        connectToDB();

        const createdThread = await Threads.create({
            text,
            author,
            community : null,
        });


        await User.findByIdAndUpdate(author, {
            $push : {
                threads : createdThread._id
            }
        })

        revalidatePath(path);

    } catch (error : any) {
        throw new Error(`Error creating thread : ${error.message}`);
    }

}

export const fetchPosts = async ( pageNumber : number , pageSize : number) => {
    connectToDB();

    // calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch posts that have no parents (top-level posts ...)
    const postsQuery =  Threads.find({ parentId: { $in: [null,undefined] } })
        .sort({ createdAt : 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path : 'author', model : User })
        .populate({ 
            path : 'children',
            populate : {
                path : 'author',
                model : User,
                select : "_id name parentId image"
            }
        })

    const totalPostsCount = await Threads.countDocuments(
        { parentId: { $in: [null,undefined] } }
    );

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };

}

export const fetchThreadById = async (id : string) => {
    connectToDB();
    try {

        // Todo : Populate community

        const thread = await Threads.findById(id)
            .populate({
                path : 'author',
                model : User,
                select : "_id id name image"
            })
            .populate({
                path : 'children',
                populate : [
                    {
                        path : 'author',
                        model : User,
                        select : "_id id name parentId image"
                    },
                    {
                        path : 'children',
                        model : Threads,
                        select : "_id id name parentId image"
                    }
                ]
            }).exec();

            return thread;

    } catch (error : any) {
        throw new Error(`Error while fetching thread : ${error.message}`);
    }
}