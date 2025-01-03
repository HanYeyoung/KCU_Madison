import connectMongo from '../dbconnect';
import Item from "../Item";

export default async function handler(req, res) {
    await connectMongo(); 

    if (req.method === "GET") {
        try {
            const items = await Item.find(); 
            res.status(200).json({ items });
        } catch (error) {
            res.status(500).json({ message: "Error fetching items", error });
        }
    } else if (req.method === "POST") {
        try {
            // 요청 데이터 검증
            const { teamName, teamMember, photo, projectName, description, demoVideo, github_link } = req.body;
            
            if (!teamName || !teamMember || !photo || !projectName || !description) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const newItem = new Item({
                teamName,
                teamMember,
                photo,
                projectName,
                description,
                demoVideo,
                github_link,
            });

            await newItem.save(); 
            res.status(201).json(newItem);
        } catch (error) {
            res.status(500).json({ message: "Error creating item", error });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
