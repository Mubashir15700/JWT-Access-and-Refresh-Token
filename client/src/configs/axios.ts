import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Add a request interceptor to include the access token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle expired access tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Unauthorized (likely token expired)
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("No refresh token available"));
      }

      try {
        // Attempt to get a new access token using the refresh token
        const response = await axios.post(
          "http://localhost:3000/auth/refresh",
          {
            refreshToken,
          }
        );
        const { accessToken } = response.data;

        // Store the new access token
        localStorage.setItem("token", accessToken);

        // Retry the original request with the new access token
        error.config.headers["Authorization"] = `Bearer ${accessToken}`;
        return axios(error.config); // Retry the request
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
