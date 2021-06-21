import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';
import { Clothes } from 'src/app/models/clothes';
import { Comic } from 'src/app/models/comic';
import { PostComment } from 'src/app/models/comment';
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
  comments: PostComment[] = [];
  getSubscription: Subscription;

  commentForm: FormGroup;

  user: User;

  constructor(private route: ActivatedRoute,
              private dataService: DataService,
              private notificationService: NotificationService,
              private authService: AuthService,
              private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      comment: ["", [Validators.required]]
    });

    if (history.state.type != null || history.state.type != undefined) {
      this.initObject(history.state.type, history.state.data)
    } else {
      this.getObject();
    }

    if (this.authService.isLoggedIn()) this.user = this.authService.getCurrentUser();

    this.authService.loginStatus.subscribe(status => {
      if (!status) this.user = null;
    });
  }

  onSubmitComment() {
    this.dataService.addCommentToPost(
      this.user.id,
      this.user.user_nicename,
      this.item.id,
      this.commentForm.controls['comment'].value).subscribe(response => {
        this.comments = [];
        this.getComments();
        this.commentForm.reset();
    })
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

    this.getComments();
  }

  getComments() {
    this.dataService.getCommentsOfPost(this.item.id).subscribe(response => {

      response.forEach(comment => {
        this.comments.push(ObjectFactory.commentFromObject(comment));
      });
    })
  }

  addComment() {

  }

  isWishlistItem(): boolean {
    return JSON.parse(sessionStorage.getItem('wishlist')).includes(this.item.id);
  }

  addToWishlist() {
    let wishlist: number[];

    if (sessionStorage.getItem('wishlist')) wishlist = JSON.parse(sessionStorage.getItem('wishlist'));
    else wishlist = [];


    if (!wishlist.includes(this.item.id)) {
      wishlist.push(this.item.id);
      this.notificationService.sendMessage("Added to wishlist!", "Good boy.", "https://i.pinimg.com/originals/4e/62/17/4e6217e3b10352ad2f0de6f07b667006.png")
    }
    else {
      wishlist.splice(wishlist.indexOf(this.item.id), 1);
      this.notificationService.sendMessage("Removed from wishlist!", "U dog.", "https://i.pinimg.com/originals/4e/62/17/4e6217e3b10352ad2f0de6f07b667006.png")
    }

    sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  buyItem() {
    // Delete
    this.notificationService.sendMessage("Money spent!", "Well done, u rock! Enjoy.", "https://www.disneyclips.com/images/images/donald-shopping.png")
  }

}
