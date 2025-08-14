# Hướng dẫn cài đặt dự án Frontend với Shopify App

## 1. Cài đặt dependencies Node.js
```bash
npm install
```

## 2. Tạo file `.env` từ file mẫu
```bash
cp .env.example .env
```

## 3. Cấu hình các biến môi trường trong `.env`
- Thay `ROOT_API` thành URL API backend (ví dụ: `https://your-backend.com`).
- Thay `ROOT_URL` thành URL frontend (ví dụ: `https://your-frontend.com`).
- Thêm `SHOPIFY_API_KEY` từ Shopify App:
```
SHOPIFY_API_KEY=your_shopify_app_key
```

## 4. Chạy dự án local
```bash
npm start
```

## 5. Ghi chú
- Đảm bảo backend đang chạy trước khi start frontend.
- Kiểm tra `CORS` trên backend để cho phép frontend gọi API.
