interface EventDetails {
  date: Date;
  city: string;
}

interface Duration {
  duration: string;
}

export type Event = Partial<EventDetails> & Partial<Duration>;
