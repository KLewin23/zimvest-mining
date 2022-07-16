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
                destination: '/marketplace/base',
            },
        ];
    },
    reactStrictMode: true,
};

module.exports = nextConfig;
