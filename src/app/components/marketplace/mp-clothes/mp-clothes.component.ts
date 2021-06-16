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

  filterOptions = {
    "types": [],
    "sizes": [],
    "minPrice": 0,
    "maxPrice": 0
  }

  selectedType: string = "";
  selectedSize: string = "";
  fromVal: number = 0;
  toVal: number = 0;

  loadingSubscription: Subscription;
  clothesSubscription: Subscription;
  filterSubscription: Subscription;

  clothes: Map<number, Clothes[]> = new Map();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.dataService.isLoading.subscribe((state) => this.isLoading = state);

    this.filterSubscription = this.dataService.getClothesFilterData().subscribe((response) => {
      this.filterOptions.types = response.types;
      this.filterOptions.sizes = response.sizes;
      this.filterOptions.minPrice = +response.min_price;
      this.filterOptions.maxPrice = +response.max_price;
      this.fromVal = +this.filterOptions.minPrice;
      this.toVal = +this.filterOptions.maxPrice;
    })

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

  checkDataForPageExists(): boolean {
    return this.clothes.get(this.currentPage).length != 0;
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.clothesSubscription.unsubscribe();
  }
}
