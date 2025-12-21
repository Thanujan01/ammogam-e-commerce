export const getImageUrl = (path: string | undefined): string => {
    if (!path) return '/placeholder.png'; // Make sure you have a placeholder.png in public/
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;

    // Assume relative paths starting with /uploads need the backend host
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Remove /api suffix to get root (e.g., http://localhost:5000)
    const rootUrl = apiUrl.replace(/\/api$/, '');

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${rootUrl}${cleanPath}`;
};
