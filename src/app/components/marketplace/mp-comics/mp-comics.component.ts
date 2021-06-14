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

    console.log("Comics loaded: ", this.comics);
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.comicSubscription.unsubscribe();
  }
}
