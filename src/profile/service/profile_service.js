import axios from "axios";
export const GetUserProfile = async () => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.REACT_APP_AWS_URL}/api/user/profile`, {
            withCredentials: true,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });


        // Extract the response body
        const parsedBody = JSON.parse(response.data.body);

        // Return the parsed body data
        return parsedBody;
    } catch (error) {
        console.error("Unable to fetch user profile:", error);
        throw new Error("Unable to fetch user profile data");
    }
};