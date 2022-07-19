import React, {Component} from "react";
import {MapContainer, Polygon, Popup, TileLayer, Marker, FeatureGroup, Circle, useMapEvents} from 'react-leaflet';
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
            markers: [[47.21744415, 38.898958906],
                [47.968478649, 37.769425424],
                [47.2213858, 39.7114196],
                [47.1179735, 37.6342808],
                [47.41066, 40.101986],
                [47.568459, 38.861942],
            ],
            polygon: [[47.968478649, 37.76942542],
                [47.1179735, 37.6342808],
                [47.568459, 38.861942],
            ],
            newPolygon: [],
            markerSelect: [1, 1],
        };
        this.mapRef = React.createRef();
        this.markerRef = React.createRef();
    }

    /*  componentDidUpdate = (prevState) => {
           if (this.state.markerSelect !== [] && (this.state.markerSelect !== prevState.markerSelect)) {
               console.log(1)
               this.mapRef?.current?.leafletElement.flyTo(this.state.markerSelect, 12);
           }
       };*/

    handleClickMarker = () => {
        this.setState({markerSelect: [47.21744415, 38.898958906]});
       /* const map = useMapEvents(
            () => {
                map.flyTo([47.21744415, 38.898958906], 12)
            },
        )*/
    };

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
                        onClick={() => {
                            console.log(1)
                            //this.handleClickMarker()
                        }}
                    >
                        <Popup>
                            {(index + 1) + " [" + item[0] + ", " + item[1] + "]"}
                        </Popup>
                    </Marker>)
                })}
                <Polygon color='purple' positions={polygon}>
                    <Popup>
                        Какой-то полигон
                    </Popup>
                </Polygon>
                <Circle
                    center={[47.2213858, 39.7114196]}
                    pathOptions={{fillColor: "red"}}
                    radius={10000}
                />
                <FeatureGroup>
                    <EditControl
                        position='topleft'
                        onEdited={() => {
                        }}
                        onCreated={(e) => {
                            console.log(e);
                            if (e.layerType === 'polygon') {
                                let objectsLayer = e.layer._rings;
                                let arrayLayer = [];
                                for (let i = 0; i < objectsLayer[0].length; i++) {
                                    arrayLayer.push([objectsLayer[0][i].x, objectsLayer[0][i].y])
                                }
                                this.setState({newPolygon: arrayLayer}, () => {
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