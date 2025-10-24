import { mapConfig } from './config.js';


// Botón para moverse a los límites definidos
export class extentControl {
    onAdd(map) {
        this._map = map;

        // Crea el contenedor principal del control
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

        // Crea el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.title = 'Vista nacional';
        button.innerHTML = '<i class="fi fi-rs-arrow-up-right-and-arrow-down-left-from-center"></i>'; // puedes usar un ícono o texto
        button.className = 'maplibregl-ctrl-icon';

        // Acción al hacer clic
        button.addEventListener('click', () => {
            map.fitBounds(mapConfig.extents.nacional); // existen otras opciones (eg) nacional, cdmx, bajio
        });

        // Añade el botón al contenedor
        this._container.appendChild(button);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

// Control de mapas base

export class BaseMapControl {
  onAdd(map) {
    this._map = map;

    // contenedor principal del control
    const container = document.createElement('div');
    container.className = 'maplibregl-ctrl basemap-control';
    // texto o título
    // const label = document.createElement('span');
    // label.className = 'basemap-title';
    // label.textContent = 'Mapas base';
    // container.appendChild(label);

    // grupo de radio buttons
    const form = document.createElement('form');
    form.className = 'basemap-form';

    // crear un radio por cada estilo definido en config.js
    Object.entries(mapConfig.styles).forEach(([nombre, url], i) => {
      const label = document.createElement('label');
      label.className = 'basemap-option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'basemap';
      input.value = nombre;
      input.title = `Estilo ${nombre}`;
      if (nombre === mapConfig.defaultStyle) input.checked = true;

      // cambia el estilo del mapa cuando se selecciona
      input.addEventListener('change', () => {
        if (input.checked) map.setStyle(url);
      });

      const span = document.createElement('span');
      span.textContent = nombre;

      label.appendChild(input);
      label.appendChild(span);
      form.appendChild(label);
    });

    container.appendChild(form);
    return container;
  }

  onRemove() {
    this._container?.remove();
    this._map = undefined;
  }
}
