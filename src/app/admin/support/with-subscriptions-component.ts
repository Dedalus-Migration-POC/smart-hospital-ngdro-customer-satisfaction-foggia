import {Injectable, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";

@Injectable({providedIn: 'root'})
export class WithSubscriptionsComponent implements OnDestroy {
  subscriptions: Subscription[] = [];

  protected addSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
    return subscription;
  }

  protected addSubscriptions(...subscriptions: Subscription[]) {
    this.subscriptions.push(...subscriptions);
    return subscriptions;
  }

  protected unsubscribeOne(subscription: Subscription) {
    this.subscriptions = this.subscriptions.filter(sub => sub !== subscription);
  }

  protected unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
