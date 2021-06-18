import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/service/data.service';

import { ObjectFactory } from 'src/app/models/object.factory';
import { Figure } from 'src/app/models/figure';

@Component({
  selector: 'app-mp-figures',
  templateUrl: './mp-figures.component.html',
  styleUrls: ['./mp-figures.component.scss']
})
export class MpFiguresComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  currentPage: number = 1;
  filters: {[key: string]: string} = {};

  filterOptions = {
    "sizes": [],
    "minPrice": 0,
    "maxPrice": 0
  }

  selectedSize: string = "";
  fromVal: number = 0;
  toVal: number = 0;

  loadingSubscription: Subscription;
  figureSubscription: Subscription;
  filterSubscription: Subscription;

  figures: Map<number, Figure[]> = new Map();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.dataService.isLoading.subscribe((state) => this.isLoading = state);
    this.loadUnfiltered();
  }

  loadUnfiltered() {
    this.currentPage = 1;
    this.filters = {};
    this.initFilterOptions();
    this.getFigures();
  }

  loadFiltered() {
    this.filters.page = "1";
    this.currentPage = 1;

    this.registerCurrentFilters();
    this.getFigures(this.filters);
  }

  getFigures(filters = {}) {
    console.log("FILTERS: ", filters);
    this.figureSubscription = this.dataService.getAllFigures(filters).subscribe((response) => {
      this.initFiguresMap(response.max_pages, response.selected_page, response.data);
      this.dataService.isLoading.next(false);
    })
  }

  registerCurrentFilters() {
    if (this.selectedSize != "") this.filters.size = this.selectedSize;
    this.filters.from = this.fromVal.toString();
    this.filters.to = this.toVal.toString();
  }

  initFilterOptions() {
    this.filterSubscription = this.dataService.getFigureFilterData().subscribe((response) => {
      this.filterOptions.sizes = response.sizes;
      this.filterOptions.minPrice = +response.min_price;
      this.filterOptions.maxPrice = +response.max_price;
      this.fromVal = +this.filterOptions.minPrice;
      this.toVal = +this.filterOptions.maxPrice;
    })
  }

  initFiguresMap(pages, page, figures) {
    this.figures = new Map();
    
    for (let i = 1; i <= pages; i++) {
      this.figures.set(i, []);
    }

    this.addToMap(page, figures);

    console.log("Figures loaded: ", this.figures);
  }

  addToMap(page, figures) {
    for (const figure of figures) {
      this.figures.get(page).push(ObjectFactory.figureFromObject(figure));
    }
  }

  changePage(selectedPage: number) {
    this.currentPage = selectedPage;
    if (this.figures.get(selectedPage).length == 0) {
      this.filters.page = selectedPage.toString();

      // console.info("Filters: ", this.filters);
      this.figureSubscription = this.dataService.getAllFigures(this.filters).subscribe((response) => {
        this.dataService.isLoading.next(false);
        this.addToMap(+response.selected_page, response.data);
        console.info("Figures loaded: ", this.figures);
      });
    } else {
      // data already loaded, do nothing
      console.info("Content already loaded: ", this.figures.get(selectedPage));
    }
  }

  displayedFigures() {
    return this.figures.get(this.currentPage);
  }

  checkDataForPageExists(): boolean {
    return this.figures.get(this.currentPage).length != 0;
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.figureSubscription.unsubscribe();
  }

}
