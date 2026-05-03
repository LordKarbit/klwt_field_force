# KLWT Survey Operations & Questionnaire Guide
## Field Survey SOP, Question Bank, Conversational Intelligence Hints, Role Workflow, and Survey Output Data

**Document Version:** v1.0  
**Document Type:** Survey Operations & Intelligence Guide  
**Prepared For:** KLWT Cooling Parts Market Blitz Campaign  
**Market:** Indonesia Automotive Aftermarket  
**Campaign Type:** Fast Coverage Merchant Survey & Cooling Supplier Penetration Mapping  
**Primary Users:** Head, Manager, Surveyor, Verificator, Administrator  
**Default Language:** Bahasa Indonesia  
**Supported App Languages:** Bahasa Indonesia, English, Chinese  
**Prepared Date:** 2026-04-29  

---

# 1. Tujuan Dokumen

Dokumen ini menjelaskan bagaimana survey lapangan KLWT dilakukan, pertanyaan apa saja yang ditanyakan, alasan bisnis di balik setiap pertanyaan, contoh kalimat conversational intelligence untuk membantu Surveyor mendapatkan jawaban, proses kerja setiap role, dan data akhir apa saja yang dihasilkan dari survey.

Dokumen ini bukan hanya daftar pertanyaan survey. Dokumen ini berfungsi sebagai:

1. **SOP Surveyor** saat melakukan visit toko.
2. **Panduan Manager** untuk memahami hasil dan kualitas survey.
3. **Panduan Verificator** untuk memeriksa validitas data.
4. **Panduan Head dan Client** untuk memahami output intelligence.
5. **Acuan Product & Development Team** untuk membuat form, validation rule, scoring, dashboard, dan export.

---

# 2. Konteks Campaign

KLWT adalah supplier aftermarket cooling parts asal China yang ingin masuk ke pasar Indonesia sebagai **challenger supplier**. KLWT bukan brand OEM premium yang sudah dikenal luas, tetapi ingin menawarkan alternatif supplier dengan:

- Harga lebih kompetitif.
- Margin toko lebih menarik.
- SKU cooling lebih luas.
- Peluang menjadi supplier alternatif untuk toko yang tidak puas dengan supplier existing.

Campaign ini adalah **fast coverage market blitz**, bukan audit toko mendalam. Targetnya adalah mendapatkan coverage luas dan data yang cukup actionable untuk follow-up KLWT.

Target operasional:

| Item | Target |
|---|---:|
| Total toko | 5.000 toko |
| Durasi campaign | 1 bulan |
| Estimasi hari kerja | 25 hari |
| Target per hari nasional | ±200 toko |
| Jumlah Surveyor | 16 Surveyor |
| Target per Surveyor per hari | ±13 toko |
| Estimasi durasi survey per toko | 10–20 menit |

Karena itu, survey harus memenuhi prinsip:

```text
Cepat, ringkas, tap-based, tetap menghasilkan merchant intelligence yang bisa dipakai untuk scoring dan follow-up.
```

---

# 3. Prinsip Survey Lapangan

## 3.1 Prinsip Utama

Survey KLWT harus mengikuti prinsip berikut:

1. **Friendly first, survey second**  
   Surveyor harus membangun hubungan singkat terlebih dahulu sebelum bertanya.

2. **Tidak terdengar seperti audit**  
   Pertanyaan harus disampaikan natural, bukan seperti pemeriksaan toko.

3. **Tidak memaksa jawaban sensitif**  
   Data seperti omzet, margin, nilai pembelian, dan nama supplier boleh ditanyakan, tetapi tidak boleh dipaksa.

4. **Foto sebagai evidence, bukan inspeksi**  
   Foto digunakan untuk validasi data, bukan untuk menghakimi toko.

5. **Jawaban diprioritaskan dalam bentuk pilihan tap**  
   Surveyor hanya mengetik jika diperlukan, seperti nama toko, alamat detail, supplier name, dan catatan.

6. **Data valid lebih penting daripada data banyak**  
   Karena ada insentif, KPI harus mengutamakan verified valid visit, bukan hanya jumlah submit.

---

# 4. Etika dan Opening Script Surveyor

## 4.1 Opening Script Utama

Surveyor dapat menggunakan kalimat pembuka berikut:

> “Selamat pagi/siang Pak/Bu, saya sedang melakukan pendataan toko sparepart dan bengkel yang menjual atau menangani sparepart cooling seperti radiator, condenser, kipas, water pump, dan selang radiator. Datanya untuk pemetaan supplier dan kebutuhan produk cooling di area ini. Waktunya sekitar 10 menit saja. Boleh saya tanya beberapa hal singkat?”

## 4.2 Jika Ditanya Ini untuk Apa?

> “Tujuannya untuk memahami kebutuhan toko terhadap produk cooling dan melihat peluang supply barang yang lebih lengkap dan kompetitif. Ini bukan pemeriksaan atau audit toko.”

## 4.3 Jika Toko Khawatir Data Disalahgunakan

> “Data ini hanya digunakan untuk pemetaan kebutuhan produk dan peluang penawaran supplier. Pertanyaannya umum seputar kategori toko, produk cooling yang dijual, dan kebutuhan supplier.”

## 4.4 Jika Toko Menolak Survey

> “Baik Pak/Bu, tidak masalah. Saya catat sebagai belum bersedia diwawancarai. Terima kasih waktunya.”

Surveyor kemudian memilih status visit **Refused** dan mengisi alasan singkat.

---

# 5. Alur Survey dari Awal Sampai Submit

## 5.1 Flow Utama Surveyor

```text
Login
↓
Pilih bahasa di login page jika diperlukan
↓
Masuk Today Plan / Add New Store
↓
Start Visit
↓
GPS auto capture
↓
Input identitas toko dan alamat
↓
Upload foto evidence
↓
Isi pertanyaan survey tap-based
↓
Review ringkasan jawaban
↓
Submit
↓
Sistem hitung score
↓
Surveyor melihat score setelah submit
↓
Data masuk Submitted / Waiting Verification
```

## 5.2 Planned Visit

Planned visit adalah toko yang sudah diassign oleh Manager. Toko bisa berasal dari input manual Manager atau bulk import.

Surveyor hanya perlu membuka daftar Today Plan, memilih toko, lalu mulai survey.

## 5.3 Unplanned Visit

Unplanned visit adalah toko yang ditemukan sendiri oleh Surveyor di lapangan.

Karena database 5.000 toko belum tersedia, unplanned visit sangat diperbolehkan dan akan menjadi sumber utama pembentukan Candidate Store Database.

Flow unplanned:

```text
Add Store
↓
Input nama toko
↓
Input alamat lengkap
↓
GPS auto capture
↓
Survey toko
↓
Submit
↓
Masuk Candidate Store
↓
Menjadi Master Store setelah Verified
```

---

# 6. Struktur Pertanyaan Survey

Survey dibagi menjadi 9 bagian:

1. Visit Outcome & Basic Store Identity.
2. Address & Location Data.
3. Contact & Decision Maker.
4. Business Type & Store Profile.
5. Cooling Product Presence.
6. Existing Brand & Supplier Intelligence.
7. Commercial Behavior & Purchase Pattern.
8. Openness to KLWT / New Supplier.
9. Photo Evidence & Surveyor Notes.

Semua toko mendapatkan pertanyaan yang sama. Tidak ada branching survey pada MVP.

---

# 7. Section A — Visit Outcome & Basic Store Identity

## Q1. Visit Outcome

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Survey Completed.
- Store Closed.
- Address Not Found.
- Moved Location.
- Refused.
- Not Relevant Store.
- Duplicate Found.
- Need Revisit.

### Mengapa pertanyaan ini ditanyakan?

Pertanyaan ini menentukan hasil kunjungan. Tidak semua visit akan menghasilkan survey lengkap. Sistem perlu tetap mencatat upaya Surveyor secara jujur tanpa memaksa mereka membuat data palsu.

### Data yang dihasilkan

- Status akhir kunjungan.
- Dasar perhitungan KPI.
- Alasan toko tidak masuk survey valid.
- Input untuk reassign atau revisit.

### Conversational intelligence hints

Jika toko tutup:

> “Toko terlihat tutup saat kunjungan. Saya ambil foto depan toko dan catat statusnya supaya bisa dijadwalkan ulang bila diperlukan.”

Jika ditolak:

> “Baik Pak/Bu, saya hormati. Saya hanya akan catat bahwa toko belum bersedia diwawancarai.”

Jika alamat tidak ditemukan:

> “Saya sudah berada di sekitar titik/alamat, tetapi toko tidak ditemukan. Saya catat sebagai address not found dengan GPS lokasi saat ini.”

---

## Q2. Store Name

**Field Type:** Text input  
**Mandatory:** Yes  

Contoh:

```text
Toko Sinar Jaya Motor
Bengkel Berkah Radiator
CV Mega Sparepart
```

### Mengapa pertanyaan ini ditanyakan?

Nama toko adalah identitas utama untuk deduplication, export, follow-up, dan database merchant KLWT.

### Data yang dihasilkan

- Store name.
- Candidate/Master Store identity.
- Duplicate matching input.

### Conversational intelligence hints

> “Nama toko yang biasa dipakai di nota atau Google Maps apa ya Pak/Bu?”

> “Kalau pelanggan cari toko ini, biasanya nama yang dikenal apa?”

---

## Q3. Store Display Name / Alias

**Field Type:** Text input  
**Mandatory:** No  

### Mengapa pertanyaan ini ditanyakan?

Banyak toko memiliki nama legal berbeda dengan nama papan toko atau nama yang dikenal pelanggan. Alias membantu deduplication dan pencarian ulang.

### Data yang dihasilkan

- Alias toko.
- Nama papan toko.
- Nama populer lokal.

### Conversational intelligence hints

> “Kadang nama di papan toko berbeda dengan nama di nota. Ada nama lain yang biasa dipakai?”

---

# 8. Section B — Address & Location Data

## Q4. Province

**Field Type:** Dropdown wilayah Indonesia  
**Mandatory:** Yes  

### Mengapa pertanyaan ini ditanyakan?

Provinsi diperlukan untuk pemetaan nasional, filtering dashboard, dan export market coverage.

### Conversational intelligence hints

Biasanya tidak perlu ditanyakan jika Surveyor tahu lokasi. Isi berdasarkan lokasi visit.

---

## Q5. City / Regency

**Field Type:** Dropdown bertingkat  
**Mandatory:** Yes  

### Mengapa pertanyaan ini ditanyakan?

Pembagian assignment Manager berbasis kota. Kota juga menjadi dimensi utama untuk dashboard coverage dan perbandingan potensi area.

### Conversational intelligence hints

> “Ini masuk administrasi Kota/Kabupaten apa ya Pak/Bu?”

---

## Q6. District / Kecamatan

**Field Type:** Dropdown bertingkat  
**Mandatory:** Yes  

### Mengapa pertanyaan ini ditanyakan?

Kecamatan dibutuhkan untuk route planning, clustering area, dan analisis coverage yang lebih detail.

### Conversational intelligence hints

> “Kalau kecamatan di sini masuk mana ya Pak/Bu?”

---

## Q7. Village / Desa/Kelurahan

**Field Type:** Dropdown bertingkat  
**Mandatory:** Yes  

### Mengapa pertanyaan ini ditanyakan?

Desa/Kelurahan membantu akurasi alamat dan memudahkan follow-up lapangan setelah campaign.

### Conversational intelligence hints

> “Kelurahannya di sini apa ya Pak/Bu?”

---

## Q8. Detailed Address & Landmark

**Field Type:** Text area  
**Mandatory:** Yes  

Contoh:

```text
Jl. Raya Bogor KM 28, sebelah toko ban, depan SPBU Pertamina, ruko warna biru.
```

### Mengapa pertanyaan ini ditanyakan?

GPS saja tidak cukup. Detail alamat dan patokan membantu follow-up, revisit, dan validasi lokasi.

### Data yang dihasilkan

- Full address.
- Landmark.
- Follow-up route reference.

### Conversational intelligence hints

> “Untuk patokan lokasi, biasanya orang diarahkan pakai patokan apa Pak/Bu?”

> “Kalau nanti ada tim yang mau datang lagi, patokan paling mudah apa?”

---

## Q9. GPS Auto Capture

**Field Type:** Auto captured  
**Mandatory:** Yes, soft warning  

Rule:

- Sistem mengambil latitude dan longitude saat survey.
- Jika planned store sudah punya titik GPS dan jarak submit >100 meter, sistem memberi warning.
- Warning tidak memblokir submit.

### Mengapa data ini dikumpulkan?

GPS menjadi bukti kunjungan, membantu deduplication lokasi, dan membantu pemetaan coverage.

### Data yang dihasilkan

- Latitude.
- Longitude.
- GPS accuracy.
- Distance from planned point.
- GPS warning flag.

### Conversational intelligence hints

Tidak perlu ditanyakan ke toko. Surveyor cukup memastikan GPS aktif.

---

# 9. Section C — Contact & Decision Maker

## Q10. Contact Person Name

**Field Type:** Text input  
**Mandatory:** Recommended  

### Mengapa pertanyaan ini ditanyakan?

Nama kontak membantu follow-up KLWT setelah campaign. Kontak tidak harus owner; bisa PIC toko yang menjawab survey.

### Conversational intelligence hints

> “Boleh saya catat nama Bapak/Ibu yang saya ajak ngobrol, supaya kalau nanti ada follow-up tidak salah panggil?”

---

## Q11. PIC Type

**Field Type:** Single choice  
**Mandatory:** Yes jika ada narasumber  

Pilihan:

- Owner.
- Karyawan.

### Mengapa pertanyaan ini ditanyakan?

Jawaban dari owner biasanya memiliki bobot keputusan lebih tinggi. Jawaban dari karyawan tetap berguna, tetapi perlu diberi confidence berbeda dalam Data Quality Score.

### Conversational intelligence hints

> “Bapak/Ibu ini owner langsung atau bagian toko/karyawan ya?”

---

## Q12. WhatsApp Number

**Field Type:** Phone input  
**Mandatory:** Optional, tetapi jika kosong wajib alasan  

### Mengapa pertanyaan ini ditanyakan?

Nomor WA adalah syarat utama agar toko bisa menjadi **Hot Lead**. Tanpa nomor WA, toko masih bisa menjadi **Qualified Lead**, tetapi follow-up lebih sulit.

### Data yang dihasilkan

- Contactability.
- Hot Lead eligibility.
- Follow-up export data.

### Conversational intelligence hints

> “Kalau nanti ada info harga atau katalog cooling yang cocok, nomor WhatsApp toko yang bisa dihubungi apa Pak/Bu?”

> “Biasanya order supplier lewat nomor WA toko yang mana Pak/Bu?”

> “Boleh saya catat nomor WA bisnis toko? Bukan nomor pribadi juga tidak apa-apa.”

---

## Q13. Reason if WhatsApp Number Empty

**Field Type:** Single choice + Other text if lainnya  
**Mandatory:** Yes jika WA kosong  

Pilihan:

- Owner/PIC menolak memberi nomor.
- Owner/PIC tidak tersedia.
- Toko tidak memiliki nomor WA bisnis.
- Akan diberikan saat revisit.
- Lainnya, wajib isi keterangan.

### Mengapa pertanyaan ini ditanyakan?

Membedakan toko yang benar-benar tidak bisa dihubungi dengan toko yang masih mungkin dikontak saat revisit.

### Conversational intelligence hints

Jika toko menolak:

> “Tidak apa-apa Pak/Bu, saya catat bahwa nomor belum bisa diberikan.”

Jika owner tidak ada:

> “Kalau owner sedang tidak ada, saya catat saja bahwa nomor bisa diminta saat revisit.”

---

## Q14. Purchasing Decision Maker

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Owner.
- Anak owner / family.
- Kepala toko.
- Mekanik.
- Staff pembelian.
- Lainnya.

### Mengapa pertanyaan ini ditanyakan?

KLWT perlu tahu siapa yang harus didekati untuk closing. Decision maker memengaruhi Hot Lead quality dan follow-up strategy.

### Conversational intelligence hints

> “Kalau biasanya ambil barang dari supplier, yang memutuskan pesan barang siapa Pak/Bu?”

> “Kalau ada supplier baru masuk, biasanya ngobrolnya ke owner langsung atau ada bagian pembelian?”

---

## Q15. Decision Maker Availability

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Selalu ada.
- Pagi saja.
- Sore saja.
- By phone/WA.
- Jarang datang.

### Mengapa pertanyaan ini ditanyakan?

Menentukan strategi follow-up. Toko yang decision maker-nya mudah ditemui lebih mudah dikonversi.

### Conversational intelligence hints

> “Kalau nanti ada yang mau follow-up penawaran, waktu paling cocok ketemu owner/PIC kapan ya?”

---

# 10. Section D — Business Type & Store Profile

## Q16. Main Business Type

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- General Sparepart Retail.
- Wholesale Sparepart Distributor.
- Workshop / Repair Garage.
- Specialist Workshop.
- Cooling Specialist / Radiator Shop.
- AC & Cooling Specialist.
- Multi-Service Auto Center.
- Fleet / Commercial Workshop.
- Other Automotive Merchant.

### Mengapa pertanyaan ini ditanyakan?

Business type menentukan relevansi awal terhadap produk KLWT. Toko radiator, AC, dan sparepart umum biasanya lebih relevan untuk cooling parts daripada toko yang tidak menjual replacement parts.

### Data yang dihasilkan

- Store segmentation.
- Cooling relevance baseline.
- Dashboard by store type.

### Conversational intelligence hints

> “Toko ini lebih dominan jual sparepart umum, khusus radiator, AC mobil, atau sekalian bengkel juga Pak/Bu?”

> “Kalau pelanggan datang, biasanya kebutuhan utama mereka apa?”

---

## Q17. Vehicle Specialization

**Field Type:** Multiple choice  
**Mandatory:** Yes  

Pilihan:

- Japanese Passenger Car.
- European Passenger Car.
- Korean Passenger Car.
- Chinese Car.
- SUV/4x4.
- Commercial Van/Pickup.
- Diesel/Truck.
- Universal Mixed.

### Mengapa pertanyaan ini ditanyakan?

KLWT perlu memahami segmen kendaraan yang dilayani toko untuk menentukan SKU cooling yang relevan.

### Conversational intelligence hints

> “Di sini paling sering melayani mobil Jepang, Eropa, Korea, China, atau campur Pak/Bu?”

> “Untuk radiator dan cooling, yang paling sering dicari biasanya mobil jenis apa?”

---

## Q18. Store Scale Estimate

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Small.
- Medium.
- Large.
- Wholesale / Distributor scale.

### Mengapa pertanyaan ini ditanyakan?

Skala toko membantu memperkirakan potensi order, prioritas follow-up, dan bobot merchant potential.

### Conversational intelligence hints

Surveyor dapat menilai dari ukuran toko, jumlah rak, aktivitas pelanggan, dan stok barang. Tidak perlu bertanya langsung jika terlihat jelas.

> “Stok cooling di sini biasanya untuk retail harian saja atau juga supply ke bengkel/toko lain Pak/Bu?”

---

# 11. Section E — Cooling Product Presence

## Q19. Cooling Products Seen / Sold

**Field Type:** Multiple choice  
**Mandatory:** Yes  

Pilihan:

- Radiator.
- Condenser.
- Cooling Fan.
- Water Pump.
- Radiator Hose.
- Radiator Cap.
- Coolant Accessories.
- Tidak terlihat / tidak menjual cooling parts.

### Mengapa pertanyaan ini ditanyakan?

Ini adalah pertanyaan inti untuk mengetahui apakah toko relevan dengan lini produk KLWT.

### Data yang dihasilkan

- Product coverage by store.
- SKU opportunity mapping.
- Cooling Merchant Relevance Score.

### Conversational intelligence hints

> “Untuk barang cooling, biasanya di sini ada radiator, condenser, kipas radiator, water pump, atau selang radiator Pak/Bu?”

> “Yang paling sering dicari pelanggan dari kategori cooling apa?”

---

## Q20. Cooling Shelf / Stock Size Estimate

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Tidak terlihat cooling parts.
- Sedikit.
- Sedang.
- Banyak / dominan.

### Mengapa pertanyaan ini ditanyakan?

Ukuran stok cooling membantu menilai seberapa penting kategori cooling bagi toko.

### Conversational intelligence hints

Jika terlihat rak:

> “Stok cooling ini biasanya memang ready stock atau hanya sebagian display Pak/Bu?”

Jika tidak terlihat:

> “Kalau radiator atau cooling biasanya ready stock, atau ambil kalau ada permintaan?”

---

## Q21. Cooling Sales Activity

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Jarang.
- Kadang.
- Cukup rutin.
- Sangat rutin.

### Mengapa pertanyaan ini ditanyakan?

Aktivitas penjualan cooling lebih penting daripada hanya melihat barang di rak. Toko dengan stok kecil tetapi penjualan rutin tetap bisa menjadi lead bagus.

### Conversational intelligence hints

> “Untuk barang cooling seperti radiator atau kipas, permintaan biasanya jarang, kadang-kadang, atau cukup rutin Pak/Bu?”

> “Dalam seminggu biasanya ada permintaan cooling beberapa kali atau hanya kalau ada kasus tertentu?”

---

# 12. Section F — Existing Brand & Supplier Intelligence

## Q22. Cooling Brands Seen / Sold

**Field Type:** Multiple choice + Other  
**Mandatory:** Yes  

Pilihan awal:

- Denso.
- Koyorad.
- TYC.
- GMB.
- Aisin.
- Astra/Aspira.
- Sakura.
- Generic China.
- Local No Brand.
- Other, isi manual.
- Tidak tahu / tidak terlihat.

### Mengapa pertanyaan ini ditanyakan?

Brand yang terlihat menunjukkan positioning pasar toko: premium, OEM trusted, mid aftermarket, atau economy. Ini membantu KLWT memahami kompetitor langsung dan peluang masuk.

### Conversational intelligence hints

> “Kalau untuk radiator atau cooling, brand yang biasanya jalan di sini apa Pak/Bu?”

> “Customer di sini lebih sering cari brand tertentu atau yang penting cocok dan harga masuk?”

---

## Q23. Current Product Selling Segment

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Genuine Premium Dominant.
- OEM Trusted Dominant.
- Mid Aftermarket Mixed.
- Economy / Low Cost Dominant.

### Mengapa pertanyaan ini ditanyakan?

KLWT adalah challenger supplier dengan value harga dan margin. Toko yang sudah terbiasa menjual mid/economy aftermarket biasanya lebih terbuka terhadap KLWT.

### Conversational intelligence hints

> “Pelanggan di sini biasanya minta yang original/premium, OEM trusted, atau yang penting harga cocok Pak/Bu?”

> “Kalau ada pilihan kualitas cukup bagus tapi harga lebih kompetitif, biasanya pelanggan mau?”

---

## Q24. Existing Low Cost Import Share

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Tidak ada.
- Sedikit.
- Campuran.
- Dominan.

### Mengapa pertanyaan ini ditanyakan?

Mendeteksi apakah toko sudah familiar menjual produk import low cost. Ini adalah indikator kuat untuk KLWT penetration opportunity.

### Conversational intelligence hints

> “Untuk barang import harga ekonomis, biasanya ada juga di sini atau lebih banyak brand premium?”

> “Kalau barang China dengan kualitas stabil dan harga lebih masuk, biasanya toko mau coba atau jarang?”

---

## Q25. Current Cooling Supplier Type

**Field Type:** Multiple choice  
**Mandatory:** Yes  

Pilihan:

- Sales distributor datang.
- Grosir langganan.
- Importir.
- Marketplace.
- Ambil sendiri.
- Campur.

### Mengapa pertanyaan ini ditanyakan?

Menunjukkan channel pasokan existing. KLWT dapat menentukan apakah pendekatan masuk harus melalui direct sales, distributor, grosir, atau digital order.

### Conversational intelligence hints

> “Biasanya barang cooling ambil dari mana Pak/Bu? Ada sales yang datang, grosir langganan, marketplace, atau ambil sendiri?”

> “Kalau stok habis, biasanya order lewat WA supplier atau nunggu sales datang?”

---

## Q26. Existing Supplier Name

**Field Type:** Text input  
**Mandatory:** Optional, sangat disarankan  

### Mengapa pertanyaan ini ditanyakan?

Nama supplier membantu KLWT memahami pemain distribusi existing. Namun pertanyaan ini sensitif, sehingga tidak boleh dipaksa.

### Conversational intelligence hints

> “Kalau boleh tahu, biasanya supplier cooling langganannya dari mana Pak/Bu? Kalau tidak nyaman menyebut nama juga tidak apa-apa.”

> “Saya catat tipe supplier-nya saja juga boleh, misalnya dari grosir atau distributor.”

---

## Q27. Primary Supplier Dependency

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Sangat tergantung 1 supplier.
- 2–3 supplier tetap.
- Supplier campuran fleksibel.
- Opportunistic buyer.

### Mengapa pertanyaan ini ditanyakan?

Toko yang terlalu tergantung satu supplier mungkin sulit ditembus jika puas, tetapi sangat menarik jika punya keluhan. Toko fleksibel lebih mudah mencoba supplier baru.

### Conversational intelligence hints

> “Untuk cooling, biasanya ambil dari satu supplier utama atau beberapa supplier tergantung stok dan harga?”

---

## Q28. Existing Supplier Satisfaction

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Sangat puas.
- Cukup puas.
- Banyak keluhan.
- Sedang cari alternatif.

### Mengapa pertanyaan ini ditanyakan?

Supplier dissatisfaction adalah indikator kuat peluang KLWT masuk sebagai supplier challenger.

### Conversational intelligence hints

> “Selama ini supplier cooling sudah cukup cocok, atau masih ada kendala seperti harga, stok, retur, atau pengiriman?”

> “Kalau ada supplier baru dengan barang lebih lengkap atau harga lebih kompetitif, apakah toko sedang terbuka cari alternatif?”

---

## Q29. Supplier Return Ease

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Sangat mudah.
- Cukup mudah.
- Agak sulit.
- Sulit / hampir tidak bisa.
- Tidak tahu.

### Mengapa pertanyaan ini ditanyakan?

Return policy sering menjadi faktor penting untuk sparepart aftermarket. Jika toko kesulitan retur ke supplier existing, KLWT bisa menawarkan benefit yang lebih menarik.

### Conversational intelligence hints

> “Kalau ada barang cooling yang tidak cocok atau bermasalah, retur ke supplier biasanya mudah atau agak susah Pak/Bu?”

---

## Q30. Supplier Delivery Speed

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Hari yang sama.
- Besok.
- 2–3 hari.
- Lebih lama / inden.
- Tidak tahu.

### Mengapa pertanyaan ini ditanyakan?

Delivery speed menjadi faktor kompetisi supplier. Jika supplier existing lambat, KLWT punya peluang jika bisa menawarkan stok dan pengiriman lebih cepat.

### Conversational intelligence hints

> “Kalau pesan radiator atau condenser, biasanya barang datang hari yang sama, besok, atau perlu inden Pak/Bu?”

---

# 13. Section G — Commercial Behavior & Purchase Pattern

## Q31. Cooling Restock Frequency

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Hampir tiap hari.
- Mingguan.
- Bulanan.
- Hanya saat ada permintaan.
- Tidak tahu.

### Mengapa pertanyaan ini ditanyakan?

Restock frequency menunjukkan potensi repeat order. Toko yang restock rutin lebih bernilai sebagai calon customer supplier.

### Conversational intelligence hints

> “Untuk barang cooling, biasanya restock rutin mingguan/bulanan, atau beli kalau ada permintaan saja Pak/Bu?”

---

## Q32. Average Cooling Purchase Size

**Field Type:** Single choice range  
**Mandatory:** Optional  

Pilihan:

- Kecil.
- Sedang.
- Besar.
- Tidak bersedia menjawab.
- Tidak tahu.

Alternatif jika ingin nilai rupiah:

- < Rp1 juta / bulan.
- Rp1–5 juta / bulan.
- Rp5–10 juta / bulan.
- Rp10–25 juta / bulan.
- > Rp25 juta / bulan.
- Tidak bersedia menjawab.
- Tidak tahu.

### Mengapa pertanyaan ini ditanyakan?

Membantu memperkirakan nilai potensi toko. Namun karena sensitif, pertanyaan ini tidak mandatory.

### Conversational intelligence hints

> “Kalau boleh perkiraan kasar saja Pak/Bu, pembelian cooling per bulan biasanya kecil, sedang, atau lumayan besar? Tidak perlu angka detail.”

> “Kalau tidak nyaman jawab angka, saya catat kategori saja.”

---

## Q33. Payment Method Existing Supplier

**Field Type:** Single choice / multiple choice  
**Mandatory:** Optional  

Pilihan:

- CBD transfer dulu.
- COD barang datang.
- Tempo 7 hari.
- Tempo 14 hari.
- Tempo 30 hari+.
- Campur / konsinyasi.
- Tidak bersedia menjawab.
- Tidak tahu.

### Mengapa pertanyaan ini ditanyakan?

Payment terms memengaruhi daya tarik supplier baru. Jika toko terbiasa tempo, penawaran KLWT perlu disesuaikan.

### Conversational intelligence hints

> “Untuk supplier biasanya sistemnya transfer dulu, COD, atau ada tempo Pak/Bu? Kalau tidak bisa disebutkan juga tidak apa-apa.”

---

## Q34. Main Purchase Driver

**Field Type:** Multiple choice, maksimal 3  
**Mandatory:** Yes  

Pilihan:

- Harga murah.
- Margin besar.
- Brand terkenal.
- Kualitas stabil.
- Barang lengkap.
- Fast delivery.
- Retur mudah.
- Tempo pembayaran.

### Mengapa pertanyaan ini ditanyakan?

Menunjukkan alasan utama toko memilih supplier/produk. Ini menjadi input utama untuk positioning KLWT saat follow-up.

### Conversational intelligence hints

> “Kalau memilih supplier atau brand cooling, yang paling penting bagi toko apa Pak/Bu? Harga, margin, kualitas, stok lengkap, atau pengiriman cepat?”

---

## Q35. Store Price Sensitivity

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Sangat harga.
- Harga & kualitas seimbang.
- Lebih cari merk terkenal.

### Mengapa pertanyaan ini ditanyakan?

KLWT perlu tahu apakah value proposition harga kompetitif akan cocok untuk toko tersebut.

### Conversational intelligence hints

> “Customer di sini biasanya lebih sensitif harga, atau masih mempertimbangkan brand dan kualitas juga Pak/Bu?”

---

# 14. Section H — Openness to KLWT / New Supplier

## Q36. Openness to New Alternative Brand

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Sangat terbuka.
- Bisa coba.
- Hanya merk tertentu.
- Tidak suka coba baru.

### Mengapa pertanyaan ini ditanyakan?

Ini adalah salah satu penentu utama Merchant Potential Score. KLWT sebagai challenger membutuhkan toko yang terbuka mencoba brand/supplier baru.

### Conversational intelligence hints

> “Kalau ada supplier baru menawarkan produk cooling dengan harga lebih kompetitif dan pilihan barang lengkap, apakah toko terbuka untuk coba?”

> “Biasanya kalau ada brand baru, toko mau test beberapa item dulu atau hanya ambil brand yang sudah biasa?”

---

## Q37. Main Reason to Try New Supplier

**Field Type:** Multiple choice, maksimal 3  
**Mandatory:** Yes  

Pilihan:

- Harga lebih murah.
- Margin lebih besar.
- Barang lebih lengkap.
- Tempo lebih enak.
- Retur lebih gampang.
- Pengiriman cepat.
- Kualitas lebih stabil.
- Tidak tertarik.

### Mengapa pertanyaan ini ditanyakan?

Memberi insight tentang pesan penawaran terbaik untuk toko tersebut. Misalnya toko A tertarik harga, toko B tertarik retur, toko C tertarik kelengkapan barang.

### Conversational intelligence hints

> “Kalau toko mau coba supplier baru, biasanya alasan paling menarik apa Pak/Bu? Harga, margin, stok lengkap, tempo, retur, atau pengiriman?”

---

## Q38. Willingness to Receive KLWT Follow-up

**Field Type:** Single choice  
**Mandatory:** Yes  

Pilihan:

- Mau dihubungi.
- Boleh kirim katalog/price list dulu.
- Perlu bicara owner.
- Tidak tertarik saat ini.

### Mengapa pertanyaan ini ditanyakan?

Membedakan toko yang benar-benar siap follow-up dari toko yang hanya terbuka secara umum. Ini membantu export Hot Lead.

### Conversational intelligence hints

> “Kalau nanti ada katalog atau info harga produk cooling, boleh dikirim ke nomor WA toko?”

> “Lebih cocok dikirim katalog dulu atau langsung ada tim yang follow-up?”

---

# 15. Section I — Photo Evidence & Notes

## Q39. Photo 1 — Foto Tampak Depan Toko

**Field Type:** Image upload / camera capture  
**Mandatory:** Minimum required  

### Mengapa foto ini dibutuhkan?

Foto depan toko menjadi bukti bahwa Surveyor benar-benar berada di lokasi, membantu verifikasi nama toko, dan membantu deduplication.

### Rule

- Minimal 1 foto tampak depan wajib untuk survey completed.
- Jika tidak ada foto sama sekali, hanya boleh submit jika visit outcome bukan survey completed, seperti refused, closed, atau address not found.

### Conversational intelligence hints

> “Saya izin foto tampak depan toko untuk bukti kunjungan ya Pak/Bu.”

---

## Q40. Photo 2 — Foto Dalam Toko / Rak / Area Sparepart

**Field Type:** Image upload / camera capture  
**Mandatory:** Required unless refused with reason  

### Mengapa foto ini dibutuhkan?

Foto dalam/rak membantu Verificator melihat apakah observasi cooling sesuai dengan kondisi toko.

### Refusal Reason Options

- Toko melarang foto area dalam.
- Toko sedang ramai.
- Alasan keamanan/privasi.
- Lainnya, wajib isi keterangan.

### Conversational intelligence hints

> “Boleh saya foto area rak sparepart secara umum saja Pak/Bu? Tidak perlu detail data sensitif.”

> “Fotonya hanya untuk memastikan kategori barang, bukan untuk audit toko.”

---

## Q41. Photo 3 — Foto dengan Narasumber / PIC Toko

**Field Type:** Image upload / camera capture  
**Mandatory:** Required unless refused with reason  

Pilihan PIC:

- Owner.
- Karyawan.

### Mengapa foto ini dibutuhkan?

Foto dengan narasumber membantu memastikan survey dilakukan dengan orang yang benar-benar berada di toko dan meningkatkan kepercayaan data.

### Refusal Reason Options

- Owner/PIC menolak foto orang.
- Toko sedang ramai.
- Alasan keamanan/privasi.
- Lainnya, wajib isi keterangan.

### Conversational intelligence hints

> “Sebagai bukti bahwa saya sudah ngobrol langsung dengan pihak toko, boleh foto singkat bersama Bapak/Ibu? Kalau tidak berkenan, tidak apa-apa, saya catat alasannya.”

---

## Q42. Surveyor Notes

**Field Type:** Text area  
**Mandatory:** Optional  

### Mengapa pertanyaan ini ditanyakan?

Catatan bebas membantu menangkap informasi penting yang tidak masuk pilihan form.

Contoh catatan:

```text
Owner tertarik jika ada radiator Avanza/Xenia dengan harga kompetitif.
Toko terlihat ramai, stok cooling sedang, tapi owner tidak mau sebut supplier.
PIC minta dikirim price list melalui WA minggu depan.
```

### Conversational intelligence hints

Surveyor menulis setelah percakapan, tidak perlu ditanyakan langsung.

---

# 16. Score dan Klasifikasi Hasil Survey

Survey menghasilkan dua score utama:

1. **Merchant Potential Score**.
2. **Data Quality Score**.

## 16.1 Merchant Potential Score

Merchant Potential Score mengukur potensi toko sebagai target KLWT.

Komponen utama:

| Komponen | Alasan |
|---|---|
| Business type | Menentukan relevansi kategori toko |
| Cooling products sold/seen | Menentukan relevansi produk KLWT |
| Cooling sales activity | Menentukan potensi repeat order |
| Low cost import acceptance | Menilai kecocokan dengan challenger brand |
| Supplier dissatisfaction | Menilai peluang pindah/menambah supplier |
| Openness to new brand | Menilai kesiapan mencoba KLWT |
| Main purchase driver | Menilai kesesuaian value proposition KLWT |
| Decision maker accessibility | Menilai kemudahan follow-up |
| WhatsApp availability | Menilai contactability |

### Output Merchant Potential

| Class | Meaning |
|---|---|
| A+ | Very High Potential |
| A | High Potential |
| B | Medium Potential |
| C | Low Potential |

## 16.2 Data Quality Score

Data Quality Score mengukur kepercayaan terhadap data survey.

Komponen utama:

| Komponen | Alasan |
|---|---|
| Foto depan toko tersedia | Evidence lokasi |
| Foto dalam/rak tersedia | Evidence observasi produk |
| Foto narasumber tersedia | Evidence interaksi |
| GPS tersedia | Evidence lokasi |
| GPS warning | Risiko lokasi tidak sesuai |
| WA tersedia / alasan kosong | Kualitas kontak |
| Alamat lengkap | Kualitas follow-up |
| PIC type jelas | Kualitas narasumber |
| Data tidak duplicate | Kualitas database |
| Jawaban konsisten | Kualitas intelligence |

### Output Data Quality

| Class | Meaning |
|---|---|
| High Confidence | Data kuat dan lengkap |
| Medium Confidence | Data cukup, ada minor issue |
| Low Confidence | Banyak warning, perlu review |
| Invalid | Ditolak Verificator |

## 16.3 Hot Lead vs Qualified Lead

| Lead Type | Definition |
|---|---|
| Hot Lead | Score tinggi + toko terbuka mencoba supplier baru + nomor WA tersedia |
| Qualified Lead | Score tinggi + toko terbuka mencoba supplier baru + nomor WA belum tersedia |
| Strategic Lead | Relevansi cooling tinggi, tetapi openness rendah/sedang |
| Low Priority | Relevansi rendah atau tidak terbuka mencoba supplier baru |

---

# 17. Proses Kerja Setiap Role

## 17.1 Administrator

Administrator bertugas menyiapkan sistem sebelum campaign dimulai.

### Tugas utama

1. Membuat akun Head, Manager, Verificator, dan Surveyor.
2. Bulk import user.
3. Setup wilayah Indonesia untuk dropdown alamat.
4. Setup kota/area assignment Manager.
5. Setup master data pilihan survey.
6. Setup fixed scoring formula v1.
7. Setup KPI dan incentive metrics.
8. Mengelola export access.

### Output kerja Administrator

- User aktif.
- Role permission benar.
- Wilayah tersedia.
- Master pilihan survey siap.
- Scoring aktif.
- Dashboard dan export siap digunakan.

---

## 17.2 Manager

Manager bertugas mengelola area/kota dan aktivitas Surveyor.

### Tugas sebelum hari kunjungan

1. Menentukan kota/area kerja.
2. Membuat H-1 visit plan jika ada target toko tertentu.
3. Assign toko ke Surveyor.
4. Bulk import target store jika punya data awal.
5. Melihat kapasitas Surveyor.

### Tugas saat hari kunjungan

1. Monitor progress Surveyor.
2. Melihat completed, pending, skipped, dan unplanned store.
3. Reassign toko jika Surveyor berhalangan.
4. Memberikan arahan area coverage.

### Tugas setelah survey

1. Melihat hasil verified.
2. Melihat Hot Lead dan Qualified Lead.
3. Melihat performance Surveyor.
4. Melihat warning dan duplicate issue.

### Output kerja Manager

- Visit plan.
- Assignment per Surveyor.
- Area coverage report.
- Team performance report.
- Hot Lead list per kota/area.

---

## 17.3 Surveyor

Surveyor adalah eksekutor lapangan.

### Tugas utama

1. Login ke PWA menggunakan username/nomor HP + password.
2. Memilih bahasa jika diperlukan.
3. Melihat Today Plan.
4. Melakukan planned visit.
5. Menambahkan unplanned store jika menemukan toko potensial.
6. Mengisi survey 10–20 menit.
7. Upload foto evidence.
8. Submit survey.
9. Melihat score setelah submit.
10. Memperbaiki data jika status Need Revision.

### Prinsip kerja Surveyor

```text
Visit benar > data valid > evidence lengkap > submit cepat.
```

### Hal yang tidak boleh dilakukan Surveyor

- Mengisi survey tanpa benar-benar visit.
- Menggunakan foto toko lain.
- Mengarang jawaban supplier.
- Mengisi nomor WA palsu.
- Mengulang toko yang sama untuk mengejar insentif.
- Memaksa owner/PIC menjawab data sensitif.

### Output kerja Surveyor

- Candidate Store.
- Survey response.
- Photo evidence.
- GPS evidence.
- Merchant score.
- Data quality signal.

---

## 17.4 Verificator

Verificator bertugas menjaga kualitas data. Karena hanya ada 1 Verificator, prioritas utama adalah submission dengan warning.

### Prioritas review

1. Data dengan GPS warning.
2. Data dengan foto kurang/refused.
3. Data dengan duplicate warning.
4. Data dengan score A/A+.
5. Data dengan jawaban tidak konsisten.
6. Data dari Surveyor dengan warning rate tinggi.

### Checklist Verificator

| Check | Pertanyaan Verifikasi |
|---|---|
| GPS | Apakah lokasi masuk akal? |
| Foto depan | Apakah nama toko/lokasi cocok? |
| Foto dalam/rak | Apakah observasi cooling sesuai foto? |
| Foto PIC | Apakah ada evidence interaksi? |
| Alamat | Apakah alamat lengkap dan masuk akal? |
| Duplicate | Apakah toko sudah pernah disubmit? |
| Contact | Apakah nomor WA terlihat valid? |
| Supplier answer | Apakah jawaban supplier logis? |
| Score | Apakah score sesuai jawaban? |

### Decision Verificator

- Verified Valid.
- Need Revision.
- Rejected Invalid.

### Output kerja Verificator

- Verified Master Store.
- Rejected/invalid data.
- Revision queue.
- Data quality status.

---

## 17.5 Head

Head bertugas memantau hasil nasional dan mengambil insight strategis.

### Tugas utama

1. Melihat progress nasional.
2. Melihat coverage per kota/provinsi.
3. Melihat Hot Lead dan Qualified Lead.
4. Melihat supplier/brand intelligence.
5. Melihat performance Manager dan Surveyor.
6. Mengunduh export final.

### Output kerja Head

- National campaign report.
- Market intelligence summary.
- Hot Lead export.
- Performance and incentive review.

---

# 18. Hasil Survey: Data Apa Saja yang Didapat?

Survey menghasilkan beberapa kelompok data.

## 18.1 Store Identity Data

- Store ID.
- Candidate/Master status.
- Store name.
- Store alias.
- Business type.
- Store scale.
- Vehicle specialization.

## 18.2 Location Data

- Province.
- City/Regency.
- District/Kecamatan.
- Village/Desa/Kelurahan.
- Detailed address.
- Landmark.
- Latitude.
- Longitude.
- GPS accuracy.
- GPS warning flag.

## 18.3 Contact Data

- Contact person name.
- PIC type: owner/karyawan.
- WhatsApp number.
- Reason if WA empty.
- Decision maker role.
- Decision maker availability.

## 18.4 Cooling Product Data

- Cooling products sold/seen.
- Cooling shelf/stock size.
- Cooling sales activity.
- Cooling relevance.
- Product category opportunity.

## 18.5 Brand Intelligence Data

- Brands seen/sold.
- Product selling segment.
- Low cost import share.
- Brand positioning in store.

## 18.6 Supplier Intelligence Data

- Current supplier type.
- Supplier name, optional.
- Supplier dependency.
- Supplier satisfaction.
- Return ease.
- Delivery speed.
- Existing payment method.

## 18.7 Commercial Behavior Data

- Restock frequency.
- Average purchase size range.
- Main purchase driver.
- Price sensitivity.
- Payment preference.

## 18.8 Openness & Lead Data

- Openness to new brand.
- Reason to try new supplier.
- Willingness to receive KLWT follow-up.
- Hot Lead / Qualified Lead status.
- Merchant Potential Score.

## 18.9 Evidence & Quality Data

- Photo depan toko link.
- Photo dalam/rak link.
- Photo dengan PIC link.
- Photo refusal reason.
- Data Quality Score.
- Warning flags.
- Verification status.
- Revision/rejection reason.

## 18.10 Performance Data

- Surveyor ID.
- Manager ID.
- Visit date/time.
- Planned vs unplanned.
- Submit timestamp.
- Verified valid status.
- Duplicate flag.
- KPI credit eligibility.
- Incentive eligibility.

---

# 19. Result Dashboard yang Dihasilkan

## 19.1 Operational Dashboard

Untuk Manager:

- Target hari ini.
- Completed visit.
- Pending visit.
- Skipped visit.
- Unplanned store count.
- Surveyor ranking.
- Warning count.
- Verified valid count.
- Duplicate count.

## 19.2 Intelligence Dashboard

Untuk Head dan Manager:

- Hot Lead by province/city.
- Qualified Lead by province/city.
- Store type distribution.
- Cooling relevance distribution.
- Most seen cooling brands.
- Existing supplier type distribution.
- Supplier dissatisfaction distribution.
- Openness to new supplier.
- Purchase driver analysis.
- Price sensitivity analysis.

## 19.3 Data Quality Dashboard

Untuk Verificator/Admin:

- Submission waiting review.
- GPS warning count.
- Missing photo count.
- Duplicate warning count.
- Need revision count.
- Rejected invalid count.
- Surveyor data quality ranking.

## 19.4 Incentive Dashboard

Untuk Manager/Admin/Head:

- Submitted visits.
- Verified valid visits.
- Valid rate.
- Duplicate rate.
- Warning rate.
- Hot Lead count.
- Qualified Lead count.
- Data Quality Score average.
- Incentive eligible visit count.

---

# 20. Export yang Dihasilkan

## 20.1 All Survey Data Export

Berisi seluruh data survey mentah dan hasil scoring.

## 20.2 Verified Store Database Export

Berisi toko yang sudah menjadi Master Store.

## 20.3 Hot Lead / Qualified Lead Export

Berisi toko yang layak di-follow-up oleh KLWT/distributor lokal.

Field penting:

- Store name.
- City.
- Address.
- PIC name.
- WhatsApp number.
- Business type.
- Cooling relevance.
- Merchant Potential Score.
- Lead type.
- Main purchase driver.
- Reason to try new supplier.
- Existing supplier type.
- Notes.

## 20.4 Surveyor Performance Export

Berisi data performa dan dasar insentif.

## 20.5 Supplier & Brand Intelligence Export

Berisi rekap supplier type, brand seen, satisfaction, delivery speed, return ease, dan channel supplier existing.

## 20.6 Photo Evidence Export

Export tidak menyertakan file foto langsung, tetapi link foto:

- Storefront photo URL.
- Interior/rack photo URL.
- PIC photo URL.

---

# 21. KPI dan Insentif

Karena terdapat insentif, KPI tidak boleh hanya berbasis jumlah survey submit. KPI harus berbasis kualitas data.

## 21.1 KPI yang Direkomendasikan

| KPI | Fungsi |
|---|---|
| Submitted Visit | Mengukur produktivitas awal |
| Verified Valid Visit | Mengukur data yang benar-benar diterima |
| Valid Rate | Mengukur kualitas kerja Surveyor |
| Duplicate Rate | Mendeteksi pengulangan toko |
| Warning Rate | Mendeteksi risiko data |
| Hot Lead Count | Mengukur kualitas potensi bisnis |
| Qualified Lead Count | Mengukur peluang follow-up tambahan |
| Data Quality Average | Mengukur ketelitian Surveyor |

## 21.2 Insentif yang Aman

Insentif sebaiknya dihitung dari:

```text
Verified Valid Visit + Data Quality + Hot/Qualified Lead contribution
```

Bukan hanya:

```text
Total Submitted Visit
```

## 21.3 Anti-Fraud Signal

Sistem harus memberi warning jika:

- Banyak submit tanpa foto lengkap.
- Banyak toko dengan alamat mirip.
- Banyak nomor WA sama.
- GPS antar toko tidak masuk akal.
- Waktu antar submit terlalu cepat.
- Banyak data need revision/rejected.
- Banyak duplicate setelah verification.

---

# 22. Offline-Lite Behavior untuk Area Sinyal Buruk

Karena Surveyor memakai HP pribadi dan area visit bisa memiliki sinyal buruk, PWA perlu mendukung offline-lite.

## 22.1 Behavior

- Surveyor dapat menyimpan draft lokal.
- Foto disimpan sementara di device/browser storage jika memungkinkan.
- Saat sinyal kembali, Surveyor dapat sync draft.
- Submit final hanya berhasil jika data berhasil dikirim ke server.
- Sistem memberi status: Draft Local, Sync Pending, Submitted.

## 22.2 Risiko

- Browser storage dapat terhapus jika user clear cache.
- Foto besar bisa gagal upload.
- Perlu kompresi foto otomatis.

## 22.3 UX Message

> “Data tersimpan sementara di perangkat. Jangan hapus cache browser sebelum data berhasil tersinkron.”

---

# 23. Recommended Survey Screen Flow

## Screen 1 — Visit Start

- Planned / Unplanned.
- Store name.
- Visit outcome.
- GPS capture.

## Screen 2 — Address

- Province.
- City.
- District.
- Village.
- Detailed address.
- Landmark.

## Screen 3 — Contact

- PIC name.
- PIC type.
- WhatsApp number.
- Reason if WA empty.
- Decision maker.
- Availability.

## Screen 4 — Business Profile

- Business type.
- Vehicle specialization.
- Store scale.

## Screen 5 — Cooling Presence

- Products sold/seen.
- Shelf/stock size.
- Cooling activity.

## Screen 6 — Brand & Supplier

- Brands seen/sold.
- Product segment.
- Low cost import share.
- Supplier type.
- Supplier name optional.
- Supplier dependency.
- Satisfaction.
- Return ease.
- Delivery speed.

## Screen 7 — Commercial Behavior

- Restock frequency.
- Purchase size range optional.
- Payment method optional.
- Main purchase driver.
- Price sensitivity.

## Screen 8 — Openness

- Openness to new brand.
- Reason to try new supplier.
- Willingness to receive follow-up.

## Screen 9 — Photos & Notes

- Foto tampak depan.
- Foto dalam/rak.
- Foto dengan PIC.
- Refusal reason if missing.
- Surveyor notes.

## Screen 10 — Review & Submit

- Summary answer.
- Warning messages.
- Submit.
- Score result after submit.

---

# 24. Contoh Summary Setelah Submit untuk Surveyor

Setelah submit, Surveyor melihat ringkasan seperti:

```text
Survey Submitted

Merchant Potential: A
Data Quality: Medium Confidence
Lead Type: Hot Lead

Warning:
- Foto dalam toko tidak tersedia, alasan: toko melarang foto area dalam.

Status:
Waiting Verification
```

Jika bukan Hot Lead:

```text
Survey Submitted

Merchant Potential: B
Data Quality: High Confidence
Lead Type: Strategic Lead

Status:
Waiting Verification
```

---

# 25. Final Notes

Survey ini dirancang untuk menghasilkan data yang cukup ringkas untuk dikerjakan dalam 10–20 menit, tetapi cukup kuat untuk menjawab kebutuhan bisnis KLWT:

1. Siapa merchant cooling yang relevan?
2. Supplier dan brand apa yang saat ini menguasai pasar?
3. Toko mana yang terbuka mencoba supplier baru?
4. Toko mana yang bisa langsung di-follow-up?
5. Surveyor mana yang menghasilkan data valid?
6. Area mana yang paling potensial untuk penetrasi KLWT?

Dengan struktur ini, campaign KLWT tidak berhenti sebagai survey toko, tetapi menjadi sistem pemetaan pasar, validasi data, dan identifikasi merchant potensial untuk penetrasi cooling parts di Indonesia.
