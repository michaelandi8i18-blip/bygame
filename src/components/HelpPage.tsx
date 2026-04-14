'use client';

import { useState, useMemo } from 'react';
import { X, Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Gamepad2, Gift, Star, ShieldCheck, CreditCard, Clock, User, LogIn, History, Wallet, Smartphone } from 'lucide-react';

interface HelpPageProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  emoji: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'topup',
    title: 'Top Up & Pembelian',
    icon: <Gamepad2 className="w-5 h-5" />,
    emoji: '🎮',
    items: [
      {
        question: 'Bagaimana cara melakukan top up game di BYgame?',
        answer: 'Caranya sangat mudah! Pertama, pilih game yang ingin kamu top up dari daftar game yang tersedia di halaman utama. Klik tombol "Top Up" pada card game, lalu pilih paket/item yang diinginkan. Masukkan ID Game dan ID Server kamu, pilih metode pembayaran, lalu klik "Bayar Sekarang". Pembelian akan diproses secara otomatis dan item akan dikirim ke akun game kamu dalam hitungan detik.',
      },
      {
        question: 'Game apa saja yang tersedia di BYgame?',
        answer: 'BYgame menyediakan top up untuk lebih dari 50 game populer dari berbagai kategori. Untuk game Mobile, tersedia Mobile Legends, PUBG Mobile, Genshin Impact, Free Fire, Honor of Kings, Call of Duty Mobile, dan masih banyak lagi. Untuk game PC, tersedia Valorant, Genshin Impact PC, League of Legends, dan lain-lain. Kamu bisa menggunakan fitur pencarian atau filter kategori untuk menemukan game yang kamu cari.',
      },
      {
        question: 'Metode pembayaran apa saja yang didukung?',
        answer: 'BYgame mendukung berbagai metode pembayaran populer di Indonesia, termasuk GoPay, OVO, DANA, ShopeePay, LinkAja, transfer bank (BCA, BRI, Mandiri, BNI), kartu kredit/debit, dan minimarket (Indomaret, Alfamart). Semua transaksi diproses secara aman dan terenkripsi.',
      },
      {
        question: 'Berapa lama proses top up dikirim ke akun game saya?',
        answer: 'Proses top up di BYgame sangat cepat! Setelah pembayaran berhasil dikonfirmasi, item akan otomatis dikirim ke akun game kamu. Biasanya proses ini memakan waktu kurang dari 1-5 menit. Status pembelian bisa kamu pantau melalui halaman Riwayat Pembelian. Jika dalam 30 menit item belum masuk, silakan hubungi admin melalui fitur Pesan.',
      },
      {
        question: 'Apa yang harus dilakukan jika top up gagal atau item tidak masuk?',
        answer: 'Jika top up gagal, pertama periksa status pembelian di halaman Riwayat Pembelian. Jika status "Pending", tunggu beberapa saat karena sistem sedang memproses. Jika status "Gagal", pastikan ID Game dan ID Server yang kamu masukkan sudah benar. Jika item tetap tidak masuk setelah 30 menit dengan status "Berhasil", hubungi admin melalui fitur Pesan dengan menyertakan ID Pembelian untuk ditindaklanjuti.',
      },
      {
        question: 'Apakah bisa top up untuk akun game orang lain?',
        answer: 'Ya, kamu bisa top up untuk akun game siapa saja! Yang penting adalah memasukkan ID Game dan ID Server yang benar dari akun yang ingin kamu top up. Pastikan ID yang dimasukkan akurat agar item tidak salah dikirim. BYgame tidak bertanggung jawab jika item dikirim ke ID yang salah karena kesalahan penginputan.',
      },
      {
        question: 'Apakah ada batasan jumlah top up per hari?',
        answer: 'Tidak ada batasan jumlah top up per hari di BYgame. Kamu bisa melakukan top up sebanyak yang kamu butuhkan. Namun, untuk pembelian dalam jumlah besar (di atas Rp 1.000.000), sistem mungkin memerlukan verifikasi tambahan demi keamanan transaksi.',
      },
    ],
  },
  {
    id: 'akun',
    title: 'Akun & Login',
    icon: <User className="w-5 h-5" />,
    emoji: '👤',
    items: [
      {
        question: 'Bagaimana cara mendaftar akun di BYgame?',
        answer: 'Klik tombol "Masuk" di pojok kanan atas header, lalu pilih tab "Daftar". Isi formulir pendaftaran dengan nama lengkap, alamat email aktif, dan password minimal 3 karakter. Klik "Daftar" dan akunmu langsung aktif. Data akun akan tersimpan dengan aman di sistem BYgame.',
      },
      {
        question: 'Saya lupa password, bagaimana cara mengatasinya?',
        answer: 'Saat ini BYgame belum menyediakan fitur reset password otomatis. Jika kamu lupa password, silakan hubungi admin melalui fitur Pesan dengan menyertakan email yang terdaftar. Tim admin akan membantu proses reset password secara manual setelah verifikasi data diri.',
      },
      {
        question: 'Apakah data saya aman di BYgame?',
        answer: 'Keamanan data pengguna adalah prioritas utama BYgame. Semua data akun termasuk email dan password dienkripsi dan disimpan secara lokal di browser kamu (localStorage). Kami tidak menyimpan data sensitif di server pihak ketiga. Namun, disarankan untuk tidak menggunakan password yang sama dengan akun penting lainnya dan selalu logout setelah selesai menggunakan BYgame, terutama saat menggunakan perangkat bersama.',
      },
      {
        question: 'Bisakah saya mengubah nama atau email yang sudah terdaftar?',
        answer: 'Saat ini fitur edit profil belum tersedia secara langsung. Jika kamu perlu mengubah nama atau email, silakan hubungi admin melalui fitur Pesan dengan menyertakan data lama dan baru yang diinginkan. Tim admin akan membantu melakukan perubahan setelah verifikasi.',
      },
      {
        question: 'Mengapa data riwayat pembelian dan saldo hilang setelah logout?',
        answer: 'Sejak update terbaru, semua data kamu (riwayat pembelian, saldo bonus, review, pesan, dan permintaan redeem) sudah dipertahankan secara permanen di localStorage browser. Data akan otomatis tersinkronisasi kembali saat kamu login ulang dengan email dan password yang sama. Pastikan kamu menggunakan browser yang sama dan tidak membersihkan data browser.',
      },
      {
        question: 'Bagaimana cara mengakses akun admin?',
        answer: 'Akses admin panel khusus untuk tim BYgame. Untuk login sebagai admin, gunakan email yang mengandung kata "admin" (contoh: admin@bygame.com) dengan password "admin123". Akun admin memiliki akses khusus untuk menyetujui atau menolak permintaan redeem dari pengguna.',
      },
    ],
  },
  {
    id: 'redeem',
    title: 'Redeem & Bonus Saldo',
    icon: <Gift className="w-5 h-5" />,
    emoji: '🎁',
    items: [
      {
        question: 'Apa itu fitur Redeem di BYgame?',
        answer: 'Fitur Redeem memungkinkan kamu menukar saldo bonus dengan item game secara gratis! Setelah melakukan pembelian dan memberikan review, kamu akan mendapatkan saldo bonus Rp 100 per review. Saldo ini bisa diakumulasi dan digunakan untuk redeem item game yang tersedia di menu Redeem di halaman utama.',
      },
      {
        question: 'Bagaimana cara mendapatkan saldo bonus?',
        answer: 'Saldo bonus didapatkan dengan cara memberikan review setelah pembelian berhasil. Setelah pembelian kamu berstatus "Berhasil", pergi ke halaman Riwayat Pembelian, temukan pembelian yang belum di-review, lalu berikan rating bintang 1-5 dan tulis catatan/review. Setiap review yang berhasil dikirim akan menambahkan Rp 100 ke saldo bonus kamu. Semakin banyak pembelian dan review, semakin besar saldo bonus yang bisa kamu kumpulkan!',
      },
      {
        question: 'Berapa saldo bonus yang didapat per review?',
        answer: 'Setiap review yang berhasil dikirim setelah pembelian akan memberikan bonus saldo sebesar Rp 100. Tidak ada batasan jumlah review yang bisa kamu berikan, selama setiap review berkorespondensi dengan pembelian yang berbeda dan belum pernah di-review sebelumnya.',
      },
      {
        question: 'Bagaimana cara melakukan redeem item?',
        answer: 'Klik menu "Redeem" di header atau scroll ke bagian Redeem di halaman utama. Pilih item game yang kamu inginkan, lalu masukkan ID Game dan email yang bisa dihubungi. Pastikan saldo bonus kamu mencukupi harga item. Klik "Redeem Sekarang" untuk mengajukan permintaan. Permintaan akan ditinjau oleh admin dan hasilnya akan dikirimkan melalui fitur Pesan.',
      },
      {
        question: 'Berapa lama proses redeem diproses oleh admin?',
        answer: 'Setelah kamu mengajukan permintaan redeem, admin akan meninjaunya secara manual. Proses ini biasanya memakan waktu 1x24 jam pada hari kerja. Jika permintaan disetujui, item akan dikirim ke akun game kamu dan kamu akan menerima notifikasi melalui fitur Pesan. Jika ditolak, saldo bonus akan dikembalikan ke akun kamu beserta alasan penolakan dari admin.',
      },
      {
        question: 'Apa yang terjadi jika permintaan redeem ditolak?',
        answer: 'Jika permintaan redeem ditolak oleh admin, saldo bonus yang digunakan akan otomatis dikembalikan secara penuh ke akun kamu. Admin akan mengirimkan pesan melalui fitur Pesan yang berisi alasan penolakan. Kamu bisa mencoba mengajukan redeem kembali setelah memperbaiki data yang diperlukan.',
      },
      {
        question: 'Item apa saja yang bisa di-redeem?',
        answer: 'Item yang tersedia di menu Redeem sesuai dengan item-item yang ada di setiap game di BYgame. Misalnya, untuk Mobile Legends tersedia paket Diamond, untuk PUBG Mobile tersedia UC, untuk Genshin Impact tersedia Genesis Crystal, dan seterusnya. Ketersediaan item bisa berubah sewaktu-waktu sesuai kebijakan BYgame.',
      },
    ],
  },
  {
    id: 'review',
    title: 'Review & Testimoni',
    icon: <Star className="w-5 h-5" />,
    emoji: '⭐',
    items: [
      {
        question: 'Bagaimana cara memberikan review setelah pembelian?',
        answer: 'Setelah pembelian kamu berstatus "Berhasil", buka halaman Riwayat Pembelian (klik ikon jam di header). Temukan pembelian yang ingin di-review, lalu klik tombol "Review". Berikan rating bintang 1-5 dan tulis catatan atau pengalaman kamu. Klik "Kirim Review" dan saldo bonus Rp 100 akan otomatis ditambahkan ke akun kamu.',
      },
      {
        question: 'Apakah bisa mengubah atau menghapus review yang sudah dikirim?',
        answer: 'Saat ini fitur edit atau hapus review belum tersedia. Pastikan review yang kamu kirim sudah sesuai sebelum mengirimkan. Jika ada kesalahan atau ingin melaporkan review yang tidak pantas, silakan hubungi admin melalui fitur Pesan.',
      },
      {
        question: 'Review saya muncul di mana?',
        answer: 'Review yang kamu kirim akan muncul di dua tempat: (1) Di halaman Riwayat Pembelian sebagai catatan pribadi kamu, dan (2) Di bagian Testimoni di halaman utama BYgame sebagai referensi bagi pengguna lain. Review anonim tidak didukung — nama dan avatar kamu akan ditampilkan bersama review.',
      },
      {
        question: 'Apakah semua review muncul di bagian Testimoni?',
        answer: 'Ya, semua review dari pembelian yang berhasil akan otomatis ditampilkan di bagian Testimoni di halaman utama. Review ditampilkan secara kronologis (terbaru di atas). Ini membantu pengguna lain untuk melihat pengalaman nyata dari pelanggan BYgame.',
      },
    ],
  },
  {
    id: 'pembayaran',
    title: 'Pembayaran & Transaksi',
    icon: <CreditCard className="w-5 h-5" />,
    emoji: '💳',
    items: [
      {
        question: 'Status pembelian apa saja yang ada di BYgame?',
        answer: 'Ada 4 status pembelian: (1) "Pending" — pembayaran sedang menunggu konfirmasi, (2) "Diproses" — pembayaran berhasil dan item sedang dikirim ke akun game, (3) "Berhasil" — item berhasil dikirim ke akun game kamu, (4) "Gagal" — pembayaran atau pengiriman gagal. Kamu bisa memantau semua status ini di halaman Riwayat Pembelian.',
      },
      {
        question: 'Bagaimana cara mengecek status pembelian saya?',
        answer: 'Klik ikon jam (Riwayat) di header atau akses halaman Riwayat Pembelian. Di sana kamu akan melihat tabel berisi semua pembelian dengan informasi lengkap: ID Pembelian, nama game, item, harga, metode pembayaran, dan status terkini. Status akan diperbarui secara otomatis oleh sistem.',
      },
      {
        question: 'Apakah ada biaya admin atau biaya tambahan?',
        answer: 'BYgame tidak membebankan biaya admin tambahan. Harga yang tertera pada setiap item sudah merupakan harga final. Namun, beberapa metode pembayaran pihak ketiga (seperti e-wallet atau bank) mungkin memiliki biaya transaksi yang ditetapkan oleh provider masing-masing dan bukan dari BYgame.',
      },
      {
        question: 'Bisa minta refund atau pembatalan?',
        answer: 'Pembatalan hanya bisa dilakukan jika status pembelian masih "Pending". Jika item sudah dikirim (status "Berhasil"), pembatalan tidak dapat dilakukan. Untuk permintaan refund khusus, silakan hubungi admin melalui fitur Pesan dengan menyertakan ID Pembelian dan alasan refund. Tim admin akan meninjaunya secara case-by-case.',
      },
    ],
  },
  {
    id: 'pesan',
    title: 'Fitur Pesan',
    icon: <MessageCircle className="w-5 h-5" />,
    emoji: '💬',
    items: [
      {
        question: 'Apa fungsi fitur Pesan di BYgame?',
        answer: 'Fitur Pesan adalah sarana komunikasi antara kamu dan admin BYgame. Melalui fitur ini, kamu akan menerima notifikasi penting seperti: konfirmasi top up berhasil, informasi review dan bonus saldo, hasil persetujuan atau penolakan redeem, serta balasan dari admin atas pertanyaan yang kamu ajukan.',
      },
      {
        question: 'Bagaimana cara menghubungi admin?',
        answer: 'Kamu bisa menghubungi admin melalui fitur Pesan yang bisa diakses dengan mengklik ikon amplop di header. Admin akan membalas pesan kamu sesuai antrian. Untuk pertanyaan mendesak, sertakan ID Pembelian atau detail relevan agar admin bisa memberikan respons yang lebih cepat dan tepat.',
      },
      {
        question: 'Kenapa saya tidak menerima notifikasi?',
        answer: 'Notifikasi di BYgame dikirim melalui fitur Pesan di dalam website, bukan melalui SMS atau email. Pastikan kamu secara berkala mengecek fitur Pesan (ikon amplop di header) untuk melihat pesan baru. Jika ada pesan yang belum dibaca, akan muncul badge merah dengan jumlah pesan yang belum terbaca di ikon amplop.',
      },
    ],
  },
  {
    id: 'keamanan',
    title: 'Keamanan & Privasi',
    icon: <ShieldCheck className="w-5 h-5" />,
    emoji: '🔒',
    items: [
      {
        question: 'Apakah BYgame aman digunakan?',
        answer: 'BYgame mengutamakan keamanan transaksi pengguna. Semua transaksi diproses melalui koneksi yang terenkripsi. Data akun pengguna disimpan secara lokal di browser masing-masing dan tidak dikirim ke server pihak ketiga. Kami juga menerapkan validasi login yang ketat untuk mencegah akses tidak sah ke akun pengguna.',
      },
      {
        question: 'Apakah BYgame membutuhkan password game saya?',
        answer: 'Tidak! BYgame tidak pernah meminta password game kamu. Untuk melakukan top up, kamu hanya perlu memasukkan ID Game dan ID Server. Kami tidak akan pernah meminta password game kamu dalam kondisi apapun. Jika ada pihak yang mengatasnamakan BYgame dan meminta password game, segera laporkan melalui fitur Pesan.',
      },
      {
        question: 'Bagaimana jika saya menggunakan perangkat publik?',
        answer: 'Jika menggunakan perangkat publik (warnet, komputer kantor, dll), selalu pastikan untuk logout setelah selesai menggunakan BYgame. Klik tombol logout di header untuk mengakhiri sesi. Jangan centang opsi "Ingat Saya" jika tersedia. Data lokal di browser publik mungkin bisa diakses oleh orang lain, jadi selalu waspada.',
      },
    ],
  },
  {
    id: 'umum',
    title: 'Pertanyaan Umum',
    icon: <HelpCircle className="w-5 h-5" />,
    emoji: '❓',
    items: [
      {
        question: 'Apa itu BYgame?',
        answer: 'BYgame adalah platform top up game online terpercaya di Indonesia. Kami menyediakan layanan top up untuk berbagai game populer dengan harga kompetitif, proses cepat, dan berbagai metode pembayaran. BYgame juga memiliki fitur unik seperti bonus saldo dari review, redeem item gratis, dan sistem pesan terintegrasi antara pengguna dan admin.',
      },
      {
        question: 'Apakah BYgame tersedia dalam bentuk aplikasi?',
        answer: 'Saat ini BYgame hanya tersedia dalam bentuk website yang bisa diakses melalui browser di mana saja (desktop, tablet, maupun smartphone). Website BYgame sudah responsif dan dioptimalkan untuk semua ukuran layar. Rencana pengembangan aplikasi mobile sedang dalam tahap pertimbangan untuk masa depan.',
      },
      {
        question: 'Apakah BYgame buka 24 jam?',
        answer: 'Website BYgame bisa diakses 24 jam sehari, 7 hari seminggu. Kamu bisa melakukan top up kapan saja tanpa batasan waktu. Namun, untuk layanan admin (persetujuan redeem, balasan pesan, dll), jam operasional adalah pukul 08:00 - 22:00 WIB pada hari kerja. Pesan di luar jam operasional akan ditanggap pada hari kerja berikutnya.',
      },
      {
        question: 'Bagaimana cara melaporkan bug atau masalah teknis?',
        answer: 'Jika kamu menemukan bug atau masalah teknis di website BYgame, silakan hubungi admin melalui fitur Pesan. Jelaskan masalah yang kamu temui, langkah-langkah yang menyebabkan masalah tersebut, dan sertakan screenshot jika memungkinkan. Tim teknis kami akan segera menindaklanjuti laporan kamu.',
      },
      {
        question: 'Apakah ada program referral atau promo khusus?',
        answer: 'Program referral saat ini sedang dalam pengembangan. Namun, BYgame secara berkala mengadakan promo spesial yang bisa kamu ikuti. Pastikan selalu cek website BYgame untuk info promo terbaru. Selain itu, jangan lupa manfaatkan fitur bonus saldo dari review yang bisa kamu kumpulkan untuk redeem item game gratis!',
      },
      {
        question: 'Saya ingin menjadi mitra atau reseller BYgame, bagaimana caranya?',
        answer: 'Program mitra dan reseller BYgame sedang dalam tahap perencanaan. Jika kamu tertarik, silakan hubungi admin melalui fitur Pesan dengan subject "Mitra BYgame". Tim kami akan menghubungi kamu ketika program ini sudah resmi diluncurkan. Nantikan info selengkapnya!',
      },
    ],
  },
];

export default function HelpPage({ isOpen, onClose }: HelpPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter FAQ based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return faqCategories;

    const query = searchQuery.toLowerCase();
    const result: FAQCategory[] = [];

    faqCategories.forEach((category) => {
      const matchingItems = category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
      if (matchingItems.length > 0) {
        result.push({ ...category, items: matchingItems });
      }
    });

    return result;
  }, [searchQuery]);

  const categoriesToShow = activeCategory
    ? filteredCategories.filter((c) => c.id === activeCategory)
    : filteredCategories;

  const totalFAQs = faqCategories.reduce((sum, c) => sum + c.items.length, 0);
  const totalResults = categoriesToShow.reduce((sum, c) => sum + c.items.length, 0);

  const toggleFAQ = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFF1F5] overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-full text-pink-600 hover:bg-pink-50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-pink-800">Pusat Bantuan</h1>
                  <p className="text-[10px] text-pink-400 font-medium -mt-0.5">
                    {totalFAQs} FAQ dari 8 kategori
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* Hero */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-3 block">🤝</span>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 mb-2">
            Ada yang bisa kami bantu?
          </h2>
          <p className="text-pink-500 text-sm sm:text-base font-medium max-w-md mx-auto">
            Temukan jawaban dari pertanyaan yang sering diajukan seputar BYgame
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="flex items-center gap-3 bg-white rounded-2xl border-2 border-pink-200 px-4 py-3.5 shadow-sm focus-within:border-pink-400 focus-within:shadow-md focus-within:shadow-pink-200/30 transition-all duration-200">
            <Search className="w-5 h-5 text-pink-300 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan..."
              className="flex-1 text-pink-900 placeholder:text-pink-300 outline-none bg-transparent font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory(null); }}
                className="px-3 py-1 rounded-full bg-pink-100 text-pink-500 text-xs font-bold hover:bg-pink-200 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-pink-400 mt-2 font-medium">
              {totalResults} hasil ditemukan untuk &quot;{searchQuery}&quot;
            </p>
          )}
        </div>

        {/* Quick category pills */}
        {!searchQuery && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  !activeCategory
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-300/30'
                    : 'bg-white text-pink-600 border border-pink-200 hover:bg-pink-50'
                }`}
              >
                🏠 Semua
              </button>
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-300/30'
                      : 'bg-white text-pink-600 border border-pink-200 hover:bg-pink-50'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQ sections */}
        <div className="space-y-6">
          {categoriesToShow.length === 0 && (
            <div className="text-center py-16">
              <span className="text-4xl mb-3 block">🔍</span>
              <p className="text-pink-400 font-semibold">Tidak ada hasil ditemukan</p>
              <p className="text-pink-300 text-sm mt-1">Coba gunakan kata kunci yang berbeda</p>
            </div>
          )}

          {categoriesToShow.map((category) => (
            <div key={category.id}>
              {/* Category header */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center text-pink-500">
                  {category.icon}
                </div>
                <h3 className="text-base font-extrabold text-pink-800">
                  {category.emoji} {category.title}
                </h3>
                <span className="text-[10px] font-bold text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full">
                  {category.items.length}
                </span>
              </div>

              {/* FAQ items */}
              <div className="space-y-2">
                {category.items.map((item, idx) => {
                  const faqId = `${category.id}-${idx}`;
                  const isExpanded = expandedId === faqId;

                  return (
                    <div
                      key={faqId}
                      className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-200"
                    >
                      <button
                        onClick={() => toggleFAQ(faqId)}
                        className="w-full flex items-start gap-3 px-4 py-3.5 text-left"
                      >
                        <span className={`mt-0.5 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                          isExpanded
                            ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white'
                            : 'bg-pink-50 text-pink-400'
                        }`}>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold transition-colors duration-200 ${
                            isExpanded ? 'text-pink-600' : 'text-pink-800'
                          }`}>
                            {item.question}
                          </p>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="ml-9 pl-3 border-l-2 border-pink-100">
                            <p className="text-sm text-pink-600/80 leading-relaxed font-medium">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-3xl border-2 border-dashed border-pink-200 p-6 sm:p-8">
            <span className="text-3xl mb-2 block">💬</span>
            <h3 className="text-lg font-extrabold text-pink-800 mb-1">
              Masih belum menemukan jawaban?
            </h3>
            <p className="text-pink-400 text-sm font-medium mb-4 max-w-sm mx-auto">
              Hubungi admin BYgame melalui fitur Pesan untuk bantuan lebih lanjut
            </p>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm rounded-full hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all shadow-md shadow-pink-300/30"
            >
              <MessageCircle className="w-4 h-4" />
              Hubungi Admin
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
