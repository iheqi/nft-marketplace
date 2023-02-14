/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  // assetPrefix: isProd ? 'nft-marketplace' : '', // 部署到 git pages
}

module.exports = nextConfig
