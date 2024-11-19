import axios from "axios";


export const GetUserTokenUsage = async () => {
    try{
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.REACT_APP_AWS_URL}/api/usage`, {
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

