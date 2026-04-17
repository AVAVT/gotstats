import TriangleIcon from "../shared/triangle-icon";

export default function ArrowBasedOnValues({ base, compare }: { base: number; compare?: number }) {
  const comparision = compare === undefined ? base >= 0 : base >= compare;
  return comparision ? (
    <TriangleIcon color="success" width={0.8} height={0.8} sizeValue="em" />
  ) : (
    <TriangleIcon color="primary" width={0.8} height={0.8} sizeValue="em" direction="down" />
  );
}
