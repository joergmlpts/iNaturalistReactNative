// @flow
import React, { useState } from "react";
import type { Node } from "react";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";

import { getTimeZone } from "../sharedHelpers/dateAndTime";
import { ObsEditContext } from "./contexts";
import createIdentification from "../components/Identify/helpers/createIdentification";

type Props = {
  children: any
}

const ObsEditProvider = ( { children }: Props ): Node => {
  const navigation = useNavigation( );
  const [currentObsNumber, setCurrentObsNumber] = useState( 0 );
  const [observations, setObservations] = useState( [] );
  const [identification, setIdentification] = useState( null );
  const [prevScreen, setPrevScreen] = useState( "ObsEdit" );

  const currentObs = observations[currentObsNumber];

  const addSound = ( sound ) => {
    if ( observations.length === 0 ) {
      const soundObs = createObservation( sound );
      setObservations( [soundObs] );
    } else if ( currentObs ) {
      const updatedObs = Array.from( observations );
      updatedObs[currentObsNumber].observationSounds = sound.observationSounds;
      setObservations( updatedObs );
    }
  };

  const mapPhotos = ( photos ) => photos.map( p => {
    if ( p.uri ) {
      return {
        uri: p.uri,
        uuid: p.uuid
      };
    } else {
      // this is needed to navigate to CV suggestions from ObsDetail
      // rather than any of the camera/gallery screens
      return {
        uri: p.photo.url,
        uuid: p.uuid
      };
    }
  } );

  const addPhotos = ( photos ) => {
    if ( observations.length === 0 ) {
      const photoObs = createObservation( photos[0] );
      photoObs.observationPhotos = mapPhotos( photos );
      setObservations( [photoObs] );
    } else if ( currentObs ) {
      const updatedObs = Array.from( observations );
      let obsPhotos = updatedObs[currentObsNumber].observationPhotos;
      const newPhotos = mapPhotos( photos );

      if ( obsPhotos ) {
        updatedObs[currentObsNumber].observationPhotos = obsPhotos.concat( newPhotos );
        setObservations( updatedObs );
      } else {
        updatedObs[currentObsNumber].observationPhotos = newPhotos;
        setObservations( updatedObs );
      }
    }
  };

  const addObservations = ( obs ) => {
    if ( observations.length === 0 ) {
      const newObs = obs.map( o => {
        const photoObs = createObservation( o.observationPhotos[0] );
        photoObs.observationPhotos = mapPhotos( o.observationPhotos );
        return photoObs;
      } );
      setObservations( newObs );
    }
    // there is probably another option here where a user
    // can keep adding gallery photos after making observations
    // but I'm not sure how that flow will work
  };

  const createObservation = ( obs ) => {
    return {
      // object should look like Seek upload observation:
      // https://github.com/inaturalist/SeekReactNative/blob/e2df7ca77517e0c4c89f3147dc5a15ed98e31c34/utility/uploadHelpers.js#L198
      ...obs,
      captive_flag: false,
      geoprivacy: "open",
      owners_identification_from_vision_requested: false,
      project_ids: [],
      time_zone: getTimeZone( ),
      uuid: uuid.v4( )
    };
  };

  const updateObservationKey = ( key, value ) => {
    const updatedObs = observations.map( ( obs, index ) => {
      if ( index === currentObsNumber ) {
        return {
          ...obs,
          // $FlowFixMe
          [key]: value
        };
      } else {
        return obs;
      }
    } );
    setObservations( updatedObs );
  };

  const updateTaxaId = async ( taxaId ) => {
    if ( prevScreen === "ObsEdit" ) {
      updateObservationKey( "taxon_id", taxaId );
      navigation.navigate( "ObsEdit" );
    } else {
      console.log( observations[0].id, observations[0].uuid, "does id exist in obs" );
      const results = await createIdentification( { observation_id: observations[0].id, taxon_id: taxaId } );
      console.log( results, "results in update taxa id" );
      navigation.navigate( "my observations", { screen: "ObsDetail", params: { uuid: observations[0].uuid } } );
    }
  };

  const obsEditValue = {
    currentObsNumber,
    setCurrentObsNumber,
    addSound,
    addPhotos,
    addObservations,
    observations,
    setObservations,
    updateObservationKey,
    updateTaxaId,
    identification,
    setIdentification,
    setPrevScreen
  };

  return (
    <ObsEditContext.Provider value={obsEditValue}>
      {children}
    </ObsEditContext.Provider>
  );
};

export default ObsEditProvider;