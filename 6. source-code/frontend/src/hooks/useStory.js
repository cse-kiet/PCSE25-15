import { Backend_URL } from "../constants";

export const useStory = () => {
    const storeStory = async (story) => {
        console.log("story is ", story);
        try {
            const res = await fetch(`${Backend_URL}/api/feature/story`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(story)
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

        } catch (error) {
            console.error(error);
        }
    };

    return { storeStory };
}


