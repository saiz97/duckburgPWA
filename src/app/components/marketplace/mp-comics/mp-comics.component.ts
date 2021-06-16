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
  filters: {[key: string]: string} = {};

  fromVal: string = "";
  toVal: string = "";

  loadingSubscription: Subscription;
  comicSubscription: Subscription;

  comics: Map<number, Comic[]> = new Map();


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.dataService.isLoading.subscribe((state) => this.isLoading = state);

    this.comicSubscription = this.dataService.getAllComics().subscribe((response) => {
      this.dataService.isLoading.next(false);
      this.initComicMap(response.max_pages, response.selected_page, response.data);
    })
  }

  loadFilteredComics() {
    this.currentPage = 1;
    // filters set
    // comics reset
    this.comics.clear();
  }

  displayedComics() {
    return this.comics.get(this.currentPage);
  }

  initComicMap(pages, page, comics) {
    for (let i = 1; i <= pages; i++) {
      this.comics.set(i, []);
    }

    for (const comic of comics) {
      this.comics.get(page).push(ObjectFactory.comicFromObject(comic));
    }

    console.info("Comics loaded: ", this.comics);
  }

  changePage(selectedPage: number) {
    this.currentPage = selectedPage;
    if (this.comics.get(selectedPage).length == 0) {
      this.filters.page = selectedPage.toString();

      console.info("Filters: ", this.filters);
      this.comicSubscription = this.dataService.getAllComics(this.filters).subscribe((response) => {
        this.dataService.isLoading.next(false);
        this.comics.set(+response.selected_page, response.data);
        console.info("Comics loaded: ", this.comics);
      });
    } else {
      // data already loaded, do nothing
      console.info("Content already loaded: ", this.comics.get(selectedPage));
    }
  }

  checkDataForPageExists(): boolean {
    return this.comics.get(this.currentPage).length != 0;
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.comicSubscription.unsubscribe();
  }
}
