import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ default: 0 })
  stock: number;
}
