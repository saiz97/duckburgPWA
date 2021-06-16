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

  loadingSubscription: Subscription;
  figureSubscription: Subscription;

  figures: Map<number, Figure[]> = new Map();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.dataService.isLoading.subscribe((state) => this.isLoading = state);

    this.figureSubscription = this.dataService.getAllFigures().subscribe((response) => {
      this.dataService.isLoading.next(false);
      this.initFiguresMap(response.max_pages, response.selected_page, response.data);
    })
  }

  displayedFigures() {
    return this.figures.get(this.currentPage);
  }

  changePage(selectedPage: number) {
    this.currentPage = selectedPage;
    if (this.figures.get(selectedPage).length == 0) {
      this.filters.page = selectedPage.toString();

      console.info("Filters: ", this.filters);
      this.figureSubscription = this.dataService.getAllFigures(this.filters).subscribe((response) => {
        this.dataService.isLoading.next(false);
        this.figures.set(+response.selected_page, response.data);
        console.info("Figures loaded: ", this.figures);
      });
    } else {
      // data already loaded, do nothing
      console.info("Content already loaded: ", this.figures.get(selectedPage));
    }
  }

  initFiguresMap(pages, page, figures) {
    for (let i = 1; i <= pages; i++) {
      this.figures.set(i, []);
    }

    for (const figure of figures) {
      this.figures.get(page).push(ObjectFactory.figureFromObject(figure));
    }

    console.log("Figures loaded: ", this.figures);
  }

  checkDataForPageExists(): boolean {
    return this.figures.get(this.currentPage).length != 0;
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.figureSubscription.unsubscribe();
  }

}
