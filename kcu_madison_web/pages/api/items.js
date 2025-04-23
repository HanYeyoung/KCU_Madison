// pages/api/items.js
import connectMongo from '../dbconnect';
import Item from '../Item';
import multer from 'multer';
import { uploadToS3 } from '../../s3Uploader';

const upload = multer().fields([
  { name: "photo", maxCount: 10 }
]);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === "GET") {
    try {
      const { semester, projectName } = req.query;
      let query = {};
      if (semester) query.semester = semester;
      if (projectName) query.projectName = projectName;

      const items = await Item.find(query);
      res.status(200).json({ items });
    } catch (error) {
      res.status(500).json({ message: "Error fetching items", error });
    }
  } 
  
  else if (req.method === "POST") {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ message: "File upload error", error: err });
      }

      const {
        teamName,
        teamMember,
        projectName,
        description,
        demoVideo,
        github_link,
        semester,
        used_language
      } = req.body;

      const photoFiles = req.files?.photo || [];

      const photoKeys = await Promise.all(photoFiles.map(file =>
        uploadToS3(file.buffer, file.originalname, file.mimetype)
      ));

      const missingFields = [];
      if (!teamName) missingFields.push("teamName");
      if (!teamMember) missingFields.push("teamMember");
      if (!photoKeys || photoKeys.length === 0) missingFields.push("photo");
      if (!projectName) missingFields.push("projectName");
      if (!description) missingFields.push("description");
      if (!semester) missingFields.push("semester");
      if (!used_language) missingFields.push("used_language");

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "Missing required fields",
          missingFields
        });
      }

      const newItem = new Item({
        teamName,
        teamMember: Array.isArray(teamMember) ? teamMember : [teamMember],
        photo: photoKeys,
        projectName,
        description,
        demoVideo,
        github_link,
        semester,
        used_language: Array.isArray(used_language) ? used_language : [used_language],
      });

      try {
        await newItem.save();
        res.status(201).json(newItem);
      } catch (error) {
        res.status(500).json({ message: "Error creating item", error });
      }
    });
  } 
  
  else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
