# ReuseUni2 - Mobile App

ReuseUni2 là một ứng dụng mobile được xây dựng bằng **React Native** và **Expo**, cung cấp một nền tảng mua bán hàng cũ cho sinh viên đại học. Ứng dụng cho phép người dùng duyệt sản phẩm, quản lý cửa hàng của mình, giao dịch với những người khác, và quản lý đơn hàng.

## 🎯 Tính năng chính

- **Trang chủ (Home)**: Duyệt sản phẩm, tìm kiếm, và khám phá các gợi ý
- **Tìm kiếm và lọc**: Tìm kiếm sản phẩm với nhiều tiêu chí lọc
- **Chi tiết sản phẩm (Product Detail)**: Xem thông tin chi tiết, hình ảnh, và đánh giá
- **Giỏ hàng (Cart)**: Quản lý sản phẩm trong giỏ và thanh toán
- **Quản lý cửa hàng (My Shop)**: Chủ cửa hàng có thể:
  - Thêm sản phẩm mới
  - Quản lý danh sách sản phẩm
  - Xem hồ sơ cửa hàng
  - Cài đặt cửa hàng
- **Quản lý đơn hàng (Orders/Activity)**:
  - Đơn hàng yêu cầu
  - Đơn hàng gặp mặt
  - Đơn hàng hoàn thành
  - Đơn hàng bị hủy
  - Đánh giá giao dịch
- **Chat**: Gửi tin nhắn với những người khác
- **Hồ sơ cá nhân (Profile)**: Xem và chỉnh sửa thông tin cá nhân
- **Tài khoản (Account)**: Quản lý địa chỉ giao hàng
- **Cài đặt (Settings)**: Các tùy chọn ứng dụng
- **Xác thực Google**: Đăng nhập bằng Google Sign-In

## 🛠️ Công nghệ sử dụng

### Framework & Runtime
- **React Native**: ^0.81.5
- **React**: ^19.1.0
- **Expo**: ~54.0.30
- **TypeScript**: ~5.9.2

### Navigation
- `@react-navigation/native`: Hỗ trợ điều hướng cơ bản
- `@react-navigation/native-stack`: Điều hướng dạng stack
- `@react-navigation/drawer`: Menu drawer

### UI & Animation
- `react-native-reanimated`: ~4.1.1 (Animationo)
- `react-native-gesture-handler`: ~2.28.0 (Xử lý cử chỉ)
- `@gorhom/bottom-sheet`: ^5.2.8 (Bottom sheet)
- `expo-linear-gradient`: ~15.0.8 (Gradient backgrounds)
- `@expo/vector-icons`: ^15.0.3 (Icons)

### Authentication
- `@react-native-google-signin/google-signin`: ^16.1.1
- `expo-auth-session`: ~7.0.10
- `expo-secure-store`: ~15.0.8 (Lưu trữ an toàn)
- `jwt-decode`: ^4.0.0

### Storage & Device
- `@react-native-async-storage/async-storage`: 2.2.0
- `expo-image-picker`: ~17.0.10

### Monitoring
- `@sentry/react-native`: ~7.2.0 (Error tracking)

### Other
- `react-native-safe-area-context`: ^5.6.2
- `react-native-screens`: ~4.16.0
- `react-native-vector-icons`: ^10.3.0

## 📁 Cấu trúc dự án

```
ReuseUni2/
├── src/
│   ├── AppNavigator.tsx          # Định tuyến chính của app
│   ├── Account/                  # Quản lý tài khoản & địa chỉ
│   ├── Activity/                 # Quản lý đơn hàng & giao dịch
│   ├── Cart/                     # Giỏ hàng
│   ├── ChatDetail/               # Chi tiết chat
│   ├── ChatList/                 # Danh sách chat
│   ├── Home/                     # Trang chủ
│   ├── Login/                    # Màn hình đăng nhập
│   ├── MyShop/                   # Quản lý cửa hàng
│   ├── ProductDetail/            # Chi tiết sản phẩm
│   ├── Profile/                  # Hồ sơ người dùng
│   ├── Search/                   # Tìm kiếm
│   ├── SearchResult/             # Kết quả tìm kiếm
│   ├── Settings/                 # Cài đặt
│   ├── Splash/                   # Màn hình splash
│   ├── Store/                    # Hồ sơ cửa hàng
│   ├── Waiting/                  # Màn hình chờ
│   ├── components/               # Thành phần tái sử dụng
│   │   ├── Header/               # Header
│   │   └── SideMenu/             # Menu bên
│   └── assets/                   # Ảnh và tài nguyên
├── android/                      # Build Android
├── App.tsx                       # Root component
├── app.json                      # Cấu hình Expo
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── metro.config.js               # Metro bundler config
├── babel.config.js               # Babel config
└── eas.json                      # EAS (Expo Application Services) config

```

## 🚀 Cài đặt & Chạy dự án

### Điều kiện tiên quyết
- Node.js >= 18.x
- npm hoặc yarn
- Expo CLI: `npm install -g expo-cli`

### Các bước cài đặt

1. **Clone dự án hoặc điều hướng đến thư mục:**
   ```bash
   cd d:\nam4\Mobile\ReuseUni2
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Chạy dự án**

   **Trên Android:**
   ```bash
   npm run android
   # hoặc
   expo run:android
   ```

   **Trên iOS:**
   ```bash
   npm run ios
   # hoặc
   expo run:ios
   ```

   **Trên Web:**
   ```bash
   npm run web
   # hoặc
   expo start --web
   ```

   **Chạy dev server:**
   ```bash
   npm start
   # hoặc
   expo start
   ```

## 📱 Platforms

- **Android**: Phiên bản ứng dụng được tối ưu hóa cho Android
- **iOS**: Hỗ trợ iPad (`supportsTablet: true`)
- **Web**: Có hỗ trợ web thông qua Expo

## ⚙️ Cấu hình

### Sentry (Error Tracking)
- **DSN**: `https://9e58f8ffc917747b05c7df841283ccc0@o4510505845981184.ingest.us.sentry.io/4510505854238720`
- **Organization**: tran-quang-huy
- **Project**: react-native

### Google Sign-In
Được cấu hình trong `app.json` cho cả Android và iOS. Khoá được lưu trong `android/app/google-services.json`.

### Package Info
- **Tên ứng dụng**: ReuseUni2
- **Phiên bản**: 1.0.0
- **Package Android**: com.qh20166.reuseuni2
- **Owner Expo**: qh20166

## 🔐 Bảo mật

- Sử dụng **Secure Store** để lưu trữ tokens và dữ liệu nhạy cảm
- **JWT** được sử dụng để xác thực
- **Sentry** được tích hợp để theo dõi lỗi trong production

## 📦 Build & Deployment

### Build cho production
```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

### Submit lên store
```bash
eas submit --platform android
eas submit --platform ios
```

## 🧪 Testing

Dự án có một số test file:
- `src/Home/__tests__/HomeScreen.test.tsx`
- `src/Splash/__tests__/SplashScreen.test.tsx`

Chạy tests:
```bash
npm test
```

## 📋 Scripts NPM

| Script | Mô tả |
|--------|-------|
| `npm start` | Khởi động Expo dev server |
| `npm run android` | Chạy trên Android device/emulator |
| `npm run ios` | Chạy trên iOS device/simulator |
| `npm run web` | Chạy trên web |

## 🤝 Cấu trúc Navigation

Ứng dụng sử dụng **React Navigation** với các màn hình chính:

- **Splash**: Màn hình khởi động
- **Login**: Đăng nhập/Đăng ký
- **Home**: Trang chủ (Drawer Navigation)
- **Search**: Tìm kiếm sản phẩm
- **SearchResults**: Kết quả tìm kiếm
- **ProductDetail**: Chi tiết sản phẩm
- **Cart**: Giỏ hàng
- **Profile**: Hồ sơ người dùng
- **Settings**: Cài đặt
- **Account**: Quản lý tài khoản
- **EditAddress**: Chỉnh sửa địa chỉ
- **Store**: Hồ sơ cửa hàng
- **MyShop**: Quản lý cửa hàng
- **AddProduct**: Thêm sản phẩm
- **ShopSettings**: Cài đặt cửa hàng
- **Activity**: Quản lý đơn hàng
- **Orders**: Danh sách đơn hàng (với tabs)
- **Review**: Đánh giá giao dịch
- **ChatList**: Danh sách chat
- **ChatDetail**: Chi tiết cuộc trò chuyện

## 🎨 Styling

Dự án sử dụng các file `*.styles.ts` cho styling:
- `StyleSheet` từ React Native
- `LinearGradient` để tạo gradient

## 📝 Lưu ý phát triển

- Dự án sử dụng **TypeScript** để type safety
- Sử dụng **Expo Modules** để truy cập các tính năng native
- **Gesture Handler** cần phải được wrap ở root component
- **Safe Area** cần phải được sử dụng để tránh layout issues trên notch/notches

## 🐛 Xử lý lỗi

- Sentry được tích hợp để tự động báo cáo lỗi
- Có thể xem logs từ console khi dev

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Sentry Docs](https://docs.sentry.io/platforms/react-native/)

## 📧 Thông tin liên hệ

- **Owner**: qh20166
- **Organization (Sentry)**: tran-quang-huy
- **EAS Project ID**: 0b8c9e65-d988-41f4-8d91-559532343aad

## 📄 License

Private project - Không được phép sử dụng hoặc phân phối mà không có sự cho phép.

---

**Cập nhật lần cuối**: January 5, 2026
