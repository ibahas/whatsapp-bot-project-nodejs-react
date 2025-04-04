/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development'
});

const nextConfig = withPWA({
    reactStrictMode: true,
    images: {
        domains: ['localhost'], // Add your image domains here
    },
    experimental: {
        serverActions: true,
    },
});

module.exports = nextConfig;