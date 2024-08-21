interface ConnectedStation {
  id: number;
  distance: number;
}

export interface Station {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  connectedTo: ConnectedStation[];
}

export interface NewStation {
  city: string;
  latitude: number;
  longitude: number;
  relations: number[];
}
