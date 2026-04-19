# Library API - Backend

Sistem peminjaman buku perpustakaan menggunakan ExpressJS, TypeScript, TypeORM, dan SQLite.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: SQLite (via TypeORM)
- **Documentation**: Swagger (swagger-jsdoc + swagger-ui-express)
- **Testing**: Jest + ts-jest
- **Architecture**: Domain-Driven Design (DDD)

## Struktur Proyek

```
src/
├── modules/
│   ├── book/           # Bounded context untuk buku
│   ├── member/         # Bounded context untuk member
│   └── borrowing/      # Bounded context untuk peminjaman
├── config/             # Database & Swagger config
├── database/           # Seed data
├── container.ts        # Dependency injection
├── app.ts              # Express app setup
└── main.ts             # Entry point
```

Setiap module memiliki layer:
- **domain/**: Entity, repository interface, domain service (business rules)
- **application/**: Application service (orchestration), DTO
- **infrastructure/**: TypeORM repository implementation
- **interfaces/**: Express router (HTTP layer)

## Menjalankan

```bash
npm install
npm run dev
```

Server jalan di `http://localhost:3000`
Swagger docs di `http://localhost:3000/api-docs`

## API Endpoints

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | /api/books | List buku beserta jumlah tersedia |
| GET | /api/members | List member beserta jumlah buku dipinjam |
| POST | /api/borrowings/borrow | Pinjam buku |
| POST | /api/borrowings/return | Kembalikan buku |

## Business Rules

**Peminjaman:**
- Member tidak boleh meminjam lebih dari 2 buku
- Buku yang sedang dipinjam tidak bisa dipinjam member lain
- Member yang sedang kena penalty tidak bisa meminjam

**Pengembalian:**
- Buku yang dikembalikan harus buku yang dipinjam member tersebut
- Jika dikembalikan lebih dari 7 hari, member kena penalty 3 hari

## Testing

```bash
npm test
```

## Build

```bash
npm run build
npm start
```
