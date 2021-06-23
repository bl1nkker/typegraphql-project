import { EntityRepository, Repository } from "typeorm";
import { Book } from "../entity/Book";

@EntityRepository(Book)
// Exrends from Book, so it will takes all methods that Book have (save, find, findById etc.)
export class BookRepo extends Repository<Book> {
    
    // Custom method
  async findOrCreate({ id, ...data }: Partial<Book>) {
    let book = await this.findOne(id);

    if (!book) {
      book = await this.save({
        id,
        ...data
      });
    }

    return book;
  }
}