import { DataSource } from 'typeorm';
import { Book } from '../modules/book/domain/entities/book.entity';
import { Member } from '../modules/member/domain/entities/member.entity';

const booksData = [
  { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 },
  { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 },
  { code: 'TW-11', title: 'Twilight', author: 'Stephenie Meyer', stock: 1 },
  { code: 'HOB-83', title: 'The Hobbit, or There and Back Again', author: 'J.R.R. Tolkien', stock: 1 },
  { code: 'NRN-7', title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', stock: 1 },
];

const membersData = [
  { code: 'M001', name: 'Angga' },
  { code: 'M002', name: 'Ferry' },
  { code: 'M003', name: 'Putri' },
];

export async function seedDatabase(dataSource: DataSource): Promise<void> {
  const bookRepo = dataSource.getRepository(Book);
  const memberRepo = dataSource.getRepository(Member);

  const bookCount = await bookRepo.count();
  if (bookCount === 0) {
    const books = booksData.map((data) => {
      const book = new Book();
      book.code = data.code;
      book.title = data.title;
      book.author = data.author;
      book.stock = data.stock;
      return book;
    });
    await bookRepo.save(books);
    console.log('Seeded books data');
  }

  const memberCount = await memberRepo.count();
  if (memberCount === 0) {
    const members = membersData.map((data) => {
      const member = new Member();
      member.code = data.code;
      member.name = data.name;
      member.penaltyEndDate = null;
      return member;
    });
    await memberRepo.save(members);
    console.log('Seeded members data');
  }
}
