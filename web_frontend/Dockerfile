# اختيار بيئة خفيفة من Node.js
FROM node:22-alpine

# تحديد مسار العمل جوه الكونتينر
WORKDIR /app

# نسخ ملفات الـ package عشان ننزل الباكدجات الأول (ده بيسرع الـ Build)
COPY package*.json ./

# تنزيل الباكدجات
RUN npm install

# نسخ باقي ملفات المشروع 
COPY . .

# فتح البورت اللي Vite بيستخدمه
EXPOSE 5173

# أمر تشغيل المشروع
CMD ["npm", "run", "dev", "--", "--host"]