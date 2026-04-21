"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { chartColor4, chartColor5, foregroundColor, tertiaryColor } from "@/utils/color-utils";
import countries from "./countries.json";
import { getCountryDisplayName, getCountryLatLon, resolveCountrySovereignty } from "./country-lookup";

type CountryFeature = {
  properties: {
    SOVEREIGNT: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
};

type CountriesCollection = {
  features: CountryFeature[];
};

const countriesCollection = countries as CountriesCollection;

const CAMERA_DISTANCE = 4.3;
const CAMERA_OFFSET_DEGREE = 25;
const CAMERA_ANIMATION_DURATION = 1.2;
const TEXTURE_WIDTH = 4096;
const TEXTURE_HEIGHT = 2048;
const SPHERE_SCALE = 2;

export type EarthRenderProps = {
  focusedCountry?: string;
  numberOfPlayers?: number;
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

  return [((coords[0] - CAMERA_OFFSET_DEGREE) * Math.PI) / 180, (coords[1] * Math.PI) / 180];
}

function createBillboardTexture(countryName: string, numberOfPlayers: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = chartColor5;
  ctx.font = "bold 52px Geist";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(countryName, canvas.width / 2, 0);

  ctx.fillStyle = foregroundColor;
  ctx.font = "32px Geist";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(`${numberOfPlayers} players`, canvas.width / 2, 60);

  // ctx.beginPath();
  // ctx.moveTo(canvas.width / 2, 120);
  // ctx.lineTo(canvas.width / 2, canvas.height - 30);
  // ctx.strokeStyle = chartColor3;
  // ctx.lineWidth = 3;
  // ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function drawFeatureOnCanvas(
  ctx: CanvasRenderingContext2D,
  feature: CountryFeature,
  width: number,
  height: number,
): void {
  const { geometry } = feature;
  if (!geometry) return;

  const drawRings = (rings: number[][][]) => {
    ctx.beginPath();
    for (const ring of rings) {
      for (let i = 0; i < ring.length; i++) {
        const lon = ring[i][0];
        const lat = ring[i][1];
        const x = ((lon + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
    ctx.fill("evenodd");
    ctx.stroke();
  };

  if (geometry.type === "Polygon") {
    drawRings(geometry.coordinates as number[][][]);
  } else if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates as number[][][][]) {
      drawRings(polygon);
    }
  }
}

function createEarthTexture(canvas: HTMLCanvasElement, focusedSovereignty: string | null): THREE.CanvasTexture {
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Ocean
  ctx.fillStyle = tertiaryColor;
  ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

  // Default countries
  ctx.fillStyle = chartColor4;
  ctx.strokeStyle = tertiaryColor;
  ctx.lineWidth = 1;
  for (const feature of countriesCollection.features) {
    if (focusedSovereignty && feature.properties.SOVEREIGNT === focusedSovereignty) continue;
    drawFeatureOnCanvas(ctx, feature, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  }

  // Focused country
  if (focusedSovereignty) {
    const highlightColor = chartColor5;
    ctx.fillStyle = highlightColor;
    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = 0.4;
    for (const feature of countriesCollection.features) {
      if (feature.properties.SOVEREIGNT === focusedSovereignty) {
        drawFeatureOnCanvas(ctx, feature, TEXTURE_WIDTH, TEXTURE_HEIGHT);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.offset.x = 0.25;
  return texture;
}

function Billboard({
  position,
  countryName,
  numberOfPlayers,
}: {
  position: THREE.Vector3;
  countryName: string;
  numberOfPlayers: number;
}) {
  const texture = useMemo(() => createBillboardTexture(countryName, numberOfPlayers), [countryName, numberOfPlayers]);
  const spriteMaterial = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
      }),
    [texture],
  );

  return (
    <sprite
      position={[position.x, position.y, position.z]}
      scale={[SPHERE_SCALE, SPHERE_SCALE, 1]}
      material={spriteMaterial}
    />
  );
}

function EarthScene({ focusedCountry, numberOfPlayers }: EarthRenderProps) {
  const { camera, gl } = useThree();
  const earthGroupRef = useRef<THREE.Group>(null);
  const latLon = useMemo(() => getFocusedLatLonRadians(focusedCountry), [focusedCountry]);
  const focusedCountryName = useMemo(
    () => (focusedCountry ? getCountryDisplayName(focusedCountry) : ""),
    [focusedCountry],
  );
  const animationStartLatLonRef = useRef<[number, number]>([0, 0]);
  const targetLatLonRef = useRef<[number, number]>([latLon[0], latLon[1]]);
  const animatedLatLonRef = useRef<[number, number]>([latLon[0], latLon[1]]);
  const animationElapsedRef = useRef(0);
  const isAnimatingRef = useRef(true);
  const lookAtTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const billboardPosition = useMemo(() => {
    if (!focusedCountry) return null;
    const lat = latLon[0] + (CAMERA_OFFSET_DEGREE * Math.PI) / 180;
    const lon = latLon[1];

    const x = Math.sin(lon) * Math.cos(lat);
    const y = Math.sin(lat);
    const z = Math.cos(lon) * Math.cos(lat);

    return new THREE.Vector3(SPHERE_SCALE * x, SPHERE_SCALE * y, SPHERE_SCALE * z);
  }, [focusedCountry, latLon]);

  const canvas = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = TEXTURE_WIDTH;
    canvas.height = TEXTURE_HEIGHT;
    return canvas;
  }, []);

  const texture = useMemo(() => {
    const focusedSovereignty = focusedCountry ? resolveCountrySovereignty(focusedCountry) : null;
    const tex = createEarthTexture(canvas, focusedSovereignty);
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, [focusedCountry, gl, canvas]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(SPHERE_SCALE, 128, 128), []);
  const sphereMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        toneMapped: false,
      }),
    [texture],
  );

  useEffect(() => {
    return () => {
      sphereMaterial.dispose();
    };
  }, [sphereMaterial]);

  useEffect(() => {
    animationStartLatLonRef.current = [animatedLatLonRef.current[0], animatedLatLonRef.current[1]];
    targetLatLonRef.current = [latLon[0], latLon[1]];
    animationElapsedRef.current = 0;

    const latDiff = Math.abs(animationStartLatLonRef.current[0] - targetLatLonRef.current[0]);
    const lonDiff = Math.abs(animationStartLatLonRef.current[1] - targetLatLonRef.current[1]);
    isAnimatingRef.current = latDiff > 1e-6 || lonDiff > 1e-6;
  }, [latLon]);

  useFrame((_, delta) => {
    if (!isAnimatingRef.current) return;

    animationElapsedRef.current = Math.min(animationElapsedRef.current + delta, CAMERA_ANIMATION_DURATION);
    const t = THREE.MathUtils.clamp(animationElapsedRef.current / CAMERA_ANIMATION_DURATION, 0, 1);

    animatedLatLonRef.current[0] = THREE.MathUtils.lerp(
      animationStartLatLonRef.current[0],
      targetLatLonRef.current[0],
      THREE.MathUtils.smootherstep(t, 0, 1),
    );
    animatedLatLonRef.current[1] = THREE.MathUtils.lerp(
      animationStartLatLonRef.current[1],
      targetLatLonRef.current[1],
      THREE.MathUtils.smootherstep(t, 0, 1),
    );

    const animatedLat = animatedLatLonRef.current[0];
    camera.position.set(0, CAMERA_DISTANCE * Math.sin(animatedLat), CAMERA_DISTANCE * Math.cos(animatedLat));
    camera.lookAt(lookAtTarget);

    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y = -animatedLatLonRef.current[1];
    }

    if (t >= 1) {
      isAnimatingRef.current = false;
    }
  });

  return (
    <>
      <group ref={earthGroupRef} position={[0, 0, 0]}>
        <mesh geometry={sphereGeometry} material={sphereMaterial} />
        {focusedCountry && billboardPosition && numberOfPlayers !== undefined && (
          <Billboard position={billboardPosition} countryName={focusedCountryName} numberOfPlayers={numberOfPlayers} />
        )}
      </group>

      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.6} maxPolarAngle={Math.PI} />
    </>
  );
}

export default function EarthRender(props: EarthRenderProps) {
  return (
    <Canvas camera={{ fov: 80, position: [0, 0, CAMERA_DISTANCE], up: [0, 1, 0] }}>
      <EarthScene focusedCountry={props.focusedCountry} numberOfPlayers={props.numberOfPlayers} />
    </Canvas>
  );
}
