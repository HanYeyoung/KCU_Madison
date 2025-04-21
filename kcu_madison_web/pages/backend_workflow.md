# 🛠 Backend Workflow Overview (Image Upload + MongoDB + AWS S3)

This document outlines the workflow of the current backend system, which handles project item submissions including image uploads. The backend is built with **Next.js API Routes**, uses **MongoDB** for data storage, and **AWS S3** for image file storage.

---

## 📦 1. Tech Stack

- **Framework**: Next.js (API Routes)
- **Database**: MongoDB (via Mongoose)
- **File Storage**: AWS S3
- **Middleware**: Multer (for handling multipart/form-data)
- **Environment Configuration**: `.env` file

---

## 🚀 2. Workflow: Item Submission

### 🔁 Endpoint: `POST /api/items`

1. **Multer** parses the `multipart/form-data` from the request:
   - `photo`: multiple image files
   - other fields like `teamName`, `teamMember`, `projectName`, etc.

2. **For each image file:**
   - The file buffer is passed to `uploadToS3()` function.
   - A unique S3 key is generated using `uuid`.
   - The file is uploaded to AWS S3 using the SDK (`s3.upload`).
   - The public URL of the uploaded image is returned.

3. **Validation**:
   - Checks that all required fields are present (e.g., `teamName`, `photo`, `projectName`, etc.)
   - Returns 400 error if anything is missing.

4. **MongoDB Storage**:
   - A new `Item` document is created and saved.
   - The `photo` field stores the list of S3 image URLs.

5. **Response**:
   - On success: `201 Created` with the stored item JSON.
   - On failure: appropriate error response (`400`, `500`, etc.)

---

## 📂 3. File Structure (Relevant Backend)

```
/pages
├── /api
│   └── items.js        # Main API route for GET/POST
├── Item.js             # Mongoose schema for project item
├── dbconnect.js        # MongoDB connection helper
s3Uploader.js           # AWS S3 uploader function
.env                    # Contains AWS and MongoDB credentials
```

---

## 🖼 4. AWS S3 Behavior

- Files are uploaded to: `uploads/{UUID}-{originalname}`
- `ACL: 'public-read'` is NOT used because the bucket does not allow ACLs.
- To access the images:
  - Either use **Presigned URLs**, or
  - Set up an authenticated proxy endpoint, or
  - Configure S3 bucket policy to allow specific public reads if required.

---

## 🧪 5. Testing (Postman or Frontend)

- Use `multipart/form-data` format
- Required fields:
  - `teamName`, `teamMember`, `photo` (file), `projectName`, `description`, `semester`, `used_language`
- Optional fields:
  - `demoVideo`, `github_link`

---

## ✅ 6. Environment Variables (.env)

```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-northeast-2
AWS_BUCKET_NAME=kcu-project-image

MONGODB_URI=...
DB_NAME=...
```

---

## 📌 7. Future Improvements (Optional)

- Add JWT or API Key auth to secure `POST /api/items`
- Support `GET /api/items?id=...` for single item fetch
- Add presigned GET URL support for secure image access
- Add input sanitization and rate limiting
