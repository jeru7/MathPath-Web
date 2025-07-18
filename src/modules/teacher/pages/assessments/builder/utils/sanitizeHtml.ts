import DOMPurify from "dompurify";

export const sanitizeHtml = (rawHtml: string): string => {
  return DOMPurify.sanitize(rawHtml);
};
