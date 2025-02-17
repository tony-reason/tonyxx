export { invertCoords };

const invertCoords = (coords: Coords): Coords => ({
    x: -coords.x,
    y: -coords.y
});
