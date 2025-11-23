import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	cacheComponents: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "image.tmdb.org",
				port: "",
				pathname: "/t/p/w500/**",
			},
		],
	},
};

export default nextConfig;
