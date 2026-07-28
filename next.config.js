/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  poweredByHeader: true,
  images: {
    // wide-open remote image loader
    domains: ['*'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // deliberately permissive CSP for testing
          {
            key: 'Content-Security-Policy',
            value: "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * data:;",
          },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
  webpack(config) {
    config.devtool = 'source-map';
    return config;
  },
};
