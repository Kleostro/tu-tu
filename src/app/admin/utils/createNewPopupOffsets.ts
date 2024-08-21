import { Offset, Point } from 'maplibre-gl';

import { MARKER_PARAMS } from '../constants/initial-map-state';

const createNewPopupOffsets = (): Offset => ({
  top: new Point(0, 0),
  left: new Point(MARKER_PARAMS.radius, (MARKER_PARAMS.height - MARKER_PARAMS.radius) * -1),
  right: new Point(-MARKER_PARAMS.radius, (MARKER_PARAMS.height - MARKER_PARAMS.radius) * -1),
  bottom: new Point(0, -MARKER_PARAMS.height),
  center: new Point(0, MARKER_PARAMS.height),
  'top-left': new Point(0, 0),
  'top-right': new Point(0, 0),
  'bottom-left': new Point(
    MARKER_PARAMS.offset,
    (MARKER_PARAMS.height - MARKER_PARAMS.radius + MARKER_PARAMS.offset) * -1,
  ),
  'bottom-right': new Point(
    -MARKER_PARAMS.offset,
    (MARKER_PARAMS.height - MARKER_PARAMS.radius + MARKER_PARAMS.offset) * -1,
  ),
});

export default createNewPopupOffsets;
