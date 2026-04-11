import { PerspectiveCamera } from "@react-three/drei";

const Camera = () => {
  return <PerspectiveCamera position={[0, 3, 8]} makeDefault fov={25} />;
};

export default Camera;
