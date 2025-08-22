# Hướng dẫn cài đặt dự án Frontend với Shopify App

## 1. Cài đặt dependencies Node.js
```bash
npm install
```

## 2. Tạo file `.env` từ file mẫu
```bash
cp .env.example .env
```
## 2. Tạo một url bằng cloudflare/ngork - tương tự fe với port 3001 hoặc có thể khác
Mở terminal ở thư mục có chưa file cloudflared.exe
```bash
.\cloudflared.exe tunnel --url http://localhost:3001
```
** có thể đổi port khác ở file package.json

## 3. Cấu hình các biến môi trường trong `.env`
- Thay `ROOT_API` thành URL API backend (ví dụ: `https://your-backend.com`). //url đã tạo ở BE
- Thay `ROOT_URL` thành URL frontend (ví dụ: `https://your-frontend.com`). // url đã tạo ở trên
- 

## 4. Update shopify key từ app config: `SHOPIFY_API_KEY` từ Shopify App:
SHOPIFY_API_KEY=your_shopify_app_key
```

## 4. Chạy dự án local
```bash
npm run dev
```

## 5. Ghi chú
- Kiểm tra đúng url của fe, be, đúng app key
- Đảm bảo backend đang chạy trước khi start frontend.
