// ══════════════════════════════════════════════════════════════
// BACKEND: Google Apps Script (GAS) — Sanggar Tari Surabaya
// ══════════════════════════════════════════════════════════════
// CARA PAKAI:
// 1. Buka https://script.google.com → New Project
// 2. Paste SELURUH kode ini
// 3. Ganti SPREADSHEET_ID di bawah dengan ID Google Sheet kamu
// 4. Deploy → New Deployment → Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy URL deployment → paste ke GAS_URL di index.html
// ══════════════════════════════════════════════════════════════

const SPREADSHEET_ID = "157ZMGhbOkFKfNZGzkXCIIGAogBDEeAEV7s1q8LvQEvs";
const SHEET_NAME = "sanggar"; // nama tab sheet di Google Sheets
const INFO_SHEET_NAME = "InfoBudaya"; // nama tab sheet info budaya

// ══════════════════════════════════════════════════════════════
// HANDLER UTAMA — dipanggil saat ada request GET
// ══════════════════════════════════════════════════════════════
function doGet(e) {
  const action = e.parameter.action || "getAll";
  const id     = e.parameter.id    || null;
  const q      = e.parameter.q     || null;
  const cat    = e.parameter.category || null;
  let result;

  try {
    switch (action) {
      case "getAll":         result = getAllPlaces(q, cat); break;
      case "getById":        result = getById(id);          break;
      case "getCategories":  result = getCategories();      break;
      case "getInfo":        result = getInfo(q, cat);      break;
      default:               result = error("Action tidak dikenal: " + action);
    }
  } catch (err) {
    result = error(err.toString());
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ══════════════════════════════════════════════════════════════
// HANDLER POST — untuk tambah data (opsional/admin)
// ══════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || "addPlace";

    let result;
    if (action === "addPlace") {
      result = addPlace(body.data);
    } else {
      result = error("Action tidak dikenal");
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify(error(err.toString())))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ══════════════════════════════════════════════════════════════
// FUNGSI: Ambil semua data (dengan filter opsional)
// Endpoint: ?action=getAll
//           ?action=getAll&q=sekar        (search keyword)
//           ?action=getAll&category=studio (filter kategori)
// ══════════════════════════════════════════════════════════════
function getAllPlaces(q, category) {
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();
  const headers = rows[0].map(h => h.toString().toLowerCase().trim());

  let places = rows.slice(1).map((row, index) => rowToObject(row, headers, index + 2));

  // Filter keyword pencarian
  if (q) {
    const keyword = q.toLowerCase();
    places = places.filter(p =>
      (p.nama   || "").toLowerCase().includes(keyword) ||
      (p.alamat || "").toLowerCase().includes(keyword) ||
      (p.deskripsi || "").toLowerCase().includes(keyword)
    );
  }

  // Filter kategori
  if (category && category !== "Semua") {
    places = places.filter(p => getCategory(p.nama) === category);
  }

  return {
    status: "ok",
    total: places.length,
    data: places
  };
}

// ══════════════════════════════════════════════════════════════
// FUNGSI: Ambil detail 1 tempat berdasarkan ID
// Endpoint: ?action=getById&id=1
// ══════════════════════════════════════════════════════════════
function getById(id) {
  if (!id) return error("Parameter 'id' wajib diisi");

  const sheet   = getSheet();
  const rows    = sheet.getDataRange().getValues();
  const headers = rows[0].map(h => h.toString().toLowerCase().trim());

  const row = rows.slice(1).find((r, i) => String(i + 1) === String(id) || String(r[headers.indexOf("id")]) === String(id));

  if (!row) return error("Data dengan ID " + id + " tidak ditemukan");

  return {
    status: "ok",
    data: rowToObject(row, headers, id)
  };
}

// ══════════════════════════════════════════════════════════════
// FUNGSI: Ambil daftar kategori unik
// Endpoint: ?action=getCategories
// ══════════════════════════════════════════════════════════════
function getCategories() {
  const sheet   = getSheet();
  const rows    = sheet.getDataRange().getValues();
  const headers = rows[0].map(h => h.toString().toLowerCase().trim());
  const namaIdx = headers.indexOf("nama");

  const cats = new Set(["Semua"]);
  rows.slice(1).forEach(row => {
    cats.add(getCategory(row[namaIdx] || ""));
  });

  return {
    status: "ok",
    data: Array.from(cats)
  };
}

// ══════════════════════════════════════════════════════════════
// FUNGSI: Ambil data Info Budaya (Pagelaran/Festival/Workshop/Event)
// Endpoint: ?action=getInfo
//           ?action=getInfo&q=tari              (search keyword)
//           ?action=getInfo&category=Pagelaran  (filter kategori)
// ══════════════════════════════════════════════════════════════
function getInfo(q, category) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(INFO_SHEET_NAME);

  if (!sheet) return error("Sheet '" + INFO_SHEET_NAME + "' tidak ditemukan");

  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return { status: "ok", total: 0, data: [] };

  const headers = rows[0].map(h => h.toString().toLowerCase().trim());

  let data = rows.slice(1)
    .filter(row => row[0] !== "" && row[0] !== null)
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        let val = row[i];
        if (val === null || val === undefined) val = "";
        obj[h] = val.toString().trim();
      });
      return obj;
    });

  if (q) {
    const keyword = q.toLowerCase();
    data = data.filter(d =>
      (d.judul || "").toLowerCase().includes(keyword) ||
      (d.lokasi || "").toLowerCase().includes(keyword) ||
      (d.deskripsi || "").toLowerCase().includes(keyword) ||
      (d.penyelenggara || "").toLowerCase().includes(keyword)
    );
  }

  if (category && category !== "Semua") {
    data = data.filter(d => d.kategori === category);
  }

  return {
    status: "ok",
    total: data.length,
    data: data
  };
}

// ══════════════════════════════════════════════════════════════
// FUNGSI: Tambah data tempat baru (admin)
// Dipanggil via POST dengan body JSON
// ══════════════════════════════════════════════════════════════
function addPlace(data) {
  if (!data) return error("Data tidak boleh kosong");
  if (!data.nama) return error("Field 'nama' wajib diisi");
  if (!data.latitude || !data.longitude) return error("Koordinat wajib diisi");

  const sheet   = getSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => h.toString().toLowerCase().trim());
  const lastRow = sheet.getLastRow();

  const newRow = headers.map(h => data[h] || "");
  sheet.appendRow(newRow);

  return {
    status: "ok",
    message: "Data berhasil ditambahkan",
    row: lastRow + 1
  };
}

// ══════════════════════════════════════════════════════════════
// HELPER: Convert baris sheet → objek JSON
// ══════════════════════════════════════════════════════════════
function rowToObject(row, headers, rowIndex) {
  const obj = { id: rowIndex };
  headers.forEach((h, i) => {
    let val = row[i];
    if (val === null || val === undefined) val = "";

    if (h === "latitude" || h === "longitude") {
      // Perbaikan parsing koordinat
      if (typeof val === "string") val = val.replace(/[^0-9.-]/g, "");
      val = parseFloat(val);
      if (isNaN(val)) val = null;
    } else {
      val = val.toString().trim();
    }
    obj[h] = val;
  });
  return obj;
}

// ══════════════════════════════════════════════════════════════
// HELPER: Kategorisasi otomatis dari nama
// ══════════════════════════════════════════════════════════════
function getCategory(nama) {
  const n = (nama || "").toLowerCase();
  if (n.includes("akademi") || n.includes("academy")) return "Akademi";
  if (n.includes("studio"))                             return "Studio";
  if (n.includes("sekolah") || n.includes("school"))   return "Sekolah";
  if (n.includes("sanggar"))                            return "Sanggar Tari";
  return "Lainnya";
}

// ══════════════════════════════════════════════════════════════
// HELPER: Akses sheet utama (sanggar)
// ══════════════════════════════════════════════════════════════
function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(SHEET_NAME);
}

// ══════════════════════════════════════════════════════════════
// HELPER: Format error response
// ══════════════════════════════════════════════════════════════
function error(msg) {
  return { status: "error", message: msg };
}

// ══════════════════════════════════════════════════════════════
// TEST FUNCTION — jalankan ini di GAS Editor untuk cek koneksi
// Klik tombol ▷ (Run) dengan fungsi ini dipilih
// ══════════════════════════════════════════════════════════════
function testGetAll() {
  const result = getAllPlaces(null, null);
  Logger.log(JSON.stringify(result));
}

function testGetById() {
  const result = getById(1);
  Logger.log(JSON.stringify(result));
}

function testGetInfo() {
  const result = getInfo(null, null);
  Logger.log(JSON.stringify(result));
}