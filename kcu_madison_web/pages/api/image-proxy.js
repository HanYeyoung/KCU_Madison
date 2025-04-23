// pages/api/image-proxy.js
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req, res) {
  const { key } = req.query; //key는 AWS S3에 저장되는 key를 뜻함.


  if (!key) {
    return res.status(400).json({ message: "Missing image key" });
  }

  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${key}`, // MongoDB에 저장된 key 넘기기기
    };

    const data = await s3.getObject(params).promise();

    res.setHeader('Content-Type', data.ContentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 선택: 캐싱
    res.send(data.Body);
  } catch (error) {
    console.error("Image fetch error:", error);
    res.status(500).json({ message: "Error fetching image" });
  }
}
