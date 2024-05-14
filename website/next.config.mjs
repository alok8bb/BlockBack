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
};

export default nextConfig;
