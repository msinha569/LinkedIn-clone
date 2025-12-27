import axios from 'axios';

const baseURL = "https://unlinked-b.mksinha.me/api/v1"
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
        
        // Check both the custom header AND the message for token expiration
        const isTokenExpired = err.response?.headers['unlinked-token-expired'] === 'true' || 
                              err.response?.data.message === 'Access token expired';
        
        if (err.response?.status === 401 && !originalRequest._retry && isTokenExpired) {
            originalRequest._retry = true;
            console.log('Attempting token refresh...');
            
            try {
                const refreshResponse = await axios.post(
                    `${baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                
                console.log('Token refreshed successfully');
                return axiosInstance(originalRequest);
            } catch (refreshErr) {
                console.log('Token refresh failed, redirecting to login');
                // Clear any stored user data
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(err);
    }
);
