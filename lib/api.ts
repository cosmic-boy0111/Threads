
import { updateUser } from "./actions/user.actions"
import _Iuser from "./interfaces";

class User {
    _updateUser = (data : _Iuser) => updateUser(data);
}


export const Api = {
    _user : new User(),
}