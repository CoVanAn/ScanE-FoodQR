import React from 'react'

interface StructuredDataProps {
  type: 'restaurant' | 'dish' | 'breadcrumb' | 'organization'
  data?: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'restaurant':
        return {
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "Phở An Cồ",
          "alternateName": "Pho An Co Restaurant",
          "description": "Nhà hàng Phở An Cồ - Nơi mang đến hương vị phở truyền thống Việt Nam",
          "url": "https://your-domain.com",
          "telephone": "0922338534", // Thay số thật
          "email": "covanan632003@gmail.com", // Thay email thật
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "290 Kim Mã - Ba Đình", // Thay địa chỉ thật
            "addressLocality": "Hà Nội",
            "addressRegion": "Hà Nội",
            "postalCode": "100000",
            "addressCountry": "VN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "21.03587000", // Thay tọa độ thật
            "longitude": "105.82163000"
          },
          "openingHours": [
            "Mo-Su 06:00-21:00" // Thay giờ mở cửa thật
          ],
          "servesCuisine": ["Vietnamese", "Pho", "Asian"],
          "priceRange": "$$",
          "paymentAccepted": ["Cash", "Credit Card", "VNPay"],
          "currenciesAccepted": "VND",
          "image": [
            "https://your-domain.com/muoi_tieu_goc.jpg",
            "https://your-domain.com/banner.jpg"
          ],
          "logo": "https://your-domain.com/muoi_tieu_goc.jpg",
          "hasMenu": "https://your-domain.com/vi/dishes",
          "acceptsReservations": true,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": "100",
            "bestRating": "5",
            "worstRating": "1"
          }
        }
      
      case 'dish':
        return {
          "@context": "https://schema.org",
          "@type": "MenuItem",
          "name": data.name,
          "description": data.description,
          "image": data.image,
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "VND",
            "availability": "https://schema.org/InStock",
            "url": `https://your-domain.com/vi/dishes/${data.slug}`
          },
          "menuAddOn": {
            "@type": "MenuSection",
            "name": "Món phở",
            "description": "Các loại phở truyền thống"
          },
          "nutrition": {
            "@type": "NutritionInformation",
            "calories": data.calories || "N/A"
          }
        }
      
      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        }

      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Phở An Cồ",
          "alternateName": "Pho An Co Restaurant",
          "url": "https://your-domain.com",
          "logo": "https://photos.google.com/photo/AF1QipM39_E21APArukQ5qDmPwb6G6rem3kClWjFKGcH",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+84-xxx-xxx-xxx",
            "contactType": "customer service",
            "availableLanguage": ["Vietnamese", "English"]
          },
          "sameAs": [
            "https://www.facebook.com/pho-an-co",
            "https://www.instagram.com/pho_an_co",
            "https://www.youtube.com/c/pho-an-co"
          ]
        }
      
      default:
        return {}
    }
  }

  const structuredData = generateStructuredData()

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
