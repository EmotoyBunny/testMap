import React, {Component} from "react";
import {MapContainer, Polygon, Popup, TileLayer, Marker, FeatureGroup, Circle, useMapEvent} from 'react-leaflet';
import {divIcon} from "leaflet";
import {EditControl} from "react-leaflet-draw"
import {renderToStaticMarkup} from "react-dom/server";
import RoomIcon from '@material-ui/icons/Room';
import 'leaflet/dist/leaflet.css';
import "leaflet"
import L from "leaflet";
import "leaflet-draw"
import "leaflet-draw/dist/leaflet.draw-src.css"

class MapStart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapOptions: {
                center: [47.5690, 38.8697],
                zoom: 9
            },
            markers: [
                [47.21744415, 38.898958906],
                [47.968478649, 37.769425424],
                [47.2213858, 39.7114196],
                [47.1179735, 37.6342808],
                [47.41066, 40.101986],
                [47.568459, 38.861942],
            ],
            polygon: [
                [
                    [47.968478649, 37.76942542],
                    [47.1179735, 37.6342808],
                    [47.568459, 38.861942],
                ]
            ],
            newPolygon: [],
            markerSelect: [47.21744415, 38.898958906], // координаты Таганрога
        };
        this.mapRef = React.createRef();
        this.markerRef = React.createRef();
        this.polygonRef = React.createRef();
    }

    render() {
        const {mapOptions, markers, polygon} = this.state;
        let layer = 'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png';
        let iconColor = ["red", "black", "blue", "white", "yellow", "purple"];
        return (<div>
            <MapContainer
                zoom={mapOptions.zoom}
                style={{
                    height: "100vh",
                    width: "100vw"
                }}

                center={mapOptions.center}
                ref={this.mapRef}
            >
                <TileLayer
                    url={layer}
                />
                <FeatureGroup>
                    <Circle
                        center={[47.2213858, 39.7114196]}
                        pathOptions={{fillColor: "red"}}
                        radius={10000}
                    />
                    {markers.map((item, index) => {
                        return (<Marker
                            position={item}
                            key={index}
                            ref={this.markerRef}
                            icon={divIcon({
                                className: '',
                                iconAnchor: [18, 31],
                                html: renderToStaticMarkup(<RoomIcon
                                    style={{
                                        color: iconColor[index],
                                        width: "36px",
                                        height: "36px"
                                    }}
                                />),
                            })}
                            title={index}
                            eventHandlers={{
                                click: () => {
                                    this.mapRef.current.setView(this.state.markerSelect, 12)
                                }
                            }}

                        >
                            <Popup>
                                {(index + 1) + " [" + item[0] + ", " + item[1] + "]"}
                            </Popup>
                        </Marker>)
                    })}
                    {polygon.map((item, index) => {
                        return (
                            <Polygon color='purple' key={index} ref={this.polygonRef} positions={item}>
                                <Popup>
                                    {"Какой-то полигон №" + index}
                                </Popup>
                            </Polygon>)
                    })}
                    <EditControl
                        position='topleft'
                        onEdited={() => {
                        }}
                        onCreated={(e) => {
                            console.log(e);
                            if (e.layerType === 'polygon') {
                                let objectsLayer = e.layer._rings;
                                let array = polygon;
                                let arrayLayer = [];
                                for (let i = 0; i < objectsLayer[0].length; i++) {
                                    arrayLayer.push([objectsLayer[0][i].x, objectsLayer[0][i].y])
                                }
                                array.push(arrayLayer);
                                this.setState({newPolygon: arrayLayer, polygon: array}, () => {
                                    console.log(this.state.newPolygon);
                                    let text = "";
                                    for (let i = 0; i < this.state.newPolygon.length; i++) {
                                        text = text + "Координата " + (i + 1) + ": " + this.state.newPolygon[i] + "\n"
                                    }
                                    alert(text)
                                })
                            }
                        }}
                        onDeleted={() => {
                        }}
                        draw={{
                            rectangle: false
                        }}
                    />
                </FeatureGroup>
            </MapContainer>
        </div>)
    }
}

export {MapStart as MapStart}