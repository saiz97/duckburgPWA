import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clothes } from 'src/app/models/clothes';
import { Comic } from 'src/app/models/comic';
import { Figure } from 'src/app/models/figure';
import { ObjectFactory } from 'src/app/models/object.factory';
import { DataService } from 'src/app/service/data.service';
import { NotificationService } from 'src/app/service/notification.service';

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
              private dataService: DataService,
              private notificationService: NotificationService ) { }

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

  addToWishlist() {
    this.notificationService.sendMessage("Added to wishlist!", "U will buy it anyway...", "https://i.pinimg.com/originals/4e/62/17/4e6217e3b10352ad2f0de6f07b667006.png")
  }

  buyItem() {
    // Delete
    this.notificationService.sendMessage("Money spent!", "Well done, u rock! Enjoy.", "https://www.disneyclips.com/images/images/donald-shopping.png")
  }

}
