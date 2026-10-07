import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { Greeting } from "./Greeting";

// Fixture props only; a story never reads live game state.
const story = CreateVideStory(
  {
    vide: Vide,
    controls: {
      Message: "Hello from a story!",
    },
  },
  (props) => <Greeting Message={props.controls.Message} />,
);

export = story;
