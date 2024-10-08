// constants/messages.js
export const VALIDATION_MESSAGES = {
    ARTICLE: {
      NAME_REQUIRED: "Article name must be between 2 and 255 characters",
      DESCRIPTION_REQUIRED: "Article description must be between 10 and 1000 characters",
      CATEGORY_REQUIRED: "Category is required",
      DOCUMENT_REQUIRED: "Document is required",
      DOCUMENT_SIZE: "File size must be less than 2MB",
      DOCUMENT_TYPE: "Invalid file type. Only PDF, DOCX, and TXT are allowed"
    },
    CATEGORY: {
      NAME_REQUIRED: "Category name is required",
      NAME_LENGTH: "Name must be between 3 and 255 characters",
      SLUG_REQUIRED: "Category slug is required",
      SLUG_LENGTH: "Slug must be between 3 and 60 characters",
      NAME_EXISTS: "Category with this name already exists."
    }
  };
  