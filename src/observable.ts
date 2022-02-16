export type EventKey = string;

export type EventData = any;

export interface Event {
  key: EventKey;
  data: EventData;
}

export type AllSubscriber = (event: Event) => void;
export type Subscriber = (data: EventData) => void;
export type Unsubscriber = () => void;

export type DispatchEvent = (event: string, data: EventData) => void;

export const ALL_EVENTS_KEY = '*';

export class Observable<S = Subscriber> {
  protected subscribers = new Map<string, S[]>();

  getSubscribers(): Map<EventKey, S[]> {
    return this.subscribers;
  }

  subscribe(eventKey: EventKey, subscriber: S): Unsubscriber {
    let isSubscribed = true;
    let subscribers: S[];
    if (!this.subscribers.has(eventKey)) {
      subscribers = [subscriber];
      this.subscribers.set(eventKey, subscribers);
    } else {
      subscribers = this.subscribers.get(eventKey) as S[];
    }

    return function unsubscribe(): void {
      if (!isSubscribed) {
        return;
      }
      isSubscribed = false;
      const index = subscribers.indexOf(subscriber);
      subscribers.splice(index, 1);
    };
  }

  unsubscribe(eventKey: EventKey, subscriber: S): void {
    const subscribers = this.subscribers.get(eventKey) || [];
    const index = subscribers.indexOf(subscriber);
    index > -1 && subscribers.splice(index, 1);
  }

  clear(eventKey?: EventKey): void {
    if (eventKey) {
      this.subscribers.delete(eventKey);
    } else {
      this.subscribers.clear();
    }
  }
}

export class Subject extends Observable {
  dispatch(event: string, data?: EventData): void {
    const subscribers = this.subscribers.get(event) || [];
    subscribers.forEach((subscriber) => {
      subscriber(data);
    });

    const allSubscribers = this.subscribers.get(ALL_EVENTS_KEY) || [];
    allSubscribers.forEach((subscriber) => {
      subscriber({
        key: event,
        data: data,
      });
    });
  }

  allSubscribe(subscriber: AllSubscriber): Unsubscriber {
    return this.subscribe(ALL_EVENTS_KEY, subscriber);
  }
}
