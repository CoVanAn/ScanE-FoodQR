import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Phở An Cồ - Nhà hàng Phở truyền thống Việt Nam',
    short_name: 'Phở An Cồ',
    description: 'Nhà hàng Phở An Cồ - Nơi mang đến hương vị phở truyền thống Việt Nam với menu đa dạng, không gian ấm cúng và dịch vụ tận tâm.',
    start_url: '/',
    display: 'standalone',
    background_color: '#EBE3D8',
    theme_color: '#1c1717',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'vi',
    icons: [
      {
        src: '/muoi_tieu_goc.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any',
      },
      {
        src: '/muoi_tieu_goc.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
    ],
    categories: ['food', 'restaurant', 'business', 'lifestyle'],
    screenshots: [
      {
        src: '/banner.jpg',
        sizes: '1280x720',
        type: 'image/jpeg',
        form_factor: 'wide',
        label: 'Phở An Cồ Restaurant Homepage',
      },
    ],
    shortcuts: [
      {
        name: 'Menu',
        short_name: 'Menu',
        description: 'Xem menu món ăn',
        url: '/vi/dishes',
        icons: [{ src: '/muoi_tieu_goc.jpg', sizes: '96x96' }],
      },
      {
        name: 'Tables',
        short_name: 'Bàn',
        description: 'Xem danh sách bàn',
        url: '/vi/tables',
        icons: [{ src: '/muoi_tieu_goc.jpg', sizes: '96x96' }],
      },
    ],
  }
}
