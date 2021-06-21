import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  sendMessage(title: string, body: string, icon: string) {
    const options = {
        body: body,
        icon: icon
    };
    new Notification(title, options);
  }

  permitNotifications() {
    Notification.requestPermission().then((result) => {
    if(result == 'granted')
      console.warn("Notifications permitted.")
    });
  }
}

