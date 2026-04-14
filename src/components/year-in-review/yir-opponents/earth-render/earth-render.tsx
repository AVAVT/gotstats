"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { chartColor1, foregroundDarkColor, tertiaryColor } from "../../../charts/settings";
import countries from "./countries.json";
import { getCountryLatLon, resolveCountrySovereignty } from "./country-lookup";
import { drawThreeGeo } from "./threeGeoJSON";

type CountryFeature = {
  properties: {
    SOVEREIGNT: string;
  };
};

type CountriesCollection = {
  features: CountryFeature[];
};

const countriesCollection = countries as CountriesCollection;

const CAMERA_DISTANCE = 3.5;

export type EarthRenderProps = {
  focusedCountry?: string;
};

function getFocusedLatLonRadians(focusedCountry?: string): [number, number] {
  const focusedSovereignty = focusedCountry ? resolveCountrySovereignty(focusedCountry) : null;
  if (!focusedSovereignty) {
    return [0, 0];
  }

  const coords = getCountryLatLon(focusedSovereignty);
  if (!coords) {
    return [0, 0];
  }

  return [(coords[0] * Math.PI) / 180, (coords[1] * Math.PI) / 180];
}

function EarthScene({ focusedCountry }: EarthRenderProps) {
  const { camera } = useThree();
  const latLon = useMemo(() => getFocusedLatLonRadians(focusedCountry), [focusedCountry]);

  const earth = useMemo(() => {
    const earthObject = new THREE.Object3D();
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    const lineMat = new THREE.LineBasicMaterial({ color: tertiaryColor });
    const sphere = new THREE.Mesh(sphereGeometry, lineMat);

    earthObject.add(sphere);
    earthObject.setRotationFromEuler(new THREE.Euler(-Math.PI / 2, 0, -Math.PI * 0.5));

    const wrapperObject = new THREE.Group();
    wrapperObject.add(earthObject);

    const focusedSovereignty = focusedCountry ? resolveCountrySovereignty(focusedCountry) : null;
    if (focusedSovereignty) {
      const focusedFeatures = countriesCollection.features.filter(
        (f) => f.properties.SOVEREIGNT === focusedSovereignty,
      );
      const otherFeatures = countriesCollection.features.filter((f) => f.properties.SOVEREIGNT !== focusedSovereignty);
      drawThreeGeo(
        { type: "FeatureCollection", features: otherFeatures },
        2,
        "sphere",
        { color: foregroundDarkColor },
        earthObject,
      );

      if (focusedFeatures.length > 0) {
        drawThreeGeo(
          { type: "FeatureCollection", features: focusedFeatures },
          2,
          "sphere",
          { color: chartColor1 },
          earthObject,
        );
      }
    } else {
      drawThreeGeo(countries, 2, "sphere", { color: 0xf8f8ff }, earthObject);
    }

    return wrapperObject;
  }, [focusedCountry]);

  useLayoutEffect(() => {
    camera.position.copy(
      new THREE.Vector3(0, CAMERA_DISTANCE * Math.sin(latLon[0]), CAMERA_DISTANCE * Math.cos(latLon[0])),
    );
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
  }, [latLon, camera]);

  return (
    <>
      <ambientLight intensity={0.1} color="blue" />
      <group rotation={new THREE.Euler(0, -latLon[1], 0)}>
        <primitive object={earth} />
      </group>

      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.6} maxPolarAngle={Math.PI - 0.6} />
    </>
  );
}

export default function EarthRender(props: EarthRenderProps) {
  return (
    <Canvas camera={{ position: [0, 0, CAMERA_DISTANCE], up: [0, 1, 0] }}>
      <EarthScene {...props} />
    </Canvas>
  );
}
