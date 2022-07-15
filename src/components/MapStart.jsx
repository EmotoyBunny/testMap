import React, {Component} from "react";
import {Map, Polygon, Popup, TileLayer, Marker, Circle,} from 'react-leaflet';
import {divIcon} from "leaflet";
import {renderToStaticMarkup} from "react-dom/server";
import RoomIcon from '@material-ui/icons/Room';

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
            markerSelect: [],
        };
        this.mapRef = React.createRef();
        this.markerRef = React.createRef();
    }

    componentDidUpdate = (prevState) => {
        if (this.state.markerSelect !== [] && (this.state.markerSelect !== prevState.markerSelect)) {
            this.mapRef?.current?.leafletElement.flyTo(this.state.markerSelect, 12);
        }
    };

    handleClickMarker = () => {
        this.setState({markerSelect: [47.21744415, 38.898958906]})
    };

    render() {
        const {mapOptions, markers, polygon} = this.state;
        let layer = 'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png';
        let iconColor = ["red", "black", "blue", "white", "yellow", "purple"];
        return (<div>
            <Map
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
                        onClick={() => this.handleClickMarker()}
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
            </Map>
        </div>)
    }
}

export {MapStart as MapStart}