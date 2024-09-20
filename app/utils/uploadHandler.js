import fs from "fs";
import path from "path";
import { unstable_createFileUploadHandler } from "@remix-run/node";

// Define the directory to store the uploaded files
const uploadDirectory = "../../public/uploads/articles";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

export const uploadHandler = unstable_createFileUploadHandler({
  directory: uploadDirectory,
  file: ({ filename }) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${uniqueSuffix}-${filename}`;
  },
});
