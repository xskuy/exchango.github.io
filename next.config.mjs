/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				fs: false,
				net: false,
				tls: false,
			}
		}
		return config
	},
	experimental: {
    serverActions: true,
    appDir: true,
	},
	reactStrictMode: true,
};

export default nextConfig;
