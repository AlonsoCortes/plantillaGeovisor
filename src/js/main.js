import { mapConfig } from './config.js';
import { extentControl } from './controls.js';
import { BaseMapControl } from './controls.js';

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






