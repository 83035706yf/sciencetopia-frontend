// src/services/linkPreviewService.js
import { apiClient } from '@/api';

export async function fetchLinkPreview(url) {
    try {
        const response = await apiClient.get('/LinkPreview', { params: { url } });
        return {
            url: url,
            title: response.data.title,
            image: response.data.image,
            description: response.data.description,
        };
    } catch (error) {
        console.error('Error fetching link preview:', error);
        return {
            url: url,
            title: 'Preview unavailable',
            image: '', // Provide a default or error image path if necessary
            description: 'No description available',
        };
    }
}
