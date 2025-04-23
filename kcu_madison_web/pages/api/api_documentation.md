# API Endpoint Documentation

This document describes the behavior and usage of the backend API endpoints in the project.

---

##  `POST /api/items` - Submit a New Project Item

### Description:
Uploads a new project item with image(s) and metadata. Images are uploaded to AWS S3, and metadata is stored in MongoDB.

### Request Type:
`POST`

### Content-Type:
`multipart/form-data`

### Required Fields:
- `teamName`: `string`
- `teamMember`: `string[]` (can be a single string or array)
- `photo`: `file[]` (up to 10)
- `projectName`: `string`
- `description`: `string`
- `semester`: `string`
- `used_language`: `string[]`

### Optional Fields:
- `demoVideo`: `string (URL)`
- `github_link`: `string (URL)`

### Behavior:
- Uploads images to S3 via `uploadToS3()`
- Validates required fields
- Stores S3 URLs in the `photo` field
- Saves document to MongoDB

### Responses:
- `201 Created`: Item saved successfully
- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Upload or DB error

---

##  `GET /api/items` - Fetch Project Items

### Description:
Fetches items from MongoDB filtered by `semester` or `projectName`.

### Query Parameters (optional):
- `semester`: string
- `projectName`: string

### Behavior:
- If filters are provided, only matching items are returned
- If no items match, an empty array is returned

### Responses:
- `200 OK`: List of items
- `500 Internal Server Error`: MongoDB query failure

---

## `GET /api/semesters` - Fetch All Unique Semesters or Items in a Semester

### Description:
Returns:
- A list of all unique `semester` values in the DB, or
- All items within a specific `semester` if a query param is passed

### Query Parameters (optional):
- `semester`: string

### Behavior:
- If `?semester=2023-Fall` is passed → returns items for that semester
- If no query → returns all distinct semester values

### Responses:
- `200 OK`: Semesters or items
- `404 Not Found`: No data found
- `500 Internal Server Error`: Query failure
- `405 Method Not Allowed`: Only `GET` supported
