

export const GetUserTokenUsage = async () => {
    try{
        const response = await fetch('http://localhost:4000/api/usage', {
            method: "GET",
            credentials: "include",
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

