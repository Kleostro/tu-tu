export interface StationInfo {
  stationId: number;
  stationName: string;
  arrivalDate: string;
  departureDate: string;
  stopDuration: number;
  firstStation: boolean;
  lastStation: boolean;
  firstUserStation: boolean;
  lastUserStation: boolean;
  userStation: boolean;
}
