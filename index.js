const { Client, LocalAuth } = require("whatsapp-web.js");

// ================= CONFIG =================
const ADMIN = "6287756266682@c.us"; // ganti dengan nomor adminmu
const EXCLUDED_NUMBERS = [
  ADMIN,
  "6285179911407@c.us", // contoh
  "6289876543210@c.us"  // contoh
];

let IZIN_TELEPON = []; // daftar nomor yang diizinkan telepon
let userState = {};   // simpan state menu per user

// ================= MENU =================
const menuUtama = `
📌 MENU UTAMA
1️⃣ TOP UP
2️⃣ PESAN PRIBADI
0️⃣ MENU
`;

const menuTopUp = `
💰 TOP UP
1. 150
2. 200
3. 300
4. 500
5. 1/2
6. 1
0. Kembali
`;

const menuPesanPribadi = `
✉ PESAN PRIBADI
1. Bon
2. Gadai
3. HP
4. Barang Lain
5. Telepon Admin
0. Kembali
`;

// ================= CLIENT =================
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./.wwebjs_auth" // session disimpan, aman dengan Railway volume
  }),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// QR Code muncul di Railway log
client.on("qr", (qr) => {
  const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`;
  console.log("🔑 Scan QR lewat link ini (buka di browser):");
  console.log(qrLink);
});

// Bot siap
client.on("ready", () => {
  console.log("✅ Bot WhatsApp aktif!");
  setTimeout(() => {
    client.sendMessage(ADMIN, "✅ Bot sudah online dan siap dipakai.");
  }, 5000); // kasih delay biar tidak error getChat
});

// ================= HANDLER CHAT =================
client.on("message", async (msg) => {
  const chat = msg.body.trim().toLowerCase();
  const from = msg.from;

  // 🚫 Skip jika nomor ada di excluded
  if (EXCLUDED_NUMBERS.includes(from)) {
    console.log("Chat dilewati dari:", from);
    return;
  }

  // Kalau pertama kali chat → langsung tampil menu
  if (!userState[from]) {
    userState[from] = "menu";
    return msg.reply(menuUtama);
  }

  // --- MENU UTAMA ---
  if (chat === "0" || chat === "menu") {
    userState[from] = "menu";
    return msg.reply(menuUtama);
  }

  // --- PILIH MENU UTAMA ---
  if (chat === "1" && userState[from] === "menu") {
    userState[from] = "topup";
    return msg.reply(menuTopUp);
  }
  if (chat === "2" && userState[from] === "menu") {
    userState[from] = "pesan";
    return msg.reply(menuPesanPribadi);
  }

  // --- SUB MENU TOP UP ---
  if (userState[from] === "topup") {
    if (["1","2","3","4","5","6"].includes(chat)) {
      const nominal = ["150","200","300","500","1/2","1"][parseInt(chat)-1];
      userState[from] = "menu";
      return msg.reply(`✅ TOP UP ${nominal} diproses. Terima kasih!\n\n${menuUtama}`);
    }
    if (chat === "0") {
      userState[from] = "menu";
      return msg.reply(menuUtama);
    }
    return msg.reply("❌ Pilihan tidak valid.\n\n" + menuTopUp);
  }

  // --- SUB MENU PESAN PRIBADI ---
  if (userState[from] === "pesan") {
    if (chat === "1") {
      userState[from] = "menu";
      return msg.reply("📌 Bon dicatat.\n\n" + menuUtama);
    }
    if (chat === "2") {
      userState[from] = "menu";
      return msg.reply("📌 Gadai dicatat.\n\n" + menuUtama);
    }
    if (chat === "3") {
      userState[from] = "menu";
      return msg.reply("📌 HP dicatat.\n\n" + menuUtama);
    }
    if (chat === "4") {
      userState[from] = "menu";
      return msg.reply("📌 Barang lain dicatat.\n\n" + menuUtama);
    }
    if (chat === "5") {
      client.sendMessage(ADMIN, `📞 User ${from} minta izin telepon.`);
      userState[from] = "menu";
      return msg.reply("📞 Permintaan telepon admin dikirim.\n\n" + menuUtama);
    }
    if (chat === "0") {
      userState[from] = "menu";
      return msg.reply(menuUtama);
    }
    return msg.reply("❌ Pilihan tidak valid.\n\n" + menuPesanPribadi);
  }

});

// ================= HANDLER PANGGILAN =================
client.on("call", async (call) => {
  if (EXCLUDED_NUMBERS.includes(call.from)) {
    console.log("Panggilan dilewati (dikecualikan):", call.from);
    return;
  }

  if (!IZIN_TELEPON.includes(call.from)) {
    await call.reject();
    client.sendMessage(
      call.from,
      "❌ Maaf, panggilan ke admin tidak diizinkan.\nKetik 2 > 5 untuk minta izin telepon."
    );
    console.log("Panggilan ditolak dari:", call.from);
  } else {
    console.log("Panggilan diizinkan dari:", call.from);
  }
});

// Jalankan bot
client.initialize();
