import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'API untuk sistem peminjaman buku perpustakaan',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        BookResponse: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'JK-45' },
            title: { type: 'string', example: 'Harry Potter' },
            author: { type: 'string', example: 'J.K Rowling' },
            stock: { type: 'integer', example: 1 },
            availableQuantity: { type: 'integer', example: 1 },
          },
        },
        MemberResponse: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'M001' },
            name: { type: 'string', example: 'Angga' },
            penaltyEndDate: { type: 'string', format: 'date-time', nullable: true, example: null },
            borrowedBooksCount: { type: 'integer', example: 0 },
          },
        },
        BorrowRequest: {
          type: 'object',
          required: ['memberCode', 'bookCode'],
          properties: {
            memberCode: { type: 'string', example: 'M001' },
            bookCode: { type: 'string', example: 'JK-45' },
          },
        },
        ReturnRequest: {
          type: 'object',
          required: ['memberCode', 'bookCode'],
          properties: {
            memberCode: { type: 'string', example: 'M001' },
            bookCode: { type: 'string', example: 'JK-45' },
          },
        },
        BorrowResponse: {
          type: 'object',
          properties: {
            memberCode: { type: 'string' },
            bookCode: { type: 'string' },
            borrowedAt: { type: 'string', format: 'date-time' },
          },
        },
        ReturnResponse: {
          type: 'object',
          properties: {
            memberCode: { type: 'string' },
            bookCode: { type: 'string' },
            returnedAt: { type: 'string', format: 'date-time' },
            penalized: { type: 'boolean' },
            penaltyEndDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/api/books': {
        get: {
          tags: ['Books'],
          summary: 'List semua buku',
          description: 'Menampilkan semua buku beserta jumlah yang tersedia. Buku yang sedang dipinjam tidak dihitung dalam availableQuantity.',
          responses: {
            200: {
              description: 'Daftar buku',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/BookResponse' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/members': {
        get: {
          tags: ['Members'],
          summary: 'List semua member',
          description: 'Menampilkan semua member beserta jumlah buku yang sedang dipinjam.',
          responses: {
            200: {
              description: 'Daftar member',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/MemberResponse' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/borrowings/borrow': {
        post: {
          tags: ['Borrowings'],
          summary: 'Pinjam buku',
          description: 'Member meminjam buku. Member tidak boleh meminjam lebih dari 2 buku, buku harus tersedia, dan member tidak boleh dalam masa penalty.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BorrowRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Berhasil meminjam',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/BorrowResponse' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validasi gagal',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/borrowings/return': {
        post: {
          tags: ['Borrowings'],
          summary: 'Kembalikan buku',
          description: 'Member mengembalikan buku yang dipinjam. Jika dikembalikan lebih dari 7 hari, member mendapat penalty 3 hari.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReturnRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Berhasil mengembalikan',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/ReturnResponse' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validasi gagal',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
