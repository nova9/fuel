import { useEffect, useState, useRef } from 'react';

export default function Map({ center, zoom, sheds, selectedCategory  }) {
    const ref = useRef();

    useEffect(() => {
        const map = new window.google.maps.Map(ref.current, {
            center,
            zoom,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
        });

        console.log(sheds)
        const minCapacity = 500;
        sheds.forEach((shed) => {
            if (
                (shed.p92Capacity > minCapacity && selectedCategory === 0) ||
                (shed.p95Capacity > minCapacity && selectedCategory === 1) ||
                (shed.dcapacity > minCapacity && selectedCategory === 2) ||
                (shed.sdcapacity > minCapacity && selectedCategory === 3) ||
                (shed.kcapacity > minCapacity && selectedCategory === 4)
            ) {
                const shedCircle = new window.google.maps.Circle({
                    strokeColor: '#198754',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#198754',
                    fillOpacity: 0.25,
                    map,
                    center: { lat: parseFloat(shed.longitude), lng: parseFloat(shed.latitude) },
                    radius: 1000,
                });

                shedCircle.addListener('click', () => {

                });

                map.addListener('zoom_changed', () => {
                    console.log(map.getZoom())
                    if (map.getZoom() === 12) {
                        shedCircle.setRadius(200)
                    } else if (map.getZoom() === 11) {
                        shedCircle.setRadius(1000)
                    } else if (map.getZoom() === 16) {
                        shedCircle.setRadius(50)
                    } else if (map.getZoom() === 15) {
                        shedCircle.setRadius(200)
                    }
                });

                const contentString = '<div>Hello</div>';
                const infowindow = new window.google.maps.InfoWindow({
                    content: contentString,
                    position: { lat: parseFloat(shed.longitude), lng: parseFloat(shed.latitude) }
                });
                shedCircle.addListener("click", () => {
                    infowindow.open({
                        map,
                        shouldFocus: true,
                    });
                });
            }
        })
    });

    return <div className="h-screen w-full" ref={ref} id="map" />
}