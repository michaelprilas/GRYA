# 🕵️‍♂️ Web Kuis "Detektif Grya: Empat Pintu Satu Kode Rahasia"

Aplikasi web kuis interaktif yang dirancang khusus untuk layar ponsel pintar (*smartphone-oriented*). Dibuat untuk melengkapi rubrik kuis di majalah tim perumahan, di mana pemain dapat mengisi data diri, mengunggah bukti share Instagram Story (@kementerianpkp), memasukkan kode rahasia brankas hasil deduksi, dan mendapatkan pengalaman seru saat memecahkan kasus.

---

## ✨ Fitur-Fitur Utama

1. **Desain Mobile-First & Atmosfer Detektif:**
   - Nuansa retro map berkas rahasia (*secret dossier*), amplop pos udara (*airmail*), dan stempel pos klasik.
   - Responsif dan nyaman digunakan dengan satu jempol di smartphone (iPhone & Android).

2. **Formulir Identitas Penyelidik:**
   - **Nama Lengkap**
   - **NIP**
   - **Unit Organisasi**
   - **Unit Kerja**
   - **Nomor WhatsApp**
   - **Username Instagram** (contoh: `@nama_kamu`)
   - *Auto-save:* Data otomatis tersimpan di memori browser peserta jika halaman ter-refresh secara tidak sengaja.

3. **Misi Instagram Story (@kementerianpkp):**
   - Tombol langsung untuk membuka & mengunduh **Preset Template Instagram Story**.
   - Panduan misi yang jelas dengan kewajiban tag / mention **`@kementerianpkp`**.
   - **Area Upload Screenshot Bukti Story:**
     - Mendukung kamera atau galeri smartphone (JPG / PNG).
     - Pratinjau (*thumbnail preview*) langsung di layar sebelum submit.
     - Tombol ganti foto yang praktis.

4. **Brankas Kode Rahasia Interaktif:**
   - Urutan sandi: **Bedah Rumah ➔ FLPP ➔ RUSUN ➔ KPP**.
   - 4 kotak digit kombinasi putar (*tumbler dials*) dengan tombol naik-turun (▲ / ▼), ketik angka langsung, atau keypad angka sentuh cepat (1, 2, 3, 4).
   - Efek suara klik mekanik (*Web Audio API*) saat memutar kombinasi.

5. **Sensasi Validasi Kemenangan ("The WOW Moment"):**
   - **Jika Kode Salah:** Gembok bergetar merah (*shake animation*), suara *clunk* terkunci, dan muncul jendela petunjuk untuk memeriksa kembali teka-teki di majalah.
   - **Jika Kode Benar:**
     - Kaitan gembok berputar terbuka dengan suara logam *click-clack*.
     - Denting melodi kemenangan (*fanfare chime*).
     - Hujan kembang api warna-warni (*confetti explosion*).
     - Hentakan stempel cap basah merah berdebum: **"KASUS TERPECAHKAN - TERVERIFIKASI"**.
     - **Kartu Lencana Detektif Resmi:** Menampilkan Nama, NIP, Unit, Akun Instagram, Waktu Submit, dan **ID Tiket Undian Unik** (misal `#GRYA-8241`).
     - **Tombol Simpan Gambar:** Mengunduh kartu lencana ke galeri ponsel peserta sebagai bukti undian kuis.
     - **Tombol WhatsApp:** Bagikan status kemenangan langsung ke grup WhatsApp tim.

6. **Akses Cepat Poster Majalah:**
   - Tombol **"Buka Poster Majalah"** untuk melihat dan memperbesar gambar poster teka-teki majalah langsung di layar tanpa harus keluar web.

7. **Panel Rahasia Panitia (Admin Panel):**
   - Ketuk logo stempel **"DETEKTIF GRYA" sebanyak 5 kali** di bagian atas untuk membuka panel panitia tersembunyi.
   - Ganti kunci jawaban 4-digit kapan saja tanpa edit kode.
   - Ubah Link Preset Instagram Story.
   - Masukkan URL Google Sheets Webhook.
   - Aktifkan "Mode Uji Coba" (semua kode diterima).
   - Lihat jumlah submisi dan unduh data jawaban peserta ke dalam format **Excel (.CSV)**!

---

## 🚀 Cara Menjalankan Web

Aplikasi ini dibuat murni menggunakan standar web modern tanpa proses build atau instalasi rumit:

1. Buka file `index.html` langsung di browser Anda, atau
2. Jalankan server lokal:
   ```bash
   cd /Users/michael/.gemini/antigravity/scratch/detektif-grya-quiz
   python3 -m http.server 3000
   ```
   Lalu buka di browser: `http://localhost:3000`

---

## 📊 Cara Menyambungkan ke Google Sheets (1 Menit)

Agar semua jawaban peserta langsung masuk rapi ke spreadsheet panitia:

1. Buat Google Sheet baru di [Google Drive](https://sheets.google.com).
2. Di menu Google Sheet, klik **Extensions (Ekstensi)** > **Apps Script**.
3. Buka file `google-apps-script.js` yang ada di folder proyek ini, lalu salin (*copy*) seluruh isinya.
4. Tempel (*paste*) ke editor Apps Script (gantikan fungsi `myFunction` bawaan).
5. Klik tombol **Save** (ikon disket).
6. Di pojok kanan atas, klik tombol biru **Deploy (Terapkan)** > **New deployment (Penerapan baru)**.
7. Pilih jenis **Web app** (klik ikon gerigi di samping 'Select type'):
   - **Description:** `Detektif Grya Webhook`
   - **Execute as:** `Me (email Anda)`
   - **Who has access:** `Anyone (Siapa saja)` *(Penting agar peserta bisa submit tanpa login)*
8. Klik **Deploy**, izinkan akses akun Google Anda jika diminta.
9. Salin URL **Web app** yang diberikan (yang berakhiran `/exec`).
10. Tempel URL tersebut ke file `config.js` pada baris `googleSheetScriptUrl`, **atau** masukkan lewat menu rahasia panitia (ketuk logo 5x).
