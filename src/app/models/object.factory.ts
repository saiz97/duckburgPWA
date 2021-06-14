import { Clothes } from "./clothes";
import { Comic } from "./comic";
import { Figure } from "./figure";

export class ObjectFactory {
  static comicFromObject(rawComic: any): Comic {
    return new Comic(
      +rawComic.id,
      rawComic.owner,
      rawComic.title,
      rawComic.description,
      rawComic.image,
      rawComic.type,
      rawComic.author,
      +rawComic.age,
      +rawComic.isbn,
      +rawComic.pages,
      rawComic.publisher,
      new Date(rawComic.publish_date),
      +rawComic.price
    );
  }

  static figureFromObject(rawFigure: any): Figure {
    return new Figure(
      +rawFigure.id,
      rawFigure.owner,
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
      rawClothes.title,
      rawClothes.description,
      rawClothes.image,
      rawClothes.type,
      rawClothes.size,
      +rawClothes.price,
    )
  }
}
