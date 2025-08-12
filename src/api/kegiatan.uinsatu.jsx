import {BASE_API_URL} from "../config/variable.jsx";

const getHeaders = (token) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Fungsi umum untuk membuat permintaan
const request = async (endpoint, token, options = {}) => {
    try {
        const response = await fetch(`${BASE_API_URL}${endpoint}`, {
            ...options,
            headers: {
                // ...getHeaders(token),
                ...(options.body instanceof FormData ? {'Authorization': `Bearer ${token}`} : getHeaders(token)),
                ...options.headers,
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Mengonversi respon ke format JSON
        const data = await response.json();
        return data;
    } catch (error) {
        // Menangani error jaringan atau lainnya
        console.error('API request error:', error);
        throw error;
    }
};

// Fungsi untuk permintaan GET
export const get = (endpoint, accessToken) => {
    return request(endpoint, accessToken, { method: 'GET' });
};

// Fungsi untuk permintaan POST
export const post = (endpoint, accessToken, body) => {
    let options = {
        method: 'POST',
        body
    };

    // Jika body bukan FormData, ubah menjadi JSON
    if (!(body instanceof FormData)) {
        options = {
            ...options,
            body: JSON.stringify(body)
        };
    }

    return request(endpoint, accessToken, options);
};

// Fungsi untuk permintaan PUT
export const put = (endpoint, accessToken, body) => {
    return request(endpoint, accessToken, {
        method: 'PUT',
        body: JSON.stringify(body)
    });
};

// Fungsi untuk permintaan DELETE
export const del = (endpoint, accessToken) => {
    return request(endpoint, accessToken, { method: 'DELETE' });
};