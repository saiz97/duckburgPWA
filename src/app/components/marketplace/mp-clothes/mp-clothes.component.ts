import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/service/data.service';

import { Clothes } from 'src/app/models/clothes';
import { ObjectFactory } from 'src/app/models/object.factory';

@Component({
  selector: 'app-mp-clothes',
  templateUrl: './mp-clothes.component.html',
  styleUrls: ['./mp-clothes.component.scss']
})
export class MpClothesComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  currentPage: number = 1;
  filters: {[key: string]: string} = {};

  loadingSubscription: Subscription;
  clothesSubscription: Subscription;

  clothes: Map<number, Clothes[]> = new Map();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.dataService.isLoading.subscribe((state) => this.isLoading = state);

    this.clothesSubscription = this.dataService.getAllClothes().subscribe((response) => {
      this.dataService.isLoading.next(false);
      this.initClothesMap(response.max_pages, response.selected_page, response.data);
    })
  }

  displayedClothes() {
    return this.clothes.get(this.currentPage);
  }

  changePage(selectedPage: number) {
    this.currentPage = selectedPage;
    if (this.clothes.get(selectedPage).length == 0) {
      this.filters.page = selectedPage.toString();

      console.info("Filters: ", this.filters);
      this.clothesSubscription = this.dataService.getAllClothes(this.filters).subscribe((response) => {
        this.dataService.isLoading.next(false);
        this.clothes.set(+response.selected_page, response.data);
        console.info("Clothes loaded: ", this.clothes);
      });
    } else {
      // data already loaded, do nothing
      console.info("Content already loaded: ", this.clothes.get(selectedPage));
    }
  }

  initClothesMap(pages, page, clothes) {
    for (let i = 1; i <= pages; i++) {
      this.clothes.set(i, []);
    }

    for (const cloth of clothes) {
      this.clothes.get(page).push(ObjectFactory.clothesFromObject(cloth));
    }

    console.log("Clothes loaded: ", this.clothes);
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.clothesSubscription.unsubscribe();
  }
}
