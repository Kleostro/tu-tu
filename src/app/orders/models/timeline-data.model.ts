interface EventDetails {
  date: Date;
  stationID: number;
}

interface Duration {
  duration: string;
}

export type Event = Partial<EventDetails> & Partial<Duration>;
