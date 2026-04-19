import { Router, Request, Response } from 'express';
import { MemberService } from '../../application/services/member.service';

export function createMemberRouter(memberService: MemberService): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const members = await memberService.getMembers();
      res.json({ data: members });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
