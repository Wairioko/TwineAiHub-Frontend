import axios from "axios";

export const GetUserTokenUsage = async () => {
    try{
        const response = await axios.get('https://2tzlahwab9.execute-api.us-east-1.amazonaws.com/dev/api/usage', {
            withCredentials: true,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        });
    
        const data = response.json();
        return data

    }catch(error){
        throw new Error("Error fetching usage stats", error.message)
    }
}

