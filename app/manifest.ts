import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'RealChatsApp - Fast & Secure',
        short_name: 'RealChatsApp',
        description: 'The real-time messaging platform built for modern teams and communities.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#0ea5e9',
        icons: [
            {
                src: '/logo.png',
                sizes: '144x144',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/logo.png',
                sizes: '256x256',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/logo.png',
                sizes: '384x384',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
