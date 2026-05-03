import { useEffect, useMemo, useRef, useState, type TouchEvent, type WheelEvent } from 'react';
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';

type AppLanguage = 'id' | 'en' | 'zh';
type CopyKey =
  | 'title'
  | 'surveyor'
  | 'target'
  | 'noTarget'
  | 'waiting'
  | 'distance'
  | 'accuracy'
  | 'surveyOnly'
  | 'zoomIn'
  | 'zoomOut'
  | 'resetZoom'
  | 'googleMaps';

export type GpsMapPreviewProps = {
  surveyLatitude: string;
  surveyLongitude: string;
  targetLatitude?: string;
  targetLongitude?: string;
  accuracy: number;
  distance: number;
  language?: AppLanguage;
  copyOverrides?: Partial<Record<CopyKey, string>>;
};

const tileSize = 256;
const earthCircumferenceMeters = 40_075_016.686;
const fallbackCenter = { latitude: -6.2088, longitude: 106.8456 };
const maxMercatorLatitude = 85.05112878;
const minZoom = 4;
const maxZoom = 18;

function localCopy(language: AppLanguage, copy: Record<AppLanguage, string>) {
  return copy[language];
}

function parseCoordinate(value: string | number | null | undefined) {
  const normalized = String(value ?? '').trim().replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function clampLatitude(latitude: number) {
  return Math.max(-maxMercatorLatitude, Math.min(maxMercatorLatitude, latitude));
}

function wrapTileX(x: number, zoom: number) {
  const max = 2 ** zoom;
  return ((x % max) + max) % max;
}

function coordinateToWorld(longitude: number, latitude: number, zoom: number) {
  const scale = tileSize * 2 ** zoom;
  const clampedLatitude = clampLatitude(latitude);
  const sinLatitude = Math.sin((clampedLatitude * Math.PI) / 180);
  return {
    x: ((longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale,
  };
}

function metersToPixels(meters: number, latitude: number, zoom: number) {
  const metersPerPixel = (Math.cos((clampLatitude(latitude) * Math.PI) / 180) * earthCircumferenceMeters) / (tileSize * 2 ** zoom);
  return metersPerPixel > 0 ? meters / metersPerPixel : 0;
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
    };
    updateSize();

    if (!('ResizeObserver' in window)) {
      globalThis.addEventListener('resize', updateSize);
      return () => globalThis.removeEventListener('resize', updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}

function mapPoint(
  longitude: number,
  latitude: number,
  centerWorld: { x: number; y: number },
  width: number,
  height: number,
  zoom: number,
) {
  const world = coordinateToWorld(longitude, latitude, zoom);
  return {
    x: world.x - centerWorld.x + width / 2,
    y: world.y - centerWorld.y + height / 2,
  };
}

function touchDistance(touches: { item(index: number): { clientX: number; clientY: number } | null }) {
  const [first, second] = [touches.item(0), touches.item(1)];
  if (!first || !second) return 0;
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

function googleMapsUrl(latitude: number | null, longitude: number | null) {
  if (latitude === null || longitude === null) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}`;
}

export default function GpsMapPreview({
  surveyLatitude,
  surveyLongitude,
  targetLatitude,
  targetLongitude,
  accuracy,
  distance,
  language = 'id',
  copyOverrides,
}: GpsMapPreviewProps) {
  const { ref: shellRef, size } = useElementSize<HTMLDivElement>();
  const [zoomOffset, setZoomOffset] = useState(0);
  const wheelDeltaRef = useRef(0);
  const pinchDistanceRef = useRef<number | null>(null);
  const pinchZoomDeltaRef = useRef(0);
  const surveyLat = parseCoordinate(surveyLatitude);
  const surveyLng = parseCoordinate(surveyLongitude);
  const targetLat = parseCoordinate(targetLatitude);
  const targetLng = parseCoordinate(targetLongitude);
  const hasSurveyPoint = surveyLat !== null && surveyLng !== null;
  const hasTargetPoint = targetLat !== null && targetLng !== null;
  const centerLatitude = hasSurveyPoint ? surveyLat : hasTargetPoint ? targetLat : fallbackCenter.latitude;
  const centerLongitude = hasSurveyPoint ? surveyLng : hasTargetPoint ? targetLng : fallbackCenter.longitude;
  const baseZoom = hasSurveyPoint || hasTargetPoint ? 15 : 11;
  const zoom = Math.max(minZoom, Math.min(maxZoom, baseZoom + zoomOffset));
  const mapWidth = size.width || 640;
  const mapHeight = size.height || 320;
  const mapsLatitude = hasSurveyPoint ? surveyLat : hasTargetPoint ? targetLat : null;
  const mapsLongitude = hasSurveyPoint ? surveyLng : hasTargetPoint ? targetLng : null;
  const mapsHref = googleMapsUrl(mapsLatitude, mapsLongitude);

  useEffect(() => {
    setZoomOffset(0);
    wheelDeltaRef.current = 0;
    pinchDistanceRef.current = null;
    pinchZoomDeltaRef.current = 0;
  }, [baseZoom, centerLatitude, centerLongitude]);

  const adjustZoom = (delta: number) => {
    setZoomOffset((currentOffset) => {
      const nextZoom = Math.max(minZoom, Math.min(maxZoom, baseZoom + currentOffset + delta));
      return nextZoom - baseZoom;
    });
  };

  const handleWheelZoom = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 4) return;
    event.preventDefault();
    wheelDeltaRef.current += event.deltaY;
    if (Math.abs(wheelDeltaRef.current) < 80) return;
    adjustZoom(wheelDeltaRef.current < 0 ? 1 : -1);
    wheelDeltaRef.current = 0;
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      pinchDistanceRef.current = touchDistance(event.touches);
      pinchZoomDeltaRef.current = 0;
    }
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2 || pinchDistanceRef.current === null) return;
    event.preventDefault();
    const nextDistance = touchDistance(event.touches);
    pinchZoomDeltaRef.current += nextDistance - pinchDistanceRef.current;
    pinchDistanceRef.current = nextDistance;
    if (Math.abs(pinchZoomDeltaRef.current) < 44) return;
    adjustZoom(pinchZoomDeltaRef.current > 0 ? 1 : -1);
    pinchZoomDeltaRef.current = 0;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length < 2) {
      pinchDistanceRef.current = null;
      pinchZoomDeltaRef.current = 0;
      return;
    }
    pinchDistanceRef.current = touchDistance(event.touches);
  };

  const staticMap = useMemo(() => {
    const centerWorld = coordinateToWorld(centerLongitude, centerLatitude, zoom);
    const leftWorld = centerWorld.x - mapWidth / 2;
    const topWorld = centerWorld.y - mapHeight / 2;
    const minTileX = Math.floor(leftWorld / tileSize) - 1;
    const maxTileX = Math.floor((leftWorld + mapWidth) / tileSize) + 1;
    const minTileY = Math.max(0, Math.floor(topWorld / tileSize) - 1);
    const maxTileY = Math.min(2 ** zoom - 1, Math.floor((topWorld + mapHeight) / tileSize) + 1);
    const tiles: Array<{ key: string; src: string; left: number; top: number }> = [];

    for (let x = minTileX; x <= maxTileX; x += 1) {
      for (let y = minTileY; y <= maxTileY; y += 1) {
        const wrappedX = wrapTileX(x, zoom);
        tiles.push({
          key: `${zoom}-${wrappedX}-${y}-${x}`,
          src: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
          left: Math.round(x * tileSize - leftWorld),
          top: Math.round(y * tileSize - topWorld),
        });
      }
    }

    const surveyPoint = hasSurveyPoint ? mapPoint(surveyLng, surveyLat, centerWorld, mapWidth, mapHeight, zoom) : null;
    const targetPoint = hasTargetPoint ? mapPoint(targetLng, targetLat, centerWorld, mapWidth, mapHeight, zoom) : null;
    const accuracyRadius = surveyPoint && accuracy > 0 ? Math.max(10, Math.min(180, metersToPixels(Math.max(accuracy, 8), surveyLat ?? centerLatitude, zoom))) : 0;

    return { tiles, surveyPoint, targetPoint, accuracyRadius };
  }, [accuracy, centerLatitude, centerLongitude, hasSurveyPoint, hasTargetPoint, mapHeight, mapWidth, surveyLat, surveyLng, targetLat, targetLng, zoom]);

  const previewCopy = {
    title: copyOverrides?.title ?? localCopy(language, {
      id: 'Preview lokasi GPS',
      en: 'GPS location preview',
      zh: 'GPS 位置预览',
    }),
    surveyor: copyOverrides?.surveyor ?? localCopy(language, {
      id: 'Posisi surveyor',
      en: 'Surveyor position',
      zh: '调研员位置',
    }),
    target: copyOverrides?.target ?? localCopy(language, {
      id: 'Target toko',
      en: 'Store target',
      zh: '门店目标点',
    }),
    noTarget: copyOverrides?.noTarget ?? localCopy(language, {
      id: 'Target toko belum memiliki koordinat. Peta tetap ditampilkan dari area Jakarta sampai GPS dicapture.',
      en: 'The store target has no coordinates yet. The map still shows the Jakarta area until GPS is captured.',
      zh: '门店目标点暂无坐标。采集 GPS 前地图会先显示雅加达区域。',
    }),
    waiting: copyOverrides?.waiting ?? localCopy(language, {
      id: 'Tekan Capture GPS untuk menampilkan posisi surveyor di peta.',
      en: 'Tap Capture GPS to show the surveyor position on the map.',
      zh: '点击采集 GPS 以在地图上显示调研员位置。',
    }),
    distance: copyOverrides?.distance ?? localCopy(language, {
      id: 'Jarak',
      en: 'Distance',
      zh: '距离',
    }),
    accuracy: copyOverrides?.accuracy ?? localCopy(language, {
      id: 'Akurasi',
      en: 'Accuracy',
      zh: '精度',
    }),
    surveyOnly: copyOverrides?.surveyOnly ?? localCopy(language, {
      id: 'Lokasi submit ditampilkan. Target toko tidak tersedia di data ini.',
      en: 'Submitted location is shown. No store target is available in this data.',
      zh: '已显示提交位置。此数据中没有门店目标点。',
    }),
    zoomIn: copyOverrides?.zoomIn ?? localCopy(language, {
      id: 'Perbesar peta',
      en: 'Zoom map in',
      zh: '放大地图',
    }),
    zoomOut: copyOverrides?.zoomOut ?? localCopy(language, {
      id: 'Perkecil peta',
      en: 'Zoom map out',
      zh: '缩小地图',
    }),
    resetZoom: copyOverrides?.resetZoom ?? localCopy(language, {
      id: 'Reset zoom peta',
      en: 'Reset map zoom',
      zh: '重置地图缩放',
    }),
    googleMaps: copyOverrides?.googleMaps ?? localCopy(language, {
      id: 'Buka Google Maps',
      en: 'Open Google Maps',
      zh: '打开 Google 地图',
    }),
  };
  const mapStatusText =
    hasSurveyPoint && hasTargetPoint
      ? `${previewCopy.distance}: ${distance}m · ${previewCopy.accuracy}: ${accuracy || 0}m`
      : hasSurveyPoint
        ? `${previewCopy.accuracy}: ${accuracy || 0}m · ${previewCopy.surveyOnly}`
        : hasTargetPoint
          ? previewCopy.waiting
          : previewCopy.noTarget;

  return (
    <Box className="gps-map-card">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={1}>
        <Box>
          <Typography fontWeight={900}>{previewCopy.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {mapStatusText}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap className="gps-map-actions">
          <Chip size="small" label={previewCopy.surveyor} color={hasSurveyPoint ? 'info' : 'default'} variant="outlined" />
          <Chip size="small" label={previewCopy.target} color={hasTargetPoint ? 'warning' : 'default'} variant="outlined" />
          {mapsHref && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<MapRoundedIcon />}
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="gps-map-link-button"
            >
              Google Maps
            </Button>
          )}
        </Stack>
      </Stack>
      <Box
        ref={shellRef}
        className="gps-map-shell"
        onWheel={handleWheelZoom}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <Box className="gps-static-map-layer" aria-label={previewCopy.title}>
          {staticMap.tiles.map((tile) => (
            <img
              key={tile.key}
              alt=""
              className="gps-static-map-tile"
              draggable={false}
              src={tile.src}
              style={{ left: tile.left, top: tile.top }}
            />
          ))}
          <svg className="gps-static-map-vectors" viewBox={`0 0 ${mapWidth} ${mapHeight}`} preserveAspectRatio="none" aria-hidden="true">
            {staticMap.surveyPoint && staticMap.accuracyRadius > 0 && (
              <circle
                cx={staticMap.surveyPoint.x}
                cy={staticMap.surveyPoint.y}
                r={staticMap.accuracyRadius}
                className="gps-static-accuracy"
              />
            )}
            {staticMap.surveyPoint && staticMap.targetPoint && (
              <line
                x1={staticMap.surveyPoint.x}
                y1={staticMap.surveyPoint.y}
                x2={staticMap.targetPoint.x}
                y2={staticMap.targetPoint.y}
                className="gps-static-route"
              />
            )}
          </svg>
          {staticMap.targetPoint && (
            <span
              className="gps-map-marker gps-static-marker target"
              style={{ left: staticMap.targetPoint.x, top: staticMap.targetPoint.y }}
              aria-label={previewCopy.target}
            />
          )}
          {staticMap.surveyPoint && (
            <span
              className="gps-map-marker gps-static-marker surveyor"
              style={{ left: staticMap.surveyPoint.x, top: staticMap.surveyPoint.y }}
              aria-label={previewCopy.surveyor}
            />
          )}
        </Box>
        <Stack className="gps-map-zoom-controls" spacing={0.5}>
          <Tooltip title={previewCopy.zoomIn} placement="left">
            <span>
              <IconButton aria-label={previewCopy.zoomIn} onClick={() => adjustZoom(1)} disabled={zoom >= maxZoom}>
                <ZoomInRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={previewCopy.resetZoom} placement="left">
            <span>
              <IconButton aria-label={previewCopy.resetZoom} onClick={() => setZoomOffset(0)} disabled={zoomOffset === 0}>
                <RestartAltRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={previewCopy.zoomOut} placement="left">
            <span>
              <IconButton aria-label={previewCopy.zoomOut} onClick={() => adjustZoom(-1)} disabled={zoom <= minZoom}>
                <ZoomOutRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        <Box
          component="a"
          className="gps-map-attribution"
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap contributors
        </Box>
        {!hasSurveyPoint && (
          <Box className="gps-map-overlay">
            <PinDropRoundedIcon />
            <Typography variant="body2">{previewCopy.waiting}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
