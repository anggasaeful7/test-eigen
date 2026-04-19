import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('borrowings')
export class Borrowing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberCode: string;

  @Column()
  bookCode: string;

  @Column({ type: 'datetime' })
  borrowedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  returnedAt: Date | null;
}
