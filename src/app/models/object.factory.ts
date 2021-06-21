import { Clothes } from "./clothes";
import { Comic } from "./comic";
import { Figure } from "./figure";
import { PostComment } from "./comment";

export class ObjectFactory {
  static comicFromObject(rawComic: any): Comic {
    const date = (rawComic.publish_date != '' && rawComic.publish_date.toString().includes('/'))
        ? new Date(rawComic.publish_date.split('/').reverse().join('-'))
        : ((rawComic.publish_date != '') ? new Date(rawComic.publish_date) : null);

    return new Comic(
      +rawComic.id,
      rawComic.owner,
      rawComic.post_type,
      rawComic.title,
      rawComic.description,
      rawComic.image,
      rawComic.type,
      rawComic.author,
      +rawComic.age,
      +rawComic.isbn,
      +rawComic.pages,
      rawComic.publisher,
      date,
      +rawComic.price
    );
  }

  static figureFromObject(rawFigure: any): Figure {
    return new Figure(
      +rawFigure.id,
      rawFigure.owner,
      rawFigure.post_type,
      rawFigure.title,
      rawFigure.description,
      rawFigure.image,
      rawFigure.size,
      +rawFigure.price,
    )
  }

  static clothesFromObject(rawClothes: any): Clothes {
    return new Clothes(
      +rawClothes.id,
      rawClothes.owner,
      rawClothes.post_type,
      rawClothes.title,
      rawClothes.description,
      rawClothes.image,
      rawClothes.type,
      rawClothes.size,
      +rawClothes.price,
    )
  }

  static commentFromObject(rawComment: any): PostComment {
    const date = new Date(rawComment.comment_date);
    return new PostComment(
      +rawComment.comment_ID,
      +rawComment.comment_post_ID,
      rawComment.comment_author,
      date,
      rawComment.comment_content,
      +rawComment.user_id,
    );
  }
}
