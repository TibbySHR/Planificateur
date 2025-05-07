const { NODE_ENV, REACT_APP_API_BASE_URL } = process.env;
const baseURL = NODE_ENV === "development" ? "http://127.0.0.1:8000" : REACT_APP_API_BASE_URL;

if (!baseURL) {
  console.error(
    "API base URL is not defined. Check your environment variables."
  );
}

export default {
  baseURL,
};
