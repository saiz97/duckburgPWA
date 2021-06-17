import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/service/data.service';

import { Comic } from 'src/app/models/comic';
import { ObjectFactory } from 'src/app/models/object.factory';

@Component({
  selector: 'app-mp-comics',
  templateUrl: './mp-comics.component.html',
  styleUrls: ['./mp-comics.component.scss']
})
export class MpComicsComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  currentPage: number = 1;
  filters: { [key: string]: string } = {};

  filterOptions = {
    "types": [],
    "years": [],
    "minPrice": 0,
    "maxPrice": 0
  }

  selectedType: string = "";
  selectedYear: string = "";
  fromVal: number = 0;
  toVal: number = 0;

  loadingSubscription: Subscription;
  comicSubscription: Subscription;
  filterSubscription: Subscription;

  comics: Map<number, Comic[]> = new Map();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.dataService.isLoading.subscribe((state) => this.isLoading = state);
    this.loadUnfiltered();
  }

  loadUnfiltered() {
    this.currentPage = 1;
    this.filters = {};
    this.initFilterOptions();
    this.getComics();
  }

  loadFiltered() {
    this.filters.page = "1";
    this.currentPage = 1;

    this.registerCurrentFilters();
    this.getComics(this.filters);
  }

  getComics(filters = {}) {
    this.comics = new Map();
    console.log("FILTERS: ", filters);
    this.comicSubscription = this.dataService.getAllComics(filters).subscribe((response) => {
      this.initComicMap(response.max_pages, response.selected_page, response.data);
      this.dataService.isLoading.next(false);
    })
  }

  registerCurrentFilters() {
    if (this.selectedType != "") this.filters.type = this.selectedType;
    if (this.selectedYear != "") this.filters.year = this.selectedYear;
    this.filters.from = this.fromVal.toString();
    this.filters.to = this.toVal.toString();
  }

  initFilterOptions() {
    this.filterSubscription = this.dataService.getComicFilterData().subscribe((response) => {
      this.filterOptions.types = response.types;
      this.filterOptions.years = response.years;
      this.filterOptions.minPrice = +response.min_price;
      this.filterOptions.maxPrice = +response.max_price;
      this.fromVal = +this.filterOptions.minPrice;
      this.toVal = +this.filterOptions.maxPrice;
    })
  }

  initComicMap(pages: number, page: number, comics) {
    for (let i = 1; i <= pages; i++) {
      this.comics.set(i, []);
    }

    this.addToMap(page, comics);

    console.info("Comics loaded: ", this.comics);
  }

  addToMap(page, comics) {
    for (const comic of comics) {
      this.comics.get(+page).push(ObjectFactory.comicFromObject(comic));
    }
  }

  changePage(selectedPage: number) {
    this.currentPage = selectedPage;
    if (this.comics.get(selectedPage).length == 0) {
      this.filters.page = selectedPage.toString();

      // console.info("Filters: ", this.filters);
      this.comicSubscription = this.dataService.getAllComics(this.filters).subscribe((response) => {
        this.dataService.isLoading.next(false);
        this.addToMap(+response.selected_page, response.data)
        console.info("Comics loaded: ", this.comics);
      });
    } else {
      // data already loaded, do nothing
      console.info("Content already loaded: ", this.comics.get(selectedPage));
    }
  }

  displayedComics() {
    return this.comics.get(this.currentPage);
  }

  checkDataForPageExists(): boolean {
    return this.comics.get(this.currentPage).length != 0;
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.comicSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }
}
