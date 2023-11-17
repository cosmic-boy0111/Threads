import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { Api } from "@/lib/api";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {

    if(!params.id) return null;
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await Api._user._fetchUser(user?.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    const thread = await Api._thread._fetchThreadById(params.id);

    return (
        <section className=" relative" >
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>

            <div className=" mt-7 ">
                {/* <Comment
                    threadId={thread._id}
                    currentUserImage={user.imageUrl}
                    currentUserId={JSON.stringify(userInfo._id)} 
                /> */}
            </div>
        </section>
    )
}

export default page