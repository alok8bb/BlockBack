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
        SERVER_URL: process.env.SERVER_URL,
        WEB3_MODAL_PROJECT_ID: process.env.WEB3_MODAL_PROJECT_ID
    },
    webpack: config => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        return config
    }
};

export default nextConfig;
