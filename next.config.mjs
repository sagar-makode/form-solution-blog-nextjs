/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['blogger.googleusercontent.com','res.cloudinary.com'], // Add your domain here
    },
    eslint:{
      ignoreDuringBuilds :true,
    }
  };

export default nextConfig;
