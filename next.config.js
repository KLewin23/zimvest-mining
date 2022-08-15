/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/profile',
                destination: '/profile/base',
            },
            {
                source: '/marketplace',
                destination: '/marketplace/products',
            },
        ];
    },
    reactStrictMode: true,
    images: {
        domains: ['imagedelivery.net', 'lh3.googleusercontent.com'],
    },
};

module.exports = nextConfig;
