export interface EventDetails {
  arrivalDate: Date;
  departureDate: Date;
  station: string;
  duration: string;
  firstStation?: boolean;
  lastStation?: boolean;
}
