/**
 * KONFIGURASI KUIS DETEKTIF GRYA
 * Anda dapat mengubah kunci jawaban, URL Google Sheet, atau Link Preset IG di sini.
 */
const QUIZ_CONFIG = {
  // Judul Kuis
  title: "Detektif Grya: Empat Pintu Satu Kode Rahasia",
  
  // Format Kode: Bedah Rumah -> FLPP -> RUSUN -> KPP
  // Kode resmi teka-teki majalah: 2134
  // (Rumah 2: Bedah Rumah, Rumah 1: FLPP, Rumah 3: RUSUN, Rumah 4: KPP)
  correctCode: "2134", 

  // Akun resmi yang wajib ditag di Instagram Story
  instagramTag: "@kementerianpkp",

  // Link Preset Template Instagram Story (misal Canva / GDrive / link download)
  // Ganti link ini dengan tautan preset panitia Anda
  instagramPresetUrl: "https://bit.ly/preset-story-grya",

  // URL Google Apps Script Web App (Webhook pengumpul jawaban ke Google Sheets)
  googleSheetScriptUrl: "https://script.google.com/macros/s/AKfycbxrJ6L3BlTXl131PzJhnMhNOVHBF__AVBKPfksGuXrPSm7HC6Fse0TO17YLxTsnOfsm/exec",

  // Nama Majalah / Edisi
  edition: "Edisi Merdeka Punya Rumah",

  // Pesan Sukses
  successMessage: "Selamat, Detektif! Brankas kode rahasia berhasil dibuka. Jawaban dan data Anda telah tercatat ke arsip panitia!",

  // Informasi Hadiah / Catatan
  footerNote: "Simpan tangkapan layar (screenshot) lencana detektif Anda sebagai bukti kepesertaan."
};
