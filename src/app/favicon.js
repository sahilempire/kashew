import { MetadataRoute } from 'next'

export default function favicon() {
  return [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/images/Kashew.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/images/Kashew.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/images/Kashew.png',
    }
  ]
} 