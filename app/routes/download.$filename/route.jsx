import { createReadStream } from "fs";
import { join } from "path";
import { statSync } from "fs";
import { requireUserId } from "../../utils/auth.server";

export const loader = async ({ request, params }) => {
  await requireUserId(request);
  const { filename } = params;
  // console.log(filename);
  // Construct the file path based on the filename
  const filePath = join(process.cwd(), "uploads", filename);

  // Check if the file exists
  try {
    statSync(filePath);
  } catch (error) {
    throw new Response("File not found", { status: 404 });
  }

  // Create a readable stream for the file
  const fileStream = createReadStream(filePath);

  // Set the content type and disposition for download
  return new Response(fileStream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
};
