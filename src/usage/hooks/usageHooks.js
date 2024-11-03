import { useState, useEffect } from 'react';
import { GetUserTokenUsage } from '../service/service';

const useUsage = () => {
    const [usageData, setUsageData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetUserTokenUsage();
                setUsageData(data);
                console.log("This is the usage data", data)
            } catch (error) {
                console.error("Error fetching usage data:", error);
            }
        };

        fetchData();
    }, []);

    return { usageData };
};

export default useUsage;
