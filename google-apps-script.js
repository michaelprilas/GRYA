/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - PENGUMPUL JAWABAN KUIS DETEKTIF GRYA
 * =========================================================================
 * 
 * FITUR:
 * 1. Otomatis mencatat data diri & jawaban kuis peserta ke Google Sheet.
 * 2. Otomatis menyimpan foto bukti screenshot Story IG ke folder Google Drive
 *    dan memberikan link foto langsung di baris tabel!
 * 
 * PANDUAN PEMASANGAN (Hanya 2 Menit):
 * 1. Buat Google Sheet baru di Google Drive (beri judul misal: "Jawaban Kuis Detektif Grya").
 * 2. Di menu atas Google Sheet, klik "Extensions" (Ekstensi) > "Apps Script".
 * 3. Hapus seluruh isi default, lalu PASTE SEMUA kode di bawah ini.
 * 4. Klik ikon Disket (Save / Ctrl+S).
 * 5. Klik tombol biru "Deploy" (Terapkan) di kanan atas > "New deployment" (Penerapan baru).
 * 6. Klik ikon gerigi (Select type) > Pilih "Web app".
 * 7. Pengaturan:
 *    - Description: "Webhook Detektif Grya"
 *    - Execute as: "Me" (Saya / akun Google Anda)
 *    - Who has access: "Anyone" (Siapa saja)  <-- SANGAT PENTING!
 * 8. Klik "Deploy" > "Authorize Access" (Beri izin akun Google Anda).
 * 9. Salin "Web app URL" (yang berakhiran /exec).
 * 10. Berikan URL tersebut ke asisten AI atau masukkan ke menu admin di web kuis!
 * =========================================================================
 */

function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = [
    "Waktu Submit", 
    "ID Tiket", 
    "Nama Lengkap", 
    "NIP", 
    "Unit Organisasi", 
    "Unit Kerja", 
    "Nomor WhatsApp",
    "Akun Instagram",
    "Link Bukti Story IG (Google Drive)",
    "Kode Jawaban", 
    "Status"
  ];
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight("bold");
    range.setBackground("#1e293b");
    range.setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheet();

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      data = {};
    }

    // 1. Simpan Foto Screenshot Story ke Google Drive (jika ada)
    var storyFileUrl = "Tidak ada foto";
    if (data.storyImageBase64 && data.storyImageBase64.indexOf("base64,") !== -1) {
      try {
        var folderName = "Bukti Story Detektif Grya";
        var folders = DriveApp.getFoldersByName(folderName);
        var folder;
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder(folderName);
        }

        var base64Data = data.storyImageBase64.split("base64,")[1];
        var mimeType = data.storyImageBase64.substring(5, data.storyImageBase64.indexOf(";")) || "image/jpeg";
        var decoded = Utilities.base64Decode(base64Data);
        var cleanName = (data.fullName || "Peserta").replace(/[^a-zA-Z0-9]/g, "_");
        var fileName = (data.ticketId || "GRYA") + "_" + cleanName + ".jpg";
        
        var blob = Utilities.newBlob(decoded, mimeType, fileName);
        var driveFile = folder.createFile(blob);
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        storyFileUrl = driveFile.getUrl();
      } catch (errDrive) {
        storyFileUrl = "Gagal upload Drive: " + errDrive.toString();
      }
    } else if (data.storyFileName) {
      storyFileUrl = "Terlampir (" + data.storyFileName + ")";
    }

    // 2. Baris Data untuk Google Sheet
    var row = [
      data.timestamp || new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      data.ticketId || "-",
      data.fullName || "-",
      data.nip || "-",
      data.orgUnit || "-",
      data.workUnit || "-",
      data.whatsapp || "-",
      data.instagram || "-",
      storyFileUrl,
      data.codeAnswer || "-",
      data.status || "BENAR"
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data berhasil dicatat ke arsip detektif!",
      ticketId: data.ticketId,
      storyUrl: storyFileUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "Detektif Grya Google Sheets Webhook Ready"
  })).setMimeType(ContentService.MimeType.JSON);
}
