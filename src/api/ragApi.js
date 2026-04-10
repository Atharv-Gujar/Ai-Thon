import axios from "axios";

// Reads from .env → VITE_API_BASE_URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Upload a PDF research paper for indexing.
 * @param {File} file - The PDF file to upload.
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export async function uploadPaper(file) {
  const formData = new FormData();
  formData.append("data", file);

  return axios.post(`${BASE_URL}/upload-paper`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * Query the RAG agent with a question about the uploaded paper.
 * @param {string} query - The user's question.
 * @returns {Promise<string>} The AI response text.
 */
export async function queryPaper(query) {
  const response = await axios.post(
    `${BASE_URL}/rag-agent`,
    { query: { query } },
    { headers: { "Content-Type": "application/json" } }
  );
  return typeof response.data === "string"
    ? response.data
    : JSON.stringify(response.data);
}
