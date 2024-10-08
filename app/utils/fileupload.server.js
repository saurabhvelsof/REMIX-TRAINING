// app/utils/fileupload.server.js

import { createWriteStream } from "fs";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  writeAsyncIterableToWritable,
} from "@remix-run/node";

  // Ensure the directory for uploads exists
  const uploadDirectory = join(process.cwd(), "uploads");
  if (!existsSync(uploadDirectory)) {
    mkdirSync(uploadDirectory, { recursive: true });
  }

// Function to save file to disk
async function saveFileToDisk(data, filename) {
  const filePath = join(uploadDirectory, filename); // Full path to save file

  const writeStream = createWriteStream(filePath);
  await writeAsyncIterableToWritable(data, writeStream); // Write file stream to disk

  return filename; // Return the saved file path
}

// Upload handler that saves file to disk or uses in-memory upload handler
export function uploadHandler() {
  return unstable_composeUploadHandlers(
    // Custom handler to save image files
    async ({ name, data, filename }) => {
      if (name !== "document") {
        return undefined;
      }
      const savedFilePath = await saveFileToDisk(data, filename); // Save file to disk
      return savedFilePath;
    },
    // Fallback to in-memory handler for other fields
    unstable_createMemoryUploadHandler()
  );
}
