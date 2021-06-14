export class Comic {
  constructor(
    public id: number,
    public owner: string,
    public title: string,
    public description: string,
    public image: string,
    public type: string,
    public author: string,
    public age: number,
    public isbn: number,
    public pages: number,
    public publisher: string,
    public publish_date: Date,
    public price: number
  ) {}
}
