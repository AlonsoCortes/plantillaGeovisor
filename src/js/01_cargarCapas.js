// Geojson
export async function agregarGeojson(map, options) {
  const {
    id,
    data,
    layerType = 'fill',
    colorAttr = null,
    colorMap = {},
    defaultColor = '#CCCCCC',
    opacity = 0.6,
    outline = '#333333',
    popupTemplate = null
  } = options;

  // Si ya existe, eliminar
  if (map.getSource(id)) {
    map.removeLayer(id);
    map.removeSource(id);
  }

  // Añadir la fuente GeoJSON
  map.addSource(id, {
    type: 'geojson',
    data: data
  });

  // Crear expresión de color (si aplica)
  let colorExpression = defaultColor;
  if (colorAttr && Object.keys(colorMap).length > 0) {
    colorExpression = ['match', ['get', colorAttr]];
    for (const [clave, color] of Object.entries(colorMap)) {
      colorExpression.push(clave, color);
    }
    colorExpression.push(defaultColor);
  }

  // Añadir la capa
  map.addLayer({
    id: id,
    type: layerType,
    source: id,
    paint:
      layerType === 'fill'
        ? {
            'fill-color': colorExpression,
            'fill-opacity': opacity,
            'fill-outline-color': outline
          }
        : layerType === 'line'
        ? { 'line-color': colorExpression, 'line-width': 1.2 }
        : { 'circle-color': colorExpression, 'circle-radius': 4 }
  });
}

// ==========================
// 🟣 WMS
// ==========================
export function agregarWMS(map, options) {
  const { id, url, layers, format = 'image/png', opacity = 1 } = options;

  if (map.getSource(id)) {
    map.removeLayer(id);
    map.removeSource(id);
  }

  const tileUrl = `${url}?service=WMS&request=GetMap&version=1.1.1&layers=${layers}&styles=&format=${format}&transparent=true&srs=EPSG:3857&width=256&height=256&bbox={bbox-epsg-3857}`;

  map.addSource(id, {
    type: 'raster',
    tiles: [tileUrl],
    tileSize: 256
  });

  map.addLayer({
    id: id,
    type: 'raster',
    source: id,
    paint: { 'raster-opacity': opacity }
  });
}


// WFS

export async function agregarWFS(map, options) {
  const {
    id,
    url,
    typeName,
    layerType = 'fill',
    color = '#3B82F6',
    outline = '#1E40AF',
    opacity = 0.5,
    popupTemplate = null
  } = options;

  // Construir URL de solicitud
  const wfsUrl = `${url}?service=WFS&version=1.0.0&request=GetFeature&typeName=${typeName}&outputFormat=application/json`;

  // Obtener datos del WFS
  const response = await fetch(wfsUrl);
  const data = await response.json();

  // Si ya existe, eliminar
  if (map.getSource(id)) {
    map.removeLayer(id);
    map.removeSource(id);
  }

  // Añadir la fuente
  map.addSource(id, {
    type: 'geojson',
    data: data
  });

  // Añadir la capa
  map.addLayer({
    id: id,
    type: layerType,
    source: id,
    paint:
      layerType === 'fill'
        ? {
            'fill-color': color,
            'fill-opacity': opacity,
            'fill-outline-color': outline
          }
        : layerType === 'line'
        ? { 'line-color': color, 'line-width': 1.2 }
        : { 'circle-color': color, 'circle-radius': 5 }
  });
}
