import { Router, Request, Response } from 'express';
import { BookService } from '../../application/services/book.service';

export function createBookRouter(bookService: BookService): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const books = await bookService.getBooks();
      res.json({ data: books });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
