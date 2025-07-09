import axios from 'axios';

const baseURL = "https://unlinked-b.mksinha.info/api/v1"
export const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

// Intercept 401 errors and try to refresh the token
axiosInstance.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;
        console.log(err.response?.data.message);
        
        if (err.response?.status === 401 && !originalRequest._retry && err.response?.data.message==='Access token expired') {
            originalRequest._retry = true;
            console.log(baseURL+'/auth/refresh');
            
            try {
                await axios.post(
                    `${baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                return axiosInstance(originalRequest);
            } catch (refreshErr) {
                window.location.href = "/login";
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(err);
    }
);
