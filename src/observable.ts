export type EventKey = string;

export type EventData = any;

export type Subscriber = (data: EventData) => void;
export type Unsubscriber = () => void;

export type DispatchEvent = (event: string, data: EventData) => void;

export const ALL_EVENTS_KEY = '*';

export class Observable {
  protected subscribers = new Map<string, Subscriber[]>();

  subscribe(eventKey: EventKey, subscriber: Subscriber): Unsubscriber {
    let isSubscribed = true;
    let subscribers: Subscriber[];
    if (!this.subscribers.has(eventKey)) {
      subscribers = [subscriber];
      this.subscribers.set(eventKey, subscribers);
    } else {
      subscribers = this.subscribers.get(eventKey) as Subscriber[];
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

  unsubscribe(eventKey: EventKey, subscriber: Subscriber): void {
    const subscribers = this.subscribers.get(eventKey) || [];
    const index = subscribers.indexOf(subscriber);
    index > -1 && subscribers.splice(index, 1);
  }

  allSubscribe(subscriber: Subscriber): Unsubscriber {
    return this.subscribe(ALL_EVENTS_KEY, subscriber);
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
      subscriber(data);
    });
  }

  getSubscribers(): Map<EventKey, EventData> {
    console.warn('for debugging...');
    return this.subscribers;
  }
}
