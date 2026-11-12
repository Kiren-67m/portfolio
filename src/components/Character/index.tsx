import Scene from "./Scene";

const CharacterModel = ({ onFirstFrame }: { onFirstFrame?: () => void }) => {
  return <Scene onFirstFrame={onFirstFrame} />;
};

export default CharacterModel;
