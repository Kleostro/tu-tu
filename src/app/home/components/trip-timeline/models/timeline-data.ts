interface EventDetails {
  date: Date;
  city: string;
  dateFormat: string;
}

interface Duration {
  duration: string;
}

export type TimelineEvent = Partial<EventDetails> & Partial<Duration>;
