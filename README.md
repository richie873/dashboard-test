
Aplikasi dashboard untuk memantau data compliance per brand dan area, dibuat menggunakan Vue (frontend) dan Node.js dengan Express sebagai framework (backend).

Node.js versi 23.7.0
Xampp Versi 8.0.30

Fitur: 
- Filter berdasarkan area dan rentang tanggal
- Bar chart compliance per area
- Tabel compliance per brand per area

Instalasi & Menjalankan Project: 
1. Clone Repository
2. Setup Backend
  - Masuk ke folder backend
  - cd backend
  - Install semua dependencies
    npm install
  - Salin file .env.example menjadi .env
  - cp .env.example .env
  - Buka file `.env` dan sesuaikan dengan konfigurasi database:
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=passwordkamu
    DB_NAME=nama_database
  - Jalankan backend server
    (node server.js)
    Backend akan berjalan di: `http://localhost:5000`
3. Setup Frontend
  - Buka terminal baru:
  - Masuk ke folder frontend
  - cd frontend
  - Install semua dependencies
    npm install
  - Jalankan frontend development server
    (npm run dev)
    Frontend akan berjalan di: `http://localhost:5173`

Dependencies: 
- Backend
   Install semua sekaligus:
   npm install express cors mysql2 dotenv

- Frontend
   Install semua sekaligus:
   npm install axios vue-chartjs chart.js chartjs-plugin-datalabels

API Endpoints:
  `/api/areas` Mengambil daftar semua area 
  `/api/compliance` Mengambil data compliance dengan filter