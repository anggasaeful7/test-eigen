import { Router, Request, Response } from 'express';
import { BorrowingService } from '../../application/services/borrowing.service';

export function createBorrowingRouter(borrowingService: BorrowingService): Router {
  const router = Router();

  router.post('/borrow', async (req: Request, res: Response) => {
    try {
      const { memberCode, bookCode } = req.body;

      if (!memberCode || !bookCode) {
        res.status(400).json({ error: 'memberCode dan bookCode wajib diisi' });
        return;
      }

      const result = await borrowingService.borrowBook({ memberCode, bookCode });
      res.status(201).json({ data: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/return', async (req: Request, res: Response) => {
    try {
      const { memberCode, bookCode } = req.body;

      if (!memberCode || !bookCode) {
        res.status(400).json({ error: 'memberCode dan bookCode wajib diisi' });
        return;
      }

      const result = await borrowingService.returnBook({ memberCode, bookCode });
      res.json({ data: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
