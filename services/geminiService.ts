const BACKEND_URL = 'http://localhost:4000';

export async function sendChatMessage(dashboardData: object, message: string): Promise<string> {
    try {
        const response = await fetch(`${BACKEND_URL}/api/qa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dashboardData,
                message,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error calling backend API:", error);
        if (error instanceof TypeError) { // Network error
            throw new Error("Cannot connect to the backend service. Please ensure it's running.");
        }
        throw error; // Re-throw other errors
    }
}
