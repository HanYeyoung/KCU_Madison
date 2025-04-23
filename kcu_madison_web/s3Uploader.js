import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// AWS 설정
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// S3 인스턴스 생성
const s3 = new AWS.S3();

/**
 * S3에 파일 업로드하고 URL 반환
 * @param {Buffer} buffer - 업로드할 파일 버퍼
 * @param {string} originalname - 원래 파일 이름
 * @param {string} mimetype - 파일 MIME 타입
 * @returns {Promise<string>} - S3에 업로드된 파일의 URL
 */

export const uploadToS3 = async (buffer, originalname, mimetype) => {
  const key = `uploads/${uuidv4()}-${originalname}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  };

  try {
    await s3.upload(params).promise();
    return key;
  } catch (error) {
    console.error("S3 업로드 실패:", error);
    throw error;
  }
};