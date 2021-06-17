import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';
import { Clothes } from 'src/app/models/clothes';
import { Comic } from 'src/app/models/comic';
import { Figure } from 'src/app/models/figure';
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

  loadingSubscription: Subscription;

  items: Map<number, any[]> = new Map();

  user: User;

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.dataService.isLoading.subscribe((state) => this.isLoading = state);
    this.initItems();
  }

  initItems() {
    this.currentPage = 1;
    this.user = this.authService.getCurrentUser();
    this.dataService.getItemsByAuthorId(this.user.id, this.currentPage).subscribe(response => {
      console.log("=== ", response)
      this.initMap(response.max_pages, response.selected_page, response.data);
    })
  }

  initMap(pages: number, page: number, items) {
    for (let i = 1; i <= pages; i++) {
      this.items.set(i, []);
    }

    for (const item of items) {
      this.addItemToMap(page, item);
    }

    console.info("Items loaded: ", this.items);
  }

  addItemToMap(page:number, item: any) {
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

  changePage(selectedPage: number) {
    this.currentPage = selectedPage;
    if (this.items.get(selectedPage).length == 0) {

      this.dataService.getItemsByAuthorId(this.user.id, this.currentPage).subscribe((response) => {
        this.dataService.isLoading.next(false);
        response.data.forEach(item => {
          this.addItemToMap(+response.selected_page, item);
        });
        console.log("*** ", this.items);
      });
    } else {
      // data already loaded, do nothing
      console.info("Content already loaded: ", this.items.get(selectedPage));
    }
  }

}
