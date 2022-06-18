import { useEffect, useState, useRef } from 'react';

export default function Map({ center, zoom, sheds, selectedCategory, minOil, includeYesterday }) {
    const ref = useRef();

    useEffect(() => {
        const map = new window.google.maps.Map(ref.current, {
            center,
            zoom,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            gestureHandling: 'greedy',
            zoomControl: false,

        });

        console.log(sheds)
        sheds.forEach((shed) => {
            if (
                (shed.p92Capacity > minOil && selectedCategory === 0) ||
                (shed.p95Capacity > minOil && selectedCategory === 1) ||
                (shed.dcapacity > minOil && selectedCategory === 2) ||
                (shed.sdcapacity > minOil && selectedCategory === 3) ||
                (shed.kcapacity > minOil && selectedCategory === 4)
            ) {
                if (!includeYesterday && !shed.shedownerupdatetoday){
                    //pass
                } else {
                    const shedCircle = new window.google.maps.Circle({
                        strokeColor: shed.shedownerupdatetoday ? '#198754' : '#fd7e14',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: shed.shedownerupdatetoday ? '#198754' : '#fd7e14',
                        fillOpacity: 0.25,
                        map,
                        center: { lat: parseFloat(shed.longitude), lng: parseFloat(shed.latitude) },
                        radius: 1000,
                    });

                    shedCircle.addListener('click', () => {

                    });

                    map.addListener('zoom_changed', () => {
                        // console.log(map.getZoom())
                        if (map.getZoom() === 12) {
                            shedCircle.setRadius(200)
                        } else if (map.getZoom() === 11) {
                            shedCircle.setRadius(1000)
                        } else if (map.getZoom() === 17) {
                            shedCircle.setRadius(50)
                        } else if (map.getZoom() === 16) {
                            shedCircle.setRadius(200)
                        } else if (map.getZoom() === 19) {
                            shedCircle.setRadius(10)
                        } else if (map.getZoom() === 18) {
                            shedCircle.setRadius(50)
                        }
                    });

                    const contentString = `
                    <div class="space-y-2">
                        <div class="text-red-500 shadow h-16 w-48 rounded-lg">
                            ${shed.lastupdateddate}
                        </div>
                    </div>
                `
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: contentString,
                        position: { lat: parseFloat(shed.longitude), lng: parseFloat(shed.latitude) }
                    });
                    shedCircle.addListener("click", () => {
                        infoWindow.open({
                            map,
                            shouldFocus: true,
                        });
                    });
                }
            }
        })
    });

    return <div className="h-screen w-full" ref={ref} id="map" />
}