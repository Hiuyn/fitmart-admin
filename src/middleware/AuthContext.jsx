export const isAuthenticated = async () => {
    const token = localStorage.getItem('token');

    if (!token) return false;

    try {
        const response = await fetch('/api/protected-data', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.ok; // true if 200–299
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
};