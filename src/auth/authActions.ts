import { Dispatch, SetStateAction } from 'react';
import { url } from '../App';
import { User } from '../App';
import { customFetch, authHeaders } from '../lib/http-helpers';

//Check token & load user
export const loadUser = (setUser: Dispatch<SetStateAction<User | null>>, setIsAuthenticated: (b:boolean)=>void) =>{
    customFetch(url + 'auth/user', {headers: authHeaders()}
    ).then(res => {
        if (!res.ok) {
            throw Error(res.statusText);
        } else return res.json();
    }).then(res => {
      setIsAuthenticated(true);
      setUser(res.user);
    }).catch((err: Error) =>{
      setIsAuthenticated(false);
      setUser(null);
    });
}

export const register = ({username, password} : {username : string, password : string}, setIsAuthenticated: (b:boolean)=>void, setUser: (user: any)=>void) => {
    const headers = {
            'Content-Type': 'application/json'
    }
    const body = JSON.stringify({username, password});
    customFetch(url + 'users', {method: 'POST', headers, body})
    .then((res: any)=>res.json())
    .then((res: any)=>{
        if (!res.token) {
            throw Error(res.msg);
        }
        setIsAuthenticated(true);
        setUser(res.user);
        localStorage.setItem('token', res.token);
    }).catch((err: Error)=>{
        setIsAuthenticated(false);
    });
}

export const login = ({username, password} : {username : string, password : string}, setIsAuthenticated: (b:boolean)=>void, setUser: (user: any)=>void) => {
    const headers = {
        'Content-Type': 'application/json'
    }
    const body = JSON.stringify({username, password});
    customFetch(url + 'auth', {method: 'POST', headers, body})
    .then(res=>res.json())
    .then(res=> {
        if (!res.token) {
            throw Error(res.msg);
        }
        setIsAuthenticated(true);
        setUser(res.user);
        localStorage.setItem('token', res.token);
    }).catch((err: Error) => {
        setIsAuthenticated(false);
    });
}

//Logout User
export const logout = () => {
    window.localStorage.clear(); //Clear out the cache
    window.location.href = '/'; //Force a browser refresh to clear in-memory data
}