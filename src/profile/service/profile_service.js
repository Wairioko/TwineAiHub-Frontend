import axios from "axios";
export const GetUserProfile = async () => {
    try {
        const response = await axios.get(`${process.env.AWS_URL}/api/user/profile`, {
            withCredentials: true,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        // Check if response is okay
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("this is the json response", data);
        return data;
    } catch (error) {
        console.error("Unable to fetch user profile:", error);
        throw new Error("Unable to fetch user profile data");
    }
};