import connectMongo from '../dbconnect';
import Item from "../Item";

export default async function handler(req, res) {
    await connectMongo();

    if (req.method === "GET") {
        const { semester } = req.query; // 쿼리 파라미터에서 semester 값을 가져옴

        try {
            if (semester) {
                // 특정 semester에 해당하는 items 가져오기
                const items = await Item.find({ semester });
                if (items.length === 0) {
                    return res.status(404).json({ message: `No items found for semester: ${semester}` });
                }
                return res.status(200).json({ items });
            } else {
                // 모든 semester 값 가져오기 (중복 제거된 값)
                const semesters = await Item.distinct("semester");
                if (semesters.length === 0) {
                    return res.status(404).json({ message: "No semesters found in the database." });
                }
                return res.status(200).json({ semesters });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ message: "Error fetching data", error });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
