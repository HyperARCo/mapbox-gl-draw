var {isEnterKey, isEscapeKey} = require('../lib/common_selectors');
var Point = require('../feature_types/point');
const Constants = require('../constants');

module.exports = function(ctx) {

  var feature = new Point(ctx, {
    'type': 'Feature',
    'properties': {},
    'geometry': {
      'type': 'Point',
      'coordinates': []
    }
  });

  ctx.store.add(feature);

  var stopDrawingAndRemove = function() {
    ctx.events.changeMode('simple_select');
    ctx.store.delete([feature.id]);
  };

  var done = false;
  var onClick = function(e) {
    ctx.ui.queueMapClasses({mouse:'move'});
    done = true;
    feature.updateCoordinate('', e.lngLat.lng, e.lngLat.lat);
    ctx.events.changeMode('simple_select', [feature.id]);
  };

  return {
    start: function() {
      ctx.store.clearSelected();
      ctx.ui.queueMapClasses({mouse:'add'});
      ctx.ui.setButtonActive(Constants.types.POINT);
      this.on('click', () => true, onClick);
      this.on('keyup', isEscapeKey, stopDrawingAndRemove);
      this.on('keyup', isEnterKey, stopDrawingAndRemove);
      this.on('trash', () => true, stopDrawingAndRemove);
    },
    stop: function() {
      ctx.ui.deactivateButtons();
      if (done === false) {
        ctx.store.delete([feature.id]);
      }
    },
    render: function(geojson, push) {
      geojson.properties.active = geojson.properties.id === feature.id ? 'true' : 'false';
      if (geojson.properties.active === 'false') {
        push(geojson);
      }
    }
  };
};
