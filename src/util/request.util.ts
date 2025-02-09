import axios from "axios";
import Cookies from "js-cookie";
export async function postFetch(url: string, data: any) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    });
    if (res && res.ok) { // Check if the response is successful
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            return data || null; // Return the data if it exists, otherwise return null
        }
    }
    return null;
}

export async function getFetch(url: string) {
    const res = await fetch(url, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        }
    });
    return await res.json();
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Replace this with however you store the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token
    }
    return config;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the server returns a 401, redirect to the login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

