import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clothes } from 'src/app/models/clothes';
import { Comic } from 'src/app/models/comic';
import { Figure } from 'src/app/models/figure';
import { ObjectFactory } from 'src/app/models/object.factory';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

  item: any | Comic | Figure | Clothes = null;
  type: string = "";
  comments: [];
  getSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private dataService: DataService) { }

  ngOnInit(): void {
    if (history.state.type != null || history.state.type != undefined) {
      this.initObject(history.state.type, history.state.data)
    } else {
      this.getObject();
    }
  }

  getObject() {
    this.getSubscription =
      this.dataService
      .getItemById(+this.route.snapshot.params['id'])
      .subscribe((response) => {
        this.initObject(response.post_type, response);
      });
  }

  initObject(type: string, object: {}) {
    switch (type) {
        case "comic":
          this.item = ObjectFactory.comicFromObject(object);
          this.type = "comic";
          break;
        case "figure":
          this.item = ObjectFactory.figureFromObject(object);
          this.type = "figure";
          break;
        case "clothes":
          this.item = ObjectFactory.clothesFromObject(object);
          this.type = "clothes";
          break;
        default:
          this.getObject();
          break;
    }

    console.log(this.item)
  }

}
