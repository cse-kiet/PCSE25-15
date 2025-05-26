import { useAuthContext } from "../context/AuthContext";
import { Backend_URL } from "../constants";

export const useMessageStore = () => {
    const { authUser } = useAuthContext();

    const storeMessage = async (message) => {
        try {
            const res = await fetch(`${Backend_URL}/api/message/send/${authUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

        } catch (error) {
            console.error(error);
        }
    };

    return { storeMessage };
}

