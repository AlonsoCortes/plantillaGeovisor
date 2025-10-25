import { mapConfig } from './config.js';
import { extentControl } from './controls.js';
import { BaseMapControl } from './controls.js';
import { agregarGeojson, agregarWMS, agregarWFS } from './01_cargarCapas.js';


const map = new maplibregl.Map({
  container: 'map',
  style: mapConfig.styles[mapConfig.defaultStyle],
  center: mapConfig.center,
  zoom: mapConfig.zoom
});

// Controles básicos
map.addControl(new BaseMapControl(), 'top-right');
map.addControl(new maplibregl.NavigationControl(), 'top-right');
map.addControl(new maplibregl.ScaleControl(), 'bottom-left');
map.addControl(new extentControl(), 'top-right');

// Cargar capas
// Cuando el mapa esté listo:
map.on('load', () => {
  // 1️⃣ GeoJSON
  agregarGeojson(map, {
    id: 'municipios',
    data: './src/assets/data/municipios_2020_INEGI_v2.geojson',
    layerType: 'fill',
    colorAttr: 'NOM_ENT',
    colorMap: {
      Hidalgo: '#009688',
      Puebla: '#E64A19',
      Veracruz: '#1565C0'
    },
    popupTemplate: (props) => `
      <b>${props.NOMGEO}</b><br>
      Estado: ${props.NOM_ENT}<br>
      Población: ${Number(props.pobTotal2020).toLocaleString()}
    `
  });

  // 2️⃣ WMS
  agregarWMS(map, {
    id: 'laboratoriosNacionales',
    url: 'https://dev-dadsig-gema.crip.conahcyt.mx/geoserver/wms',
    layers: 'humanidades_ciencias:hcti_lab_nacionales_conahcyt_040724_xy_p',
    opacity: 0.8
  });

  // 3️⃣ WFS
  agregarWFS(map, {
    id: 'centrosInvestigacion',
    url: 'https://dev-dadsig-gema.crip.conahcyt.mx/geoserver/wfs',
    typeName: 'humanidades_ciencias:hcti_centros_invest_conahcyt_0421_xy_p',
    layerType: 'circle',
    color: '#6000faff',
    popupTemplate: (props) => `<b>${props.NOM_LOC}</b><br>Municipio: ${props.NOM_MUN}`
  });
});




