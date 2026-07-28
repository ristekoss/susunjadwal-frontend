// Each entry has a `question` and an `answer` array of "blocks"
// A block is either { type: "text", value: string } or
// { type: "list", ordered: boolean, items: string[] }
// This 2 ensure multi-line / numbered formatting consistent braysskut

export const FAQ_LIST = [
  {
    id: 1,
    question: "Gimana cara bikin jadwal?",
    answer: [
      {
        type: "list",
        ordered: true,
        items: [
          "1. Pilih Buat Jadwal",
          "2. Pilih fakultas dan kelas kamu",
          "3. Pilih mata kuliah yang ingin diambil",
          "4. Klik buat jadwal dan tunggu hasilnya",
        ],
      },
      {
        type: "text",
        value:
          "✨ Sistem akan memberikan hasil jadwal yang tersedia dan memberi tahu kalau ada jadwal yang bentrok.",
      },
    ],
  },
  {
    id: 2,
    question: "Mau ubah jadwal yang sudah dibuat?",
    answer: [
      {
        type: "text",
        value:
          "Masuk ke Daftar Jadwal, pilih jadwal yang ingin diubah, lalu klik edit dan tambahkan atau hapus mata kuliah sesuai keinginan.",
      },
    ],
  },
  {
    id: 3,
    question: "Gimana cara lihat jadwal yang sudah dibuat?",
    answer: [
      {
        type: "text",
        value:
          "Buka menu Daftar Jadwal untuk melihat jadwal kamu dalam tampilan mingguan.",
      },
    ],
  },
  {
    id: 4,
    question: "Mau masukin jadwal ke Google Calendar?",
    answer: [
      {
        type: "text",
        value:
          "Pilih menu integrasi Google Calendar, lalu ikuti langkah yang tersedia untuk menyinkronkan jadwal kamu.",
      },
    ],
  },
  {
    id: 5,
    question: "Kenapa mata kuliah belum muncul/tidak ada?",
    answer: [
      {
        type: "list",
        ordered: true,
        items: [
          "1. Pastikan kamu sudah memperbarui mata kuliah melalui halaman Update Matkul terlebih dahulu.",
          "2. Fitur Update Matkul akan memperbarui data mata kuliah dan jadwal sesuai dengan data terbaru dari SIAK-NG.",
        ],
      },
    ],
  },
  {
    id: 6,
    question: "Gimana cara membagikan jadwal?",
    answer: [
      {
        type: "list",
        ordered: true,
        items: [
          "1. Buka Daftar Jadwal yang ingin dibagikan",
          "2. Klik ikon Share",
          "3. Salin link jadwal dan kirim ke teman",
        ],
      },
    ],
  },
  {
    id: 7,
    question: "Gimana cara membandingkan jadwal dengan teman?",
    answer: [
      {
        type: "list",
        ordered: true,
        items: [
          "1. Gunakan fitur Bandingkan Jadwal untuk melihat kesamaan dan perbedaan jadwal kamu dengan teman.",
          "2. Minta teman membagikan link jadwalnya",
          "3. Masukkan link tersebut ke fitur Bandingkan Jadwal",
          "4. Sistem akan menampilkan perbandingan jadwal untuk membantu melihat waktu yang cocok",
        ],
      },
      {
        type: "text",
        value:
          "✨ Cocok digunakan untuk mencari jadwal yang sama atau menghindari bentrok saat ingin hangout.",
      },
    ],
  },
];
