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

  initFiguresMap(pages, page, figures) {
    for (let i = 1; i <= pages; i++) {
      this.figures.set(i, []);
    }

    for (const figure of figures) {
      this.figures.get(page).push(ObjectFactory.figureFromObject(figure));
    }

    console.log("Figures loaded: ", this.figures);
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.figureSubscription.unsubscribe();
  }

}
