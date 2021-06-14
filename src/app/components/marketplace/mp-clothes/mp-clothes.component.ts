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
