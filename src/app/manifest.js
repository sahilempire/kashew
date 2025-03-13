import { MetadataRoute } from 'next'

export default function manifest() {
  return {
    name: 'Kashew - Modern Invoicing Platform',
    short_name: 'Kashew',
    description: 'A comprehensive invoicing web application with AI-powered features',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#F5D742',
    icons: [
      {
        src: '/images/Kashew.png',
        sizes: 'any',
        type: 'image/png',
      }
    ],
  }
} 