class MapMock {
  on() {}
  off() {}
  remove() {}
  addSource() {}
  addLayer() {}
  getSource() {
    return { setData() {} };
  }
  fitBounds() {}
  flyTo() {}
  resize() {}
}

class MarkerMock {
  setLngLat() {
    return this;
  }
  addTo() {
    return this;
  }
  remove() {}
}

module.exports = {
  Map: MapMock,
  Marker: MarkerMock,
  NavigationControl: class NavigationControlMock {},
};
