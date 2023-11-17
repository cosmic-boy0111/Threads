import { 
    addCommentToThread, 
    createThread, 
    fetchPosts, 
    fetchThreadById 
} from "./actions/thread.actions";
import { fetchUser, fetchUserPosts, updateUser } from "./actions/user.actions"
import { _IcommentToThread, _Ithread, _Iuser } from "./interfaces";

class User {
    _updateUser = (data : _Iuser) => updateUser(data);
    _fetchUser = (userId : string | undefined | null) => fetchUser(userId);
    _fetchUserPosts = (userId : string) => fetchUserPosts(userId);
}

class Thread {
    _createThread = (data : _Ithread) => createThread(data);
    _fetchPosts = (pageNumber = 1, pageSize = 20) => fetchPosts(pageNumber,pageSize);
    _fetchThreadById = (id : string) => fetchThreadById(id);
    _addCommentToThread = ( data : _IcommentToThread ) => addCommentToThread(data);
}


export const Api = {
    _user : new User(),
    _thread : new Thread(),
}