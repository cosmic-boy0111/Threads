
import { createThread, fetchPosts, fetchThreadById } from "./actions/thread.actions";
import { fetchUser, updateUser } from "./actions/user.actions"
import { _Ithread, _Iuser } from "./interfaces";

class User {
    _updateUser = (data : _Iuser) => updateUser(data);
    _fetchUser = (userId : string | undefined | null) => fetchUser(userId);
}

class Thread {
    _createThread = (data : _Ithread) => createThread(data);
    _fetchPosts = (pageNumber = 1, pageSize = 20) => fetchPosts(pageNumber,pageSize);
    _fetchThreadById = (id : string) => fetchThreadById(id);
}


export const Api = {
    _user : new User(),
    _thread : new Thread(),
}