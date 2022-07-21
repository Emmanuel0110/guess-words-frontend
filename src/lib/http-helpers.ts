
//Interceptor for 401/403 errors
export const customFetch = async (input: RequestInfo, init?: RequestInit | undefined) : Promise<Response> => {
  const response = await fetch(input, init);
    if (response.status === 401) {
      throw("Bad credentials, please login");
    }
    if (response.status === 403) {
      throw("You are not authorized to do this");
    }
    return response;
}

 //Setup headers with token
export const authHeaders = () => {
    //Get token from State or localstorage
    const token = localStorage.token;
    //Headers
    const headers : {[key : string]: any} = {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Headers': 'Origin,access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type,x-auth-token',
        // 'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE'
    }
    //If token, add to headers
    if(token){
        headers['x-auth-token'] = token;
    }
    return headers;
}