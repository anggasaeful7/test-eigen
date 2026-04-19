import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'datetime', nullable: true })
  penaltyEndDate: Date | null;
}
