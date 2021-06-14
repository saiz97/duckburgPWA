export class Figure {
  constructor(
    public id: number,
    public owner: string,
    public title: string,
    public description: string,
    public image: string,
    public size: string,
    public price: number
  ) {}
}
