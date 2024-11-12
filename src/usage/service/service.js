import axios from "axios";

export const GetUserTokenUsage = async () => {
    try{
        const response = await axios.get(`${process.env.AWS_URL}/api/usage`, {
            withCredentials: true,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        });
    
        const data = response.data;
        return data

    }catch(error){
        throw new Error("Error fetching usage stats", error.message)
    }
}

