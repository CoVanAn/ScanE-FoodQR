# 🍽️ ScanE-FoodQR - Client Application

> **Hệ thống QR Order Online** - Giải pháp đặt món thông minh cho nhà hàng

## 📋 Tổng quan

**ScanE-FoodQR** là một ứng dụng web hiện đại cho phép khách hàng tại nhà hàng có thể tự gọi món bằng cách quét mã QR trên bàn. Hệ thống cung cấp trải nghiệm đặt món mượt mà, theo dõi đơn hàng thời gian thực và hỗ trợ quản lý hiệu quả cho nhà hàng.

## 🎯 Phạm vi ứng dụng

Được thiết kế cho các nhà hàng, quán ăn, quán cà phê với quy mô nhỏ và vừa, giúp số hóa quy trình đặt món và nâng cao trải nghiệm khách hàng.

## ✨ Tính năng chính

### 👥 Dành cho Khách hàng
- **🔍 Quét QR Code** - Truy cập menu nhanh chóng
- **📱 Giao diện thân thiện** - Responsive design cho mọi thiết bị
- **🛒 Giỏ hàng thông minh** - Thêm, sửa, xóa món dễ dàng
- **💳 Thanh toán VNPay** - Hỗ trợ thanh toán online an toàn
- **📊 Theo dõi đơn hàng** - Cập nhật trạng thái real-time
- **🌐 Đa ngôn ngữ** - Tiếng Việt, English, 日本語, 中文

[Quét mã qr bàn ăn của nhà hàng] (https://raw.githubusercontent.com/CoVanAn/ScanE-FoodQR/refs/heads/main/public/restaurant_map.png)

### 👨‍💼 Dành cho Quản lý
- **📈 Dashboard tổng quan** - Thống kê doanh thu, đơn hàng
- **🍽️ Quản lý menu** - CRUD món ăn, danh mục
- **⭐ Món ăn nổi bật** - Tùy chỉnh thứ tự ưu tiên
- **🏪 Quản lý bàn ăn** - Tạo QR code, cập nhật trạng thái
- **👥 Quản lý nhân viên** - Phân quyền, theo dõi hoạt động
- **📋 Xử lý đơn hàng** - Cập nhật trạng thái, thanh toán
- **🔄 Real-time updates** - Socket.io cho cập nhật tức thì

## 🛠️ Công nghệ sử dụng

### Frontend Framework
- **Next.js 14/15** - React framework với App Router
- **TypeScript** - Type safety và developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library hiện đại

### State Management & Data Fetching
- **React Query** - Server state management
- **React Hook Form** - Form validation
- **Zustand** - Client state management
- **Context API** - Global state (Cart, Auth)

### Internationalization
- **next-intl** - Multi-language support
- **Dynamic routing** - Locale-based routing

### Real-time & Payments
- **Socket.io Client** - Real-time communication
- **VNPay SDK** - Payment gateway integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Zod** - Schema validation

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+
- npm hoặc yarn
- Git


### Chạy ứng dụng

```bash
# Development mode
npm run dev
# hoặc
yarn dev

# Production build
npm run build
npm start
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 📁 Cấu trúc thư mục

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── [locale]/          # Localized routes
│   │   ├── (auth)/        # Authentication pages
│   │   ├── (public)/      # Public pages (menu, tables)
│   │   ├── guest/         # Guest dashboard
│   │   └── manage/        # Admin dashboard
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── custom/           # Custom components
├── lib/                  # Utilities and configurations
│   ├── hooks/            # Custom React hooks
│   └── utils.ts          # Helper functions
├── queries/              # React Query hooks
├── schemaValidations/    # Zod schemas
├── types/               # TypeScript types
├── constants/           # App constants
├── i18n/               # Internationalization
└── middleware.ts       # Next.js middleware
```

## 🔐 Xác thực và phân quyền

### Roles hệ thống
- **Owner** - Quản trị viên cấp cao
- **Employee** - Nhân viên nhà hàng  
- **Guest** - Khách hàng

### Authentication flow
1. **Admin/Employee** - JWT tokens (Access + Refresh)
2. **Guest** - Temporary tokens qua QR code
3. **Middleware** - Route protection theo role

## 🌐 Đa ngôn ngữ

Hỗ trợ 4 ngôn ngữ:
- **🇻🇳 Tiếng Việt** (mặc định)
- **🇺🇸 English**
- **🇯🇵 日本語**
- **🇨🇳 中文**

Routes tự động thêm prefix locale: `/vi/menu`, `/en/menu`, `/ja/menu`, `/zh/menu`

## 📱 Responsive Design

- **Mobile First** - Tối ưu cho điện thoại
- **Tablet Support** - Giao diện iPad/tablet
- **Desktop Ready** - Màn hình lớn
- **PWA Ready** - Có thể cài đặt như app

## 🧪 Testing & Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Connect to Vercel
vercel

# Deploy
vercel --prod
```

### Docker
```bash
# Build image
docker build -t scanefoodqr-client .

# Run container
docker run -p 3000:3000 scanefoodqr-client
```

## 🔧 Scripts có sẵn

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint checking
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # TypeScript checking
```

## 📊 Performance

- **Core Web Vitals** - Tối ưu cho Google metrics
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Dynamic imports
- **Caching** - React Query + Next.js caching

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

- **Developer**: CoVanAn
- **Project**: ScanE-FoodQR System


