/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'unsplash.com.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    env: {
        SERVER_URL: process.env.SERVER_URL
    }
};

export default nextConfig;
