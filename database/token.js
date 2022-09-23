import { supabase } from "./client";

async function getTokensFromDatabase() {
    const response = await supabase.from('tokens').select('*');
    return response;
}

async function addTokenToDatabase(token, requests, fetched) {
    const response = await supabase.from('tokens').upsert([{
        token: token,
        requests: requests,
        fetched: fetched,
    }]);
    return response;
}

async function deleteTokenFromDatabase(token) {
    const response = await supabase
        .from('tokens')
        .delete()
        .match({ token: token });
    return response;

}

export { getTokensFromDatabase, addTokenToDatabase, deleteTokenFromDatabase }