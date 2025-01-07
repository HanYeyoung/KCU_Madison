import connectMongo from '../dbconnect';

export default async function handler(req, res) {
    try {
        await connectMongo();
        res.status(200).json({ message: "MongoDB connected successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to MongoDB" });
    }
}
