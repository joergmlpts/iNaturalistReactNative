import { View } from "components/styledComponents";
import type { Node } from "react";
import React from "react";
import {
  UrlTile
} from "react-native-maps";

const API_ENDPOINT = "https://api.inaturalist.org/v2";

type Props = {
  params?: Object,
  showPointTiles: boolean,
  withObsTiles?: boolean,
  withPressableObsTiles?: boolean
}

const ObsUrlTile = ( {
  params,
  showPointTiles,
  withObsTiles,
  withPressableObsTiles
}: Props ): Node => {
  const queryString = Object.keys( params ).map( key => `${key}=${params[key]}` ).join( "&" );

  // We want green points and (default) orange grid
  const tileUrlTemplate = showPointTiles
    ? `${API_ENDPOINT}/points/{z}/{x}/{y}.png?${queryString}&color=%2374ac00`
    : `${API_ENDPOINT}/grid/{z}/{x}/{y}.png?${queryString}`;

  if ( !tileUrlTemplate ) return <View />;
  if ( !withPressableObsTiles && !withObsTiles ) return <View />;

  // Not clear why but nesting <UrlTile> directly under <MapView> seems to
  // cause it not to update in Android when you change the URL
  return (
    <UrlTile
      testID="Map.UrlTile"
      tileSize={512}
      urlTemplate={tileUrlTemplate}
      opacity={
        showPointTiles
          ? 1
          : 0.7
      }
    />
  );
};

export default ObsUrlTile;