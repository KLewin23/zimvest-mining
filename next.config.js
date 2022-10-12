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
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
