import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Clothes } from '../models/clothes';
import { Comic } from '../models/comic';
import { Figure } from '../models/figure';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private BASE_URL: string = "https://api.s1810456031.student.kwmhgb.at/wp-json/duckburg";
  private BASE_URL_WP: string = "https://api.s1810456031.student.kwmhgb.at/wp-json/wp/v2";

  isLoading = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  getItemById(id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/itemById`, { params: { 'id': id.toString() } })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllComics(params: { [index: string]: string } = {}): Observable<any> {
    return this.http.get(`${this.BASE_URL}/comics`, { params: params })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getComicFilterData(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/comics/filters`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllFigures(params: { [index: string]: string } = {}): Observable<any> {
    return this.http.get(`${this.BASE_URL}/figures`, { params: params })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getFigureFilterData(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/figures/filters`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllClothes(params: { [index: string]: string } = {}): Observable<any> {
    return this.http.get(`${this.BASE_URL}/clothes`, { params: params })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getClothesFilterData(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/clothes/filters`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getItemsByAuthorId(id: number, page: number, itemsPerPage: string): Observable<any> {
    const params = {
      "id": id.toString(),
      "page": page.toString(),
      "num_per_page": (itemsPerPage != '' ? itemsPerPage : '10')
    };

    return this.http.get(`${this.BASE_URL}/items/author`, { params: params })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getWishlist(currentPage: number, itemsPerPage: number, wishlist: number[]): Observable<any> {
    return this.http.post(`${this.BASE_URL}/wishlist`, {
      "paged": currentPage,
      "posts_per_page": itemsPerPage,
      "data": wishlist
    })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getCommentsOfPost(id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/item/comments`, { params: { 'id': id.toString() } })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  addCommentToPost(author_id: number, author_name: string, post: number, content: string): Observable<any> {
    return this.http.post(`${this.BASE_URL_WP}/comments`, {
        'post': post.toString(),
        'author': author_id.toString(),
        'author_name': author_name,
        'content': content
    },).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  postNewItem(authorId: number, item: any, type: string): Observable<any> {
    let post = {
      author: authorId.toString(),
      title: item.title,
      type: "duckburg_" + type,
      status: "publish",
      comments_status: "open",
      fields: {}
    }

    post.fields = item;

    return this.http.post(`${this.BASE_URL_WP}/duckburg_${type}`, post).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  postImage(file, image): Observable<any> {
    let re = /(?:\.([^.]+))?$/; // re.exec(file)
    let fileextension = re.exec(file)[1];
    let filename = file.replace(/^.*[\\\/]/, '');

    let contentType = 'image/';
    if (fileextension == "png") contentType += 'png';
    else if (fileextension == "jpg"
        || fileextension == "jpeg") contentType += 'jpeg';
    else if (fileextension == "tiff") contentType += 'tiff';
    else contentType = 'multipart/form-data';

    let headers = {
        'Content-Type': `${contentType}`,
        'Content-Disposition': `attachment; filename=${filename}`
      }

    return this.http.post(`${this.BASE_URL_WP}/media`, image, {
      headers: headers
    }).pipe(retry(3)).pipe(catchError(this.errorHandler));

  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/item`, {params: { 'id': id.toString() }}).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }
}
