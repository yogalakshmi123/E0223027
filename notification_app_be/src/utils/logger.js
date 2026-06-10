import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN = process.env.AFFORDMED_TOKEN; 

export async function Log(stack, level, packageName, message) {
    const url = "http://4.224.186.213/evaluation-service/logs";

    const requestBody = {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: packageName.toLowerCase(),
        message: message
    };

    try {
        // Safe timeout option to avoid blocking the main thread execution loop
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); 

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ACCESS_TOKEN
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const textData = await response.text();
        
        if (response.ok) {
            const jsonData = JSON.parse(textData);
            console.log(`✅ Log synced. ID: ${jsonData.logID}`);
            return jsonData;
        }
    } catch (error) {
        // Prevent network failures from stopping the application
        console.warn(`[Local Logger Tracker]: ${message} (${level})`);
    }
}
