/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/profile',
                destination: '/profile/base',
            },
        ];
    },
    reactStrictMode: true,
};

module.exports = nextConfig;
