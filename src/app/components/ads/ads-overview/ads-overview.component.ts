import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user';
import { ObjectFactory } from 'src/app/models/object.factory';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-ads-overview',
  templateUrl: './ads-overview.component.html',
  styleUrls: ['./ads-overview.component.scss']
})
export class AdsOverviewComponent implements OnInit {
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: string = "5";

  loadingSubscription: Subscription;

  items: Map<number, any[]> = new Map();

  @Input() user: User;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.dataService.isLoading.subscribe((state) => this.isLoading = state);
    this.initItems();
  }

  initItems() {
    this.currentPage = 1;
    this.dataService.getItemsByAuthorId(this.user.id, this.currentPage, this.itemsPerPage).subscribe(response => {
      this.dataService.isLoading.next(false);
      this.initMap(response.max_pages, response.selected_page, response.data);
    })
  }

  initMap(pages: number, page: number, items) {
    this.items = new Map();

    for (let i = 1; i <= pages; i++) {
      this.items.set(i, []);
    }

    this.addItemToMap(page, items);
  }

  addItemToMap(page:number, items: any) {
    for (const item of items) {
      switch (item.post_type) {
        case "comic":
          this.items.get(+page).push(ObjectFactory.comicFromObject(item));
          break;
        case "figure":
          this.items.get(+page).push(ObjectFactory.figureFromObject(item));
          break;
        case "clothes":
          this.items.get(+page).push(ObjectFactory.clothesFromObject(item));
          break;
        default:
          break;
      }
    }

    console.info("Items loaded: ", this.items);
  }

  changePage(selectedPage: number) {
    this.currentPage = selectedPage;
    if (this.items.get(selectedPage).length == 0) {

      this.dataService.getItemsByAuthorId(this.user.id, this.currentPage, this.itemsPerPage).subscribe((response) => {
        this.dataService.isLoading.next(false);
        this.addItemToMap(+response.selected_page, response.data);
      });
    } else {
      // data already loaded, do nothing
      console.info("Content already loaded: ", this.items.get(selectedPage));
    }
  }

  onChangeItemsPerPage() {
    this.initItems();
  }

  displayedItems() {
    return this.items.get(this.currentPage);
  }

  checkDataForPageExists(): boolean {
    if (this.items.size == 0) return false;
    return (this.items.get(this.currentPage).length != 0);
  }

  deleteItem(id: number) {
    if (confirm("Do you really want to delete this item?")) {
      this.dataService.deleteItem(id).subscribe(resposne => {
        console.info("Item deleted successfully.");
        this.initItems();
      })
    }
  }

}
