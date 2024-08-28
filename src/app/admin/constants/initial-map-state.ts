import { AddLayerObject } from 'maplibre-gl';

export const INITIAL_MAP_STATE = { lng: 2.349014, lat: 48.864716, zoom: 10 };
export const MARKER_PARAMS = {
  height: 40,
  radius: 40,
  offset: 20,
  max_width: 'max-content',
  color: '#3B82F6',
};

export const LINE_LAYER: AddLayerObject = {
  id: 'line',
  type: 'line',
  source: 'line',
  paint: {
    'line-color': MARKER_PARAMS.color,
    'line-width': 4,
  },
};
