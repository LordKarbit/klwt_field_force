# Product Requirements Document (PRD) v2
# KLWT Field Force Survey Management System
## Cooling Parts Merchant Penetration Intelligence Platform

**Document Version:** v2.0  
**Document Type:** Product Requirements Document  
**Prepared For:** KLWT / China Aftermarket Cooling Parts Supplier  
**Market:** Indonesia Automotive Aftermarket  
**Primary Campaign Type:** Fast Coverage Market Blitz  
**Target Coverage:** 5,000 merchant visits in 1 month  
**Primary Users:** Head, Manager, Surveyor, Verificator, Administrator  
**Default Language:** Bahasa Indonesia  
**Supported Languages:** Bahasa Indonesia, English, Chinese  
**Prepared Date:** 2026-04-29  
**Status:** Requirement Locked Draft for Development Planning  

---

# 1. Executive Summary

KLWT adalah brand supplier sparepart mobil aftermarket asal China yang akan masuk ke pasar Indonesia dengan fokus awal pada lini **automotive cooling parts**, meliputi radiator, condenser, cooling fan, water pump, radiator hose, radiator cap, dan coolant accessories.

Posisi KLWT bukan sebagai brand OEM premium yang sudah dikenal luas, melainkan sebagai **challenger supplier** yang menawarkan alternatif pemasok dengan harga kompetitif, margin toko menarik, pilihan SKU cooling luas, dan peluang menjadi supplier alternatif bagi toko yang tidak puas dengan supplier existing.

Campaign dijalankan secara nasional oleh **2 Manager dan 16 Surveyor** dengan target pemetaan **5.000 toko dalam 1 bulan**. Dengan estimasi 25 hari kerja, target operasional adalah sekitar **200 toko per hari** atau rata-rata **13 toko per Surveyor per hari**.

Karena target ini menuntut speed, coverage, dan data accuracy, sistem yang dibangun tidak boleh berhenti sebagai aplikasi input survey. Sistem harus menjadi:

```text
Field Force Survey Management System
+
Cooling Supplier Penetration Intelligence Platform
+
Visit Control & Verification Engine
+
Merchant Potential Scoring System
+
Data Quality Scoring System
+
KLWT Cooling Merchant Acquisition Database
```

Dokumen PRD v2 ini menyempurnakan PRD awal dan mengunci business decisions, MVP scope, workflow, survey structure, verification logic, scoring, UX, dashboard, export, dan acceptance criteria untuk digunakan sebagai dasar development.

---

# 2. Locked Business Decisions

| Area | Final Decision |
|---|---|
| Campaign Scope | Untuk campaign KLWT cooling ini saja, bukan multi-campaign platform pada MVP |
| Geographic Scope | Nasional |
| Target | 5.000 toko dalam 1 bulan |
| Team | 2 Manager, 16 Surveyor, 1 Verificator, Head, Administrator |
| Mobile App Type | Mobile web / PWA, bukan native app |
| Device | HP pribadi Surveyor, campuran Android dan iPhone |
| Offline Need | Perlu support area sinyal buruk melalui offline-lite / draft local storage |
| Survey Duration | Minimal 10 menit, maksimal 20 menit per toko |
| Survey Logic | Pertanyaan sama untuk semua toko, tidak menggunakan branching survey pada MVP |
| Role Name in UI | Surveyor |
| Target Store Initial Data | 5.000 toko belum tersedia; database dibentuk dari discovery lapangan dan/atau import manager |
| New Store Status | Masuk Candidate Store terlebih dahulu; menjadi Master Store setelah verified |
| Assignment Basis | Kota |
| Manager Access | Manager melihat dan mengelola area/kota yang diberikan |
| Surveyor Access | Surveyor hanya melihat Today Plan, draft, history, dan store miliknya sendiri |
| Manager Reassignment | Manager boleh reassign pada hari H; sistem menyimpan log perubahan |
| Unplanned Store | Sangat diperbolehkan |
| Duplicate Credit | Credit KPI diberikan kepada Surveyor pertama yang submit valid |
| GPS Validation | Soft warning, bukan hard blocking |
| GPS Warning Radius | 100 meter untuk planned store yang sudah memiliki koordinat |
| Photo Requirement | 3 foto utama: tampak depan, dalam/rak, dengan narasumber/PIC toko |
| Photo Refusal | Boleh submit dengan alasan; masuk warning verification |
| WhatsApp Number | Optional, tetapi jika kosong wajib pilih alasan |
| Existing Supplier Name | Optional, tetapi sangat disarankan |
| Sensitive Commercial Data | Range pilihan + opsi tidak bersedia menjawab |
| Product Interest KLWT | Tidak ditanyakan pada survey MVP |
| Score Visibility | Surveyor dapat melihat score setelah submit |
| Scoring Type | Fixed formula v1 untuk MVP |
| Score Separation | Merchant Potential Score dan Data Quality Score dipisahkan |
| Hot Lead Definition | Score tinggi + toko terbuka mencoba supplier baru + nomor WA tersedia |
| Qualified Lead Definition | Score tinggi + toko terbuka mencoba supplier baru + nomor WA belum tersedia |
| Follow-up Pipeline | Tidak dibuat di MVP; output follow-up melalui export |
| Dashboard Map | Phase 2 / optional; MVP cukup chart, table, filter, export |
| Verification Priority | Utamakan submission yang memiliki warning |
| Verification SLA | Tidak diperlukan pada MVP |
| Edit Rule | Draft bebas edit; submitted terkunci; need revision bisa diedit; verified terkunci |
| Export | Wajib tersedia untuk semua data survey dan output intelligence |
| Photo Export | Export berisi link foto, bukan file foto embedded |
| Login | Username/nomor HP + password |
| OTP | Tidak diperlukan pada MVP |
| Device Restriction | Tidak perlu membatasi 1 akun 1 device |
| User Import | Diperlukan bulk import user |
| Incentive | Ada insentif; KPI harus berbasis valid verified data, bukan hanya total submit |
| Language | Indonesia default; pilihan bahasa dapat diubah di login page: Indonesia, English, Chinese |

---

# 3. Product Vision

Membangun web app dan PWA untuk mengontrol campaign nasional KLWT dalam melakukan pemetaan, validasi, supplier intelligence, dan identifikasi merchant potensial pada pasar automotive cooling parts Indonesia.

Sistem harus membantu KLWT untuk menjawab pertanyaan bisnis berikut:

1. Toko mana saja yang relevan dengan produk cooling?
2. Kota/area mana yang memiliki potensi merchant cooling tinggi?
3. Supplier dan brand cooling apa yang saat ini dominan di toko?
4. Toko mana yang terbuka mencoba supplier challenger baru?
5. Toko mana yang memiliki nomor kontak dan layak menjadi Hot Lead?
6. Surveyor mana yang produktif tetapi tetap menghasilkan data valid?
7. Data mana yang valid, warning, duplikat, atau perlu revisi?

---

# 4. Business Context

## 4.1 Market Context

KLWT masuk sebagai brand challenger di segmen aftermarket cooling parts. Target market utama bukan seluruh toko otomotif umum, tetapi merchant dengan keterkaitan terhadap replacement parts dan cooling system, seperti:

- Toko sparepart umum.
- Toko radiator / cooling specialist.
- Toko AC mobil.
- Bengkel repair.
- Specialist workshop.
- Fleet workshop.
- Distributor atau grosir sparepart yang relevan.

## 4.2 Campaign Nature

Campaign ini adalah **fast coverage market blitz**, bukan audit toko mendalam. Artinya:

- Survey harus cepat namun tetap menghasilkan data actionable.
- Data harus cukup untuk scoring dan follow-up.
- Sistem harus mendukung kerja lapangan dalam kondisi sinyal tidak stabil.
- Verification harus diprioritaskan karena hanya ada 1 verificator.
- KPI harus menghindari manipulasi karena insentif diberikan kepada Surveyor.

## 4.3 Business Problem

Tanpa sistem khusus, campaign berisiko menghadapi masalah berikut:

- Data toko tidak lengkap atau tidak valid.
- Foto dan GPS tidak tersedia sebagai evidence.
- Manager sulit mengetahui posisi progress harian.
- Surveyor berpotensi submit data tidak akurat demi mengejar target/insentif.
- Toko duplikat dihitung sebagai performa.
- Data 5.000 toko tidak dapat langsung dipakai untuk follow-up KLWT.
- Supplier intelligence tidak terstruktur.

---

# 5. Product Goals

## 5.1 Business Goals

| Goal ID | Business Goal | Success Indicator |
|---|---|---|
| BG-001 | Mencapai 5.000 toko terdata dalam 1 bulan | Minimal 5.000 submitted visits |
| BG-002 | Menghasilkan database merchant cooling nasional | Verified Master Store Database tersedia |
| BG-003 | Menentukan Hot Lead KLWT | Hot Lead export tersedia berdasarkan scoring |
| BG-004 | Memetakan supplier dan brand cooling existing | Supplier/brand intelligence dashboard tersedia |
| BG-005 | Mengontrol aktivitas Surveyor | Daily progress dashboard tersedia |
| BG-006 | Menjaga data accuracy | Verification, duplicate detection, photo/GPS evidence tersedia |
| BG-007 | Mendukung insentif yang adil | KPI berbasis verified valid visit dan quality score |

## 5.2 Product Goals

| Goal ID | Product Goal |
|---|---|
| PG-001 | Surveyor dapat submit survey toko dari HP pribadi melalui PWA |
| PG-002 | Manager dapat membuat dan mengubah visit plan berdasarkan kota |
| PG-003 | Surveyor dapat menambah unplanned store secara cepat |
| PG-004 | Sistem dapat menyimpan draft saat sinyal buruk |
| PG-005 | Sistem dapat menghitung Merchant Potential Score dan Data Quality Score otomatis |
| PG-006 | Verificator dapat memprioritaskan data dengan warning |
| PG-007 | Head dan Manager dapat melihat dashboard live |
| PG-008 | Admin dapat bulk import user, target store, dan master data |
| PG-009 | Sistem mendukung tiga bahasa: Indonesia, English, Chinese |

---

# 6. Users, Roles, and Permissions

## 6.1 Role Overview

| Role | Main Responsibility |
|---|---|
| Head | Monitoring nasional, strategic intelligence, performance review |
| Manager | Mengatur area/kota, membuat assignment, memantau Surveyor |
| Surveyor | Melakukan visit, input survey, upload foto, submit data toko |
| Verificator | Review data, prioritaskan warning, approve/reject/revision |
| Administrator | Setup user, wilayah, master data, KPI, scoring formula, export control |

## 6.2 Permission Matrix

| Feature | Head | Manager | Surveyor | Verificator | Admin |
|---|---:|---:|---:|---:|---:|
| View national dashboard | Yes | Limited | No | Limited | Yes |
| View manager dashboard | Yes | Own area | No | Limited | Yes |
| Create assignment | No | Yes | No | No | Yes |
| Reassign visit | No | Yes | No | No | Yes |
| Add unplanned store | No | No | Yes | No | Yes |
| Submit survey | No | No | Yes | No | No |
| View own score after submit | No | No | Yes | No | No |
| Verify submission | No | No | No | Yes | Yes |
| Edit verified data | No | No | No | Limited | Yes |
| Import user | No | No | No | No | Yes |
| Export data | Yes | Own area | No | Yes | Yes |
| Configure scoring | No | No | No | No | Yes |

## 6.3 Surveyor Visibility Rule

Surveyor hanya dapat melihat:

- Today Plan miliknya.
- Draft survey miliknya.
- History visit miliknya.
- Candidate Store yang dia submit.
- Score hasil submit miliknya setelah survey berhasil dikirim.

Surveyor tidak dapat melihat dashboard nasional, data Surveyor lain, daftar Hot Lead nasional, atau detail formula scoring.

---

# 7. Core Business Workflow

## 7.1 High-Level Workflow

```text
Admin setup master data, user, wilayah
↓
Manager membuat visit plan H-1 atau hari H
↓
Surveyor menerima Today Plan di PWA
↓
Surveyor melakukan planned visit atau unplanned visit
↓
Surveyor mengisi survey, foto, GPS, kontak, supplier intelligence
↓
Sistem menyimpan submission sebagai Candidate Store / Visit Submission
↓
Sistem menghitung Merchant Potential Score dan Data Quality Score
↓
Surveyor melihat score setelah submit
↓
Verificator memeriksa submission, prioritas warning
↓
Verified submission menjadi Master Store
↓
Dashboard dan export diperbarui
```

## 7.2 Visit Status Lifecycle

```text
PLANNED
↓
IN_PROGRESS
↓
DRAFT_SAVED
↓
SUBMITTED
↓
WAITING_VERIFICATION
↓
VERIFIED_VALID / NEED_REVISION / REJECTED_INVALID / DUPLICATE
```

## 7.3 Candidate Store Lifecycle

```text
CREATED_BY_SURVEYOR / IMPORTED_BY_MANAGER
↓
CANDIDATE_STORE
↓
WAITING_VERIFICATION
↓
VERIFIED_MASTER_STORE / REJECTED_STORE / MERGED_DUPLICATE
```

---

# 8. MVP Scope

## 8.1 In Scope for MVP

### Core Platform

- Responsive web app.
- PWA support.
- Login username/nomor HP + password.
- Role-based access control.
- Three-language UI: Indonesia, English, Chinese.
- Default language: Indonesia.
- Language selection on login page.

### Surveyor Mobile/PWA

- Today Plan.
- Start planned visit.
- Add unplanned store.
- Store identity and address form.
- Dropdown wilayah Indonesia: Provinsi → Kota/Kabupaten → Kecamatan → Desa/Kelurahan.
- Detail alamat dan patokan lokasi.
- GPS auto capture.
- GPS warning if distance >100m from planned coordinate.
- 3 photo upload categories.
- Photo refusal reason.
- Tap-based survey fields.
- Manual input for supplier name optional.
- Sensitive data in range format.
- Draft local save for poor signal.
- Submit when online.
- Score shown after submit.
- Visit history.

### Manager Desktop

- Dashboard area/kota.
- Import planned target store.
- Create H-1 visit plan.
- Create same-day assignment.
- Reassign Surveyor on day H.
- View Surveyor progress.
- View verification status.
- View Hot Lead and Qualified Lead in own area.

### Verificator Desktop

- Submission queue.
- Warning-priority queue.
- Photo review.
- GPS warning review.
- Duplicate warning review.
- Approve/reject/need revision/merge duplicate.

### Head Desktop

- National dashboard.
- City performance.
- Manager performance.
- Surveyor ranking.
- Merchant potential summary.
- Supplier intelligence summary.
- Export access.

### Admin Desktop

- User management.
- Bulk import user.
- Master territory data.
- Master survey option data.
- Fixed scoring formula configuration visibility.
- KPI parameter setup.
- Export management.

### Export

- All Survey Data.
- Verified Store Database.
- Hot Lead and Qualified Lead.
- Surveyor Performance.
- Supplier & Brand Intelligence.
- Raw Photo Evidence Link.

## 8.2 Out of Scope for MVP

- Native Android/iOS app.
- OTP login.
- One-account-one-device restriction.
- Follow-up CRM pipeline.
- Route optimization.
- Full map dashboard.
- Auto supplier recommendation.
- Payment/order taking.
- In-app chat.
- Multi-campaign management.
- Advanced fraud detection AI.
- OCR/image recognition of product boxes.

---

# 9. Platform and Technical Requirements

## 9.1 Platform

| Component | Requirement |
|---|---|
| Surveyor App | Mobile web/PWA |
| Manager App | Desktop responsive web |
| Head App | Desktop responsive web |
| Admin App | Desktop responsive web |
| Verificator App | Desktop responsive web |
| Supported Mobile Browser | Chrome Android, Safari iOS |
| Supported Desktop Browser | Chrome, Edge, Safari |

## 9.2 Offline-Lite Requirement

Because Surveyor may work in areas with bad signal, the PWA must support:

- Save survey as local draft before final submit.
- Store uploaded photo temporarily before retry.
- Show sync status.
- Prevent duplicate submit during retry.
- Allow Surveyor to continue filling form even if signal drops.
- Auto timestamp when visit starts and when submit happens.

Important limitation:

- Full offline map and route planning are not required.
- Offline verification is not required.

## 9.3 Authentication

Login method:

```text
Username / Phone Number + Password
```

MVP rules:

- OTP is not required.
- Email is not required for Surveyor login.
- Admin can reset password.
- Login log is stored.
- Device restriction is not required.

## 9.4 Language

Supported language:

```text
Bahasa Indonesia
English
Chinese
```

Rules:

- Default language is Bahasa Indonesia.
- User can change language from login page.
- Language preference should be stored after login.
- Survey option labels must support multilingual display.
- Export may use Bahasa Indonesia as default unless configured otherwise.

---

# 10. Manager Assignment Requirement

## 10.1 Assignment Concept

Because 5.000 target stores are not initially available, assignment can come from:

1. Manager manually adding target store.
2. Manager bulk importing target store.
3. Surveyor adding unplanned store in the field.
4. Existing Candidate Store needing revisit.
5. Existing verified Master Store needing recheck.

## 10.2 Assignment Fields

| Field | Required | Notes |
|---|---:|---|
| Visit Date | Yes | Date of planned visit |
| Assigned Surveyor | Yes | User with Surveyor role |
| Store Name | Yes | Manual or imported |
| Province | Yes | Dropdown |
| City/Regency | Yes | Dropdown |
| District/Kecamatan | Yes | Dropdown |
| Village/Kelurahan | Yes | Dropdown |
| Address Detail | Yes | Free text |
| Location Landmark | Yes | Free text |
| GPS Coordinate | Optional | If available; otherwise first visit captures coordinate |
| Visit Priority | Optional | Low/Medium/High |
| Visit Objective | Optional | Survey, revisit, verify, special lead |
| Notes | Optional | Manager instruction |

## 10.3 Assignment Rules

- Manager can assign only within assigned city/area.
- Manager can reassign on day H.
- Reassignment must create audit log.
- Surveyor sees only his/her own assignment.
- If planned store has no coordinate, GPS captured during visit becomes proposed coordinate.
- If planned store has coordinate, system shows warning if submit location is >100m from target coordinate.

## 10.4 Bulk Import Target Store Template

```text
store_name
province
city_regency
district
village
address_detail
landmark
latitude
longitude
assigned_manager
assigned_surveyor
visit_date
priority
notes
```

Required minimum for import:

```text
store_name
province
city_regency
address_detail
assigned_surveyor
visit_date
```

---

# 11. Surveyor Mobile/PWA UX

## 11.1 UX Principle

```text
Tap, Capture, Submit
```

Rules:

- Big buttons.
- Minimal typing.
- One screen should focus on one task.
- Works on small phones.
- Clear progress indicator.
- Auto-save draft.
- Simple warning messages.
- No complex table on mobile.

## 11.2 Mobile Main Menu

```text
[Today Plan] [Add Store] [Draft] [History] [Profile]
```

## 11.3 Surveyor Flow

```text
Login
↓
Select language if needed
↓
Today Plan / Add Store
↓
Start Visit
↓
Capture GPS and timestamp
↓
Store Identity & Address
↓
Photo Evidence
↓
Business Categorization
↓
Cooling Presence Observation
↓
Supplier & Brand Intelligence
↓
Purchase & Decision Maker
↓
Openness to KLWT Challenger Supplier
↓
Optional Commercial Range Questions
↓
Review Summary
↓
Submit
↓
Show Merchant Potential Score + Data Quality Score
```

## 11.4 Surveyor Score Display After Submit

After successful submit, Surveyor sees:

```text
Survey Submitted
Merchant Potential: A / B / C / D
Lead Category: Hot Lead / Qualified Lead / Normal / Low Priority
Data Quality: Good / Warning / Poor
```

Surveyor must not see detailed scoring formula or exact weight configuration.

---

# 12. Visit Outcome and Skip Reasons

Before full survey, Surveyor must choose outcome if the store cannot be surveyed.

## 12.1 Visit Outcome

```text
SURVEY_COMPLETED
STORE_CLOSED
ADDRESS_NOT_FOUND
STORE_MOVED
REFUSED_SURVEY
NOT_RELEVANT_STORE
DUPLICATE_FOUND
NEED_REVISIT
```

## 12.2 Rules

- `SURVEY_COMPLETED` requires survey form.
- `STORE_CLOSED` requires photo if possible and GPS.
- `ADDRESS_NOT_FOUND` requires GPS and notes.
- `REFUSED_SURVEY` requires reason.
- `NOT_RELEVANT_STORE` requires business type or notes.
- Skip outcome still counts as attempted visit, not valid survey.
- Incentive should use verified valid survey, not only attempted visit.

---

# 13. Store Identity and Address Form

## 13.1 Required Fields

| Field | Required | Input Type |
|---|---:|---|
| Store Name | Yes | Text |
| Province | Yes | Dropdown |
| City/Regency | Yes | Dropdown dependent |
| District/Kecamatan | Yes | Dropdown dependent |
| Village/Kelurahan | Yes | Dropdown dependent |
| Address Detail | Yes | Text area |
| Landmark / Patokan Lokasi | Yes | Text |
| GPS Latitude | Auto | Device GPS |
| GPS Longitude | Auto | Device GPS |
| Contact Person Name | Optional | Text |
| Contact Person Role | Required if contact filled | Owner / Employee |
| WhatsApp Number | Optional | Phone input |
| WA Empty Reason | Required if WA empty | Dropdown |

## 13.2 WhatsApp Empty Reason

```text
Owner/PIC menolak memberi nomor
Owner/PIC tidak tersedia
Toko tidak memiliki nomor WA bisnis
Akan diberikan saat revisit
Lainnya
```

If `Lainnya` is selected, Surveyor must fill explanation text.

---

# 14. Photo Evidence Requirement

## 14.1 Required Photo Categories

| Photo | Description |
|---|---|
| Store Front Photo | Foto tampak depan toko |
| Inside/Shelf Photo | Foto dalam toko / rak / display sparepart |
| PIC Photo | Foto dengan narasumber / PIC toko |

## 14.2 PIC Photo Options

For PIC photo, Surveyor must choose:

```text
Owner
Karyawan
```

## 14.3 Photo Missing Rules

- Minimum 1 photo required for completed survey: store front photo.
- If inside/shelf photo is missing, Surveyor must choose missing reason.
- If PIC photo is missing, Surveyor must choose missing reason.
- If all photos are missing, cannot submit completed survey.
- All missing photo cases create verification warning.

## 14.4 Photo Refusal Reasons

```text
Owner/PIC menolak foto orang
Toko melarang foto area dalam
Toko sedang ramai
Alasan keamanan/privasi
Lainnya
```

If `Lainnya` is selected, Surveyor must fill explanation text.

## 14.5 Photo Export

Export file contains photo URLs/links, not embedded image files.

---

# 15. Survey Form Final Draft

Survey must be the same for all stores. It should be tap-based, range-based, and optimized for 10–20 minutes per store.

## 15.1 Section A — Business Type

**Question:** Jenis usaha utama toko?

Options:

```text
General Sparepart Retail
Wholesale Sparepart Distributor
Workshop / Repair Garage
Specialist Workshop
Cooling Specialist / Radiator Shop
AC & Cooling Specialist
Multi-Service Auto Center
Fleet / Commercial Workshop
Other Automotive Merchant
```

## 15.2 Section B — Vehicle Specialization

**Question:** Fokus kendaraan yang paling sering dilayani/dijual?

Options:

```text
Japanese Passenger Car
European Passenger Car
Korean Passenger Car
Chinese Car
SUV/4x4
Commercial Van/Pickup
Diesel/Truck
Universal Mixed
```

## 15.3 Section C — Cooling Products Seen

**Question:** Produk cooling apa yang terlihat atau dijual toko?

Multi-select:

```text
Radiator
Condenser
Cooling Fan
Water Pump
Radiator Hose
Radiator Cap
Coolant Accessories
Tidak terlihat produk cooling
```

## 15.4 Section D — Cooling Shelf Size Estimate

**Question:** Estimasi ukuran display/stok cooling?

Options:

```text
Tidak terlihat cooling parts
Sedikit
Sedang
Banyak / Dominan
```

## 15.5 Section E — Cooling Sales Activity

**Question:** Seberapa sering toko menjual/melayani produk cooling?

Options:

```text
Jarang
Kadang
Cukup rutin
Sangat rutin
Tidak tahu
```

## 15.6 Section F — Cooling Brand Boxes Seen

**Question:** Brand cooling apa yang terlihat?

Multi-select:

```text
Denso
Koyorad
TYC
GMB
Aisin
Astra/Aspira
Sakura
Generic China
Local No Brand
Lainnya
Tidak terlihat
```

If `Lainnya`, allow manual input.

## 15.7 Section G — Current Product Selling Segment

**Question:** Segment produk yang paling dominan dijual?

Options:

```text
Genuine Premium Dominant
OEM Trusted Dominant
Mid Aftermarket Mixed
Economy/Low Cost Dominant
Campuran seimbang
Tidak tahu
```

## 15.8 Section H — Existing Low Cost Import Share

**Question:** Seberapa besar produk import low-cost di toko?

Options:

```text
Tidak ada
Sedikit
Campuran
Dominan
Tidak tahu
```

## 15.9 Section I — Current Cooling Supplier Type

**Question:** Biasanya toko mendapatkan produk cooling dari mana?

Multi-select:

```text
Sales distributor datang
Grosir langganan
Importir
Marketplace
Ambil sendiri
Campur
Tidak tahu / tidak bersedia menjawab
```

## 15.10 Section J — Existing Supplier Name

**Question:** Nama supplier cooling existing?

Input:

```text
Text optional, sangat disarankan
```

## 15.11 Section K — Primary Supplier Dependency

**Question:** Ketergantungan toko terhadap supplier existing?

Options:

```text
Sangat tergantung 1 supplier
2–3 supplier tetap
Supplier campuran fleksibel
Opportunistic buyer
Tidak tahu
```

## 15.12 Section L — Payment Method Existing Supplier

**Question:** Metode pembayaran yang biasa digunakan?

Multi-select:

```text
CBD / transfer dulu
COD barang datang
Tempo 7 hari
Tempo 14 hari
Tempo 30 hari+
Campur / konsinyasi
Tidak bersedia menjawab
Tidak tahu
```

## 15.13 Section M — Existing Supplier Return Ease

**Question:** Seberapa mudah retur ke supplier existing?

Options:

```text
Sangat mudah
Cukup mudah
Agak sulit
Sulit / hampir tidak bisa
Tidak tahu
```

## 15.14 Section N — Existing Supplier Delivery Speed

**Question:** Kecepatan pengiriman supplier existing?

Options:

```text
Hari yang sama
Besok
2–3 hari
Lebih lama / inden
Tidak tahu
```

## 15.15 Section O — Existing Supplier Satisfaction

**Question:** Kepuasan terhadap supplier existing?

Options:

```text
Sangat puas
Cukup puas
Banyak keluhan
Sedang cari alternatif
Tidak tahu
```

## 15.16 Section P — Cooling Restock Frequency

**Question:** Seberapa sering toko restock produk cooling?

Options:

```text
Hampir tiap hari
Mingguan
Bulanan
Hanya saat ada permintaan
Tidak tahu
```

## 15.17 Section Q — Average Cooling Purchase Size

**Question:** Estimasi pembelian cooling per transaksi/restock?

Options:

```text
Kecil
Sedang
Besar
Tidak bersedia menjawab
Tidak tahu
```

## 15.18 Section R — Estimated Monthly Cooling Purchase Value

**Question:** Estimasi nilai pembelian produk cooling per bulan?

Options:

```text
< Rp1 juta
Rp1–5 juta
Rp5–10 juta
Rp10–25 juta
> Rp25 juta
Tidak bersedia menjawab
Tidak tahu
```

## 15.19 Section S — Estimated Margin Expectation

**Question:** Ekspektasi margin toko untuk produk cooling?

Options:

```text
< 10%
10–15%
16–25%
> 25%
Tidak bersedia menjawab
Tidak tahu
```

## 15.20 Section T — Purchasing Decision Maker

**Question:** Siapa pengambil keputusan pembelian?

Options:

```text
Owner
Anak owner / family
Kepala toko
Mekanik
Staff pembelian
Tidak tahu
```

## 15.21 Section U — Decision Maker Availability

**Question:** Kapan decision maker biasanya tersedia?

Options:

```text
Selalu ada
Pagi saja
Sore saja
By phone/WA
Jarang datang
Tidak tahu
```

## 15.22 Section V — Current Order Method

**Question:** Cara order yang biasa dilakukan toko?

Multi-select:

```text
Didatangi sales canvasser
Order WhatsApp
Telepon
Marketplace
Ambil sendiri
Campur
Tidak tahu
```

## 15.23 Section W — Store Price Sensitivity

**Question:** Seberapa sensitif toko terhadap harga?

Options:

```text
Sangat harga
Harga & kualitas seimbang
Lebih cari merk terkenal
Tidak tahu
```

## 15.24 Section X — Openness to New Alternative Brand

**Question:** Apakah toko terbuka mencoba brand/supplier baru?

Options:

```text
Sangat terbuka
Bisa coba
Hanya merk tertentu
Tidak suka coba baru
Tidak tahu
```

## 15.25 Section Y — Main Purchase Driver

**Question:** Faktor utama saat memilih produk/supplier?

Multi-select max 3:

```text
Harga murah
Margin besar
Brand terkenal
Kualitas stabil
Barang lengkap
Fast delivery
Retur mudah
Tempo pembayaran
```

## 15.26 Section Z — Main Reason to Try New Supplier

**Question:** Alasan utama yang membuat toko mau mencoba supplier baru?

Multi-select max 3:

```text
Harga lebih murah
Margin lebih besar
Barang lebih lengkap
Tempo lebih enak
Retur lebih gampang
Pengiriman cepat
Kualitas stabil
Tidak tertarik
```

---

# 16. Scoring System v1

System must calculate two separate scores:

```text
Merchant Potential Score
Data Quality Score
```

## 16.1 Merchant Potential Score

Purpose:

- Determine store potential for KLWT.
- Support market mapping.
- Identify Hot Lead and Qualified Lead.
- Prioritize export for KLWT/distributor follow-up.

### 16.1.1 Score Factors

| Factor | Weight | Notes |
|---|---:|---|
| Cooling Relevance | 25% | Based on business type, products seen, shelf size, activity |
| Low Cost / Import Acceptance | 15% | Based on low-cost share and selling segment |
| Supplier Dissatisfaction | 15% | Based on satisfaction, return difficulty, delivery issue |
| Purchase Frequency & Size | 15% | Restock frequency and purchase range |
| Openness to New Supplier | 20% | Openness and reason to try new supplier |
| Contactability | 10% | WA available and decision maker reachable |

Total: 100%.

### 16.1.2 Merchant Potential Grade

| Score Range | Grade | Meaning |
|---:|---|---|
| 85–100 | A+ | Very High Potential |
| 70–84 | A | High Potential |
| 55–69 | B | Medium Potential |
| 40–54 | C | Low Potential |
| <40 | D | Not Priority |

## 16.2 Data Quality Score

Purpose:

- Measure confidence in the submitted data.
- Support verification priority.
- Reduce incentive manipulation.

### 16.2.1 Data Quality Factors

| Factor | Weight |
|---|---:|
| Required fields complete | 25% |
| Minimum photo evidence available | 20% |
| GPS captured and reasonable | 20% |
| WA/contact info completeness | 10% |
| Supplier/brand info completeness | 10% |
| No duplicate warning | 10% |
| No excessive unknown/refused answers | 5% |

### 16.2.2 Data Quality Grade

| Score Range | Grade | Meaning |
|---:|---|---|
| 80–100 | Good | Strong data confidence |
| 60–79 | Warning | Needs review |
| <60 | Poor | High risk / verify carefully |

## 16.3 Lead Classification

| Classification | Rule |
|---|---|
| Hot Lead | Merchant grade A/A+ + openness `Sangat terbuka` or `Bisa coba` + WA available |
| Qualified Lead | Merchant grade A/A+ + openness `Sangat terbuka` or `Bisa coba` + WA not available |
| Strategic Lead | High cooling relevance but openness low/unknown |
| Normal Lead | Grade B or medium relevance |
| Low Priority | Grade C/D or low relevance |

## 16.4 Score Visibility

- Surveyor sees grade and classification after submit.
- Surveyor does not see formula/weight details.
- Manager, Head, Verificator, and Admin can see score breakdown.

---

# 17. Verification Workflow

## 17.1 Verification Priority

Because there is only 1 verificator, queue priority is essential.

Priority order:

1. Submissions with warning.
2. Potential Hot Lead / Qualified Lead.
3. GPS warning >100m.
4. Missing photo reason.
5. Duplicate warning.
6. High unknown/refused answer count.
7. Normal submissions.

## 17.2 Verification Checklist

Verificator checks:

- Store name validity.
- Address completeness.
- GPS location consistency.
- Photo evidence.
- PIC photo or missing reason.
- WA empty reason if WA missing.
- Duplicate candidate.
- Cooling observation vs photo.
- Supplier/brand information consistency.
- Suspicious answer pattern.

## 17.3 Verification Decisions

```text
VERIFIED_VALID
NEED_REVISION
REJECTED_INVALID
MERGED_DUPLICATE
```

## 17.4 Revision Rules

- Draft: Surveyor can edit freely.
- Submitted: locked for Surveyor.
- Need Revision: Surveyor can edit requested fields.
- Verified: locked for Surveyor.
- Admin/Verificator can correct data with audit log.

## 17.5 Duplicate Rules

Potential duplicate indicators:

- Same/similar store name.
- Same phone/WA.
- Nearby GPS.
- Similar address.

KPI credit:

- If duplicate is found, verified credit goes to first valid Surveyor submission.
- Later duplicate may count as attempted visit but not verified valid visit.

---

# 18. KPI and Incentive Logic

Because Surveyor receives incentives, KPI must encourage valid data, not just high quantity.

## 18.1 Recommended KPI Metrics

| KPI | Description | Use for Incentive? |
|---|---|---|
| Submitted Visit | Total submitted survey | Supporting only |
| Verified Valid Visit | Submission approved by verificator | Yes |
| Valid Rate | Verified valid / submitted | Yes |
| Hot Lead Count | Hot Leads produced | Yes, with validation |
| Qualified Lead Count | Qualified Leads produced | Optional |
| Duplicate Rate | Duplicate submission rate | Negative modifier |
| Warning Rate | Submission with warning | Negative modifier if excessive |
| Data Quality Average | Average Data Quality Score | Yes |
| GPS Warning Count | >100m warning | Negative modifier if excessive |
| Missing Photo Count | Missing photo with reason | Monitor |

## 18.2 Incentive Principle

Incentive should be based on:

```text
Verified Valid Visits
+
Data Quality Score
+
Hot Lead / Qualified Lead output
-
Duplicate / Invalid / Warning penalty
```

Avoid incentive based only on raw submitted count.

## 18.3 Suggested Incentive Export Fields

```text
surveyor_id
surveyor_name
submitted_count
verified_valid_count
rejected_count
duplicate_count
warning_count
hot_lead_count
qualified_lead_count
average_merchant_score
average_data_quality_score
valid_rate
```

---

# 19. Dashboard Requirements

## 19.1 Manager Dashboard

Focus: daily operational control.

Widgets:

- Today target vs completed.
- Surveyor progress list.
- Planned vs unplanned visits.
- Pending submission.
- Warning count.
- Verification status.
- City progress.
- Hot Lead and Qualified Lead in area.
- Top/bottom Surveyor by verified valid count.

Filters:

```text
Date
City
Surveyor
Visit status
Verification status
Lead classification
Data quality grade
```

## 19.2 Head Dashboard

Focus: national business intelligence.

Widgets:

- National coverage progress.
- Progress by city.
- Progress by manager.
- Merchant potential distribution.
- Hot Lead / Qualified Lead count.
- Cooling relevance distribution.
- Supplier type distribution.
- Brand seen distribution.
- Openness to new supplier.
- Price sensitivity.
- Data quality trend.
- Surveyor leaderboard.

## 19.3 Verificator Dashboard

Focus: queue and data quality.

Widgets:

- Pending verification.
- Warning queue.
- Duplicate candidate queue.
- Missing photo queue.
- GPS warning queue.
- Need revision queue.
- Rejected data summary.

## 19.4 Admin Dashboard

Focus: system configuration and data control.

Widgets:

- User count by role.
- Active/inactive users.
- Import status.
- Master data status.
- Export jobs.
- Error logs.

## 19.5 Map Dashboard

Map view is **out of MVP** and categorized as Phase 2 / optional.

MVP dashboard should use:

```text
Charts
Tables
Filters
Export
```

---

# 20. Export Requirements

## 20.1 Required Exports

| Export | Description |
|---|---|
| All Survey Data | Raw survey submission data |
| Verified Store Database | Store records that passed verification |
| Hot Lead / Qualified Lead | Prioritized lead list for KLWT/distributor follow-up |
| Surveyor Performance | KPI and incentive-supporting export |
| Supplier & Brand Intelligence | Supplier type, supplier name, brand seen, satisfaction, payment, delivery |
| Raw Photo Evidence Link | Photo URL/link for validation |

## 20.2 Export Format

- Excel `.xlsx` preferred.
- CSV optional.
- Photo included as URL/link.
- Export filterable by date, city, manager, Surveyor, verification status, lead classification.

## 20.3 Hot Lead Export Fields

```text
store_id
store_name
province
city_regency
district
village
address_detail
landmark
latitude
longitude
contact_person_name
contact_person_role
whatsapp_number
business_type
cooling_relevance
merchant_potential_score
merchant_grade
data_quality_score
data_quality_grade
lead_classification
openness_to_new_supplier
main_reason_to_try_new_supplier
supplier_type
supplier_name
brand_seen
restock_frequency
estimated_monthly_purchase_value
survey_date
surveyor_name
manager_name
photo_front_url
photo_inside_url
photo_pic_url
verification_status
```

---

# 21. Data Model v1

## 21.1 Main Entities

```text
User
Role
Territory
Campaign
Assignment
Visit
CandidateStore
MasterStore
SurveyResponse
PhotoEvidence
Verification
ScoreResult
ExportJob
AuditLog
```

Although MVP is single campaign, include `campaign_id` for database cleanliness and future extensibility.

## 21.2 User Fields

```text
id
name
username
phone_number
password_hash
role
manager_id
assigned_city
language_preference
status
created_at
updated_at
```

## 21.3 Candidate Store Fields

```text
id
campaign_id
store_name
province_id
city_id
district_id
village_id
address_detail
landmark
latitude
longitude
contact_person_name
contact_person_role
whatsapp_number
wa_empty_reason
wa_empty_reason_other
created_by_surveyor_id
assigned_manager_id
status
created_at
updated_at
```

## 21.4 Master Store Fields

```text
id
candidate_store_id
store_name
province_id
city_id
district_id
village_id
address_detail
landmark
latitude
longitude
contact_person_name
contact_person_role
whatsapp_number
business_type
cooling_relevance_grade
merchant_potential_score
merchant_grade
data_quality_score
data_quality_grade
lead_classification
verified_by
verified_at
created_at
updated_at
```

## 21.5 Visit Fields

```text
id
campaign_id
assignment_id
candidate_store_id
surveyor_id
manager_id
visit_date
visit_start_time
submit_time
visit_outcome
status
planned_or_unplanned
gps_latitude
gps_longitude
gps_accuracy
gps_warning_flag
gps_distance_from_target
notes
created_at
updated_at
```

## 21.6 Photo Evidence Fields

```text
id
visit_id
photo_type
photo_url
is_missing
missing_reason
missing_reason_other
pic_role
uploaded_at
```

## 21.7 Verification Fields

```text
id
visit_id
candidate_store_id
verification_status
warning_flags
verificator_id
verification_notes
revision_request
verified_at
created_at
updated_at
```

## 21.8 Score Result Fields

```text
id
visit_id
candidate_store_id
merchant_potential_score
merchant_grade
data_quality_score
data_quality_grade
lead_classification
score_breakdown_json
created_at
updated_at
```

---

# 22. Validation and Warning Rules

## 22.1 GPS Warning

- If planned store has coordinate and submission is >100m from target, set `gps_warning_flag = true`.
- Submission is still allowed.
- Warning appears in verificator queue.

## 22.2 Photo Warning

- Missing inside/shelf photo triggers warning.
- Missing PIC photo triggers warning.
- Missing all photos blocks completed survey.
- Missing store front photo blocks completed survey.

## 22.3 WA Warning

- Missing WA does not block submit.
- Missing WA requires reason.
- Store cannot become Hot Lead without WA.
- Store can become Qualified Lead without WA.

## 22.4 Duplicate Warning

System should flag possible duplicate based on:

- Similar store name.
- Same phone number.
- Nearby GPS.
- Similar address.

Duplicate warning does not block submit.

## 22.5 Unknown/Refused Answer Warning

If too many answers are `Tidak tahu` or `Tidak bersedia menjawab`, system should reduce Data Quality Score and add warning if above threshold.

Recommended threshold:

```text
More than 30% unknown/refused answers = warning
```

---

# 23. Non-Functional Requirements

## 23.1 Performance

- Mobile survey screens should load within 3 seconds on normal 4G.
- Dashboard tables should support pagination.
- Export jobs should run asynchronously if large.
- Photo upload should compress image before upload.

## 23.2 Usability

- Surveyor app must be usable by non-technical users.
- Buttons must be large enough for mobile use.
- Input fields must avoid unnecessary typing.
- Error messages must be clear.
- Form progress must be visible.

## 23.3 Security

- Passwords must be hashed.
- Role-based access control required.
- Surveyor cannot access other Surveyor data.
- Manager cannot access unassigned cities unless permitted.
- Admin actions must be logged.

## 23.4 Data Privacy

- Phone numbers and photos are sensitive operational data.
- Access should be limited by role.
- Export access should be limited to Head, Manager, Verificator, Admin based on scope.

## 23.5 Reliability

- Local draft must reduce risk of data loss in bad signal areas.
- Duplicate submit prevention required.
- Submit retry mechanism required.

---

# 24. Acceptance Criteria

## 24.1 Surveyor Mobile/PWA

- Surveyor can login using username/phone and password.
- Surveyor can select language from login page.
- Surveyor sees Today Plan assigned to him/her.
- Surveyor can add unplanned store.
- Surveyor can fill province, city, district, village using dropdown.
- Surveyor can save draft when signal is weak.
- Surveyor can upload required photos.
- Surveyor can submit with photo refusal reason where applicable.
- Surveyor can submit with GPS warning.
- Surveyor sees score after submit.

## 24.2 Manager

- Manager can create assignment.
- Manager can bulk import target stores.
- Manager can reassign on day H.
- Manager sees own area/city progress.
- Manager sees verification status.
- Manager sees Hot Lead and Qualified Lead for own area.

## 24.3 Verificator

- Verificator sees warning queue first.
- Verificator can review photo links.
- Verificator can approve, reject, request revision, or merge duplicate.
- Verified data becomes Master Store.
- Need revision unlocks specific data for Surveyor edit.

## 24.4 Admin

- Admin can bulk import users.
- Admin can manage role and territory.
- Admin can manage master survey options.
- Admin can export required data.
- Admin can view audit log.

## 24.5 Scoring

- System calculates Merchant Potential Score after submit.
- System calculates Data Quality Score after submit.
- System classifies Hot Lead and Qualified Lead according to rule.
- Surveyor can see grade/classification but not formula weight.

## 24.6 Export

- Export All Survey Data works.
- Export Verified Store Database works.
- Export Hot Lead / Qualified Lead works.
- Export Surveyor Performance works.
- Export Supplier & Brand Intelligence works.
- Export includes photo URLs.

---

# 25. UAT Scenarios

## 25.1 Planned Visit Normal Case

```text
Manager assigns store to Surveyor
Surveyor opens Today Plan
Surveyor starts visit
GPS captured within 100m
Surveyor fills survey
Surveyor uploads 3 photos
Surveyor submits
System calculates score
Verificator approves
Store becomes Master Store
```

## 25.2 GPS Warning Case

```text
Planned store has coordinate
Surveyor submits from >100m distance
System allows submit
System marks GPS warning
Verificator reviews warning
```

## 25.3 Missing WA Case

```text
Surveyor leaves WA empty
System requires reason
Surveyor selects reason
Store cannot become Hot Lead
If score high and openness good, store becomes Qualified Lead
```

## 25.4 Missing Photo Case

```text
Surveyor uploads store front photo
Surveyor cannot upload PIC photo
Surveyor selects refusal reason
Submission allowed
Data Quality Score reduced
Verification warning created
```

## 25.5 Duplicate Case

```text
Surveyor A submits store first
Surveyor B submits similar store later
System flags duplicate candidate
Verificator merges duplicate
Surveyor A receives valid credit
Surveyor B receives attempted visit but not verified valid credit
```

## 25.6 Need Revision Case

```text
Verificator finds incomplete address detail
Verificator marks Need Revision
Surveyor can edit requested field
Surveyor resubmits
Verificator approves
```

## 25.7 Offline-Lite Case

```text
Surveyor starts survey in bad signal area
Survey is saved as local draft
Photos are queued
Surveyor reconnects later
System uploads and submits without duplicate
```

---

# 26. Open Items for Development Team

These are not business questions, but implementation decisions for technical planning:

1. Select cloud storage for photo evidence.
2. Select database and backend framework.
3. Select Indonesia administrative region dataset source.
4. Define image compression size and quality.
5. Define export job handling for large data.
6. Define exact UI translation key structure.
7. Define map/dashboard Phase 2 feasibility.
8. Define exact incentive formula outside product scoring.

---

# 27. Recommended Development Priority

## Sprint 1 — Foundation

- Auth and role.
- Language selection.
- User management.
- Territory master.
- Surveyor PWA shell.
- Manager assignment basic.

## Sprint 2 — Survey & Evidence

- Store identity form.
- Address dropdown.
- GPS capture.
- Photo upload.
- Survey form.
- Draft local storage.

## Sprint 3 — Verification & Scoring

- Submission queue.
- Warning flags.
- Verification decisions.
- Merchant Potential Score.
- Data Quality Score.
- Lead classification.

## Sprint 4 — Dashboard & Export

- Manager dashboard.
- Head dashboard.
- Surveyor performance.
- Export files.
- UAT fixes.

---

# 28. Summary

PRD v2 mengunci sistem KLWT sebagai platform operasional untuk campaign nasional pemetaan dan penetrasi merchant cooling parts. Sistem dirancang untuk mendukung campaign cepat 5.000 toko dalam 1 bulan, menggunakan PWA untuk Surveyor, dashboard desktop untuk Manager/Head/Verificator/Admin, serta scoring otomatis untuk menghasilkan Hot Lead dan Qualified Lead.

Fokus utama MVP adalah:

```text
Speed
Coverage
Data Accuracy
Photo & GPS Evidence
Supplier Intelligence
Merchant Potential Scoring
Data Quality Scoring
Verified Export for Follow-up
```

Sistem ini tidak hanya mengumpulkan data survey, tetapi menjadi alat kontrol field force, alat validasi data, alat market intelligence, dan alat prioritisasi merchant potensial KLWT.
