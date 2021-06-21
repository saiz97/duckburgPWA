import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/auth/user';
import { DataService } from 'src/app/service/data.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-ads-new-item',
  templateUrl: './ads-new-item.component.html',
  styleUrls: ['./ads-new-item.component.scss']
})
export class AdsNewItemComponent implements OnInit {

  comicForm: FormGroup;
  figureForm: FormGroup;
  clothesForm: FormGroup;

  @Output() createdEmitter = new EventEmitter<string>();

  @Input() user: User;

  constructor(private fb: FormBuilder,
              private dataService: DataService,
              private notifService: NotificationService) { }

  ngOnInit(): void {
    this.comicForm = this.fb.group({
      title: ["", [Validators.required]],
      price: ["", [Validators.required]],
      type: ["", [Validators.required]],
      description: [""],
      image: ["", [Validators.required]],
      author: [""],
      age: [""],
      isbn: [""],
      pages: [""],
      publisher: [""],
      publishdate: [""]
    });
    this.figureForm = this.fb.group({
      title: ["", [Validators.required]],
      price: ["", [Validators.required]],
      size: ["", [Validators.required]],
      description: [""],
      image: ["", [Validators.required]],
    });
    this.clothesForm = this.fb.group({
      title: ["", [Validators.required]],
      price: ["", [Validators.required]],
      size: ["", [Validators.required]],
      type: ["", [Validators.required]],
      description: [""],
      image: ["", [Validators.required]],
    });
  }

  onCreateComic() {
    let fileImg = (<any>document.querySelector('#comic-img')).files[0];

    const content = {
      title: this.comicForm.controls["title"].value,
      description: this.comicForm.controls["description"].value,
      image: '',
      type: this.comicForm.controls["type"].value,
      author: this.comicForm.controls["author"].value,
      age: this.comicForm.controls["age"].value,
      isbn: this.comicForm.controls["isbn"].value,
      pages: this.comicForm.controls["pages"].value,
      publisher: this.comicForm.controls["publisher"].value,
      publish_date: this.comicForm.controls["publishdate"].value,
      price: this.comicForm.controls["price"].value
    };

    this.dataService.postImage(this.comicForm.controls["image"].value, fileImg).subscribe(image => {
      if (image.id) {
        content.image = image.id;
        this.dataService.postNewItem(this.user.id, content, "comic").subscribe(response => {
          this.comicForm.reset();
          this.notifService.sendMessage("Comic created!", "Well done. Good boy!", "")
          this.createdEmitter.emit('overview');
        });
      } else {
        alert('Woops.. something went wrong with your image upload. Sorry! \n Please try again.')
      }
    });
  }


  onCreateFigure() {
    let fileImg = (<any>document.querySelector('#figure-img')).files[0];

    const content = {
      title: this.figureForm.controls["title"].value,
      description: this.figureForm.controls["description"].value,
      image: '',
      size: this.figureForm.controls["size"].value,
      price: this.figureForm.controls["price"].value,
    };

    this.dataService.postImage(this.figureForm.controls["image"].value, fileImg).subscribe(image => {
      if (image.id) {
        content.image = image.id;
        this.dataService.postNewItem(this.user.id, content, "figure").subscribe(response => {
          this.figureForm.reset();
          this.notifService.sendMessage("Figure created!", "Well done. Good boy!", "")
          this.createdEmitter.emit('overview');
        });
      } else {
        alert('Woops.. something went wrong with your image upload. Sorry! \n Please try again.')
      }
    });


  }

  onCreateClothes() {
    let fileImg = (<any>document.querySelector('#clothes-img')).files[0];

    const content = {
      title: this.clothesForm.controls["title"].value,
      description: this.clothesForm.controls["description"].value,
      image: "",
      type: this.clothesForm.controls["type"].value,
      size: this.clothesForm.controls["size"].value,
      price: this.clothesForm.controls["price"].value,
    };

    this.dataService.postImage(this.clothesForm.controls["image"].value, fileImg).subscribe(image => {
      if (image.id) {
        content.image = image.id;
        this.dataService.postNewItem(this.user.id, content, "clothes").subscribe(response => {
          this.clothesForm.reset();
          this.notifService.sendMessage("Clothes created!", "Well done. Good boy!", "");
          this.createdEmitter.emit('overview');
        });
      } else {
        alert('Woops.. something went wrong with your image upload. Sorry! \n Please try again.')
      }
    });
  }

}
