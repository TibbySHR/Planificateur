import axios from "axios";
import config from "./config";

const requestHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

let axiosAPI = axios.create({
  baseURL: config.baseURL,
  timeout: 5000,
  headers: requestHeaders,
});

interface APIError extends Error {
  response?: {
    status: number;
    data: any;
  };
}

/**
 * Handles API errors by creating a custom error message and logging the details.
 * @param {any} error - The error object caught from the API request.
 * @param {string} context - The context in which the error occurred (function name).
 * @throws {APIError} Throws an enhanced error with additional context and response details.
 */
const handleAPIError = (error: any, context: string): never => {
  const errorMessage = `API Error in ${context}: ${error.message}`;
  const apiError: APIError = new Error(errorMessage);

  if (error.response) {
    apiError.response = error.response;
    console.error(
      `${errorMessage} - Status: ${
        error.response.status
      }, Data: ${JSON.stringify(error.response.data)}`
    );
  } else {
    console.error(errorMessage);
  }

  throw apiError;
};

/**
 * Fetches UdeM whole structure from the API.
 * @returns {Promise<any>} The response data from the API.
 * @throws {APIError} Throws an error if the API request fails.
 */
export async function getSchoolStructure() {
  try {
    const response = await axiosAPI.get("/api/v1/faculties");

    return response.data;
  } catch (error) {
    throw new Error("getSchoolStructure API Error: " + String(error));
  }
}

/**
 * Fetches the list of specified programs
 * @param programIds List of program IDs to fetch
 * @returns {Promise<any>} The response data from the API.
 * @throws {APIError} Throws an error if the API request fails.
 */
export async function getPrograms(programIds: string[]) {
  console.log("get programs api ### ", process.env.NODE_ENV);

  try {
    const url = `/api/v1/programs`;
    const params = {
      programs_list: JSON.stringify(programIds),
      include_courses_detail: true,
    };
    const response = await axiosAPI.get(url, { params });

    return response.data;
  } catch (error) {
    handleAPIError(error, "getPrograms");
  }
}

/**
 * Fetches a specific program
 * @param programId Program ID
 * @returns {Promise<any>} The response data from the API.
 * @throws {APIError} Throws an error if the API request fails.
 */
export async function getProgram(programId: string) {
  try {
    const url = `/api/v1/programs/${programId}`;
    const response = await axiosAPI.get(url);

    return response.data;
  } catch (error) {
    handleAPIError(error, "getProgram");
  }
}

/**
 * Fetches the list of specified courses
 * @param courseIds List of course IDs to fetch
 * @returns {Promise<any>} The response data from the API.
 * @throws {APIError} Throws an error if the API request fails.
 */
export async function getCourses(courseIds: string[]) {
  try {
    const url = `/api/v1/courses`;
    const params = {
      course_identifiers: JSON.stringify(courseIds),
    };
    const response = await axiosAPI.get(url, { params });

    return response.data;
  } catch (error) {
    handleAPIError(error, "getCourses");
  }
}

export async function getCourseSchedule(courseId: string) {
  try {
    const url = `api/v1/schedules/`;
    const params = {
      courses_list: JSON.stringify([courseId]),
    };
    const response = await axiosAPI.get(url, { params });
    return response.data;
  } catch (error) {
    handleAPIError(error, "getCourseSchedule");
  }
}

export async function search(query: string) {
  try {
    const url = `/api/v1/search/advanced`;
    const params = {
      query,
    };
    const response = await axiosAPI.get(url, { params });
    console.log(response)

    return response.data;
  } catch (error) {
    handleAPIError(error, "searchCourses");
  }
}