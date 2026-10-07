import Vide from "@rbxts/vide";

export interface GreetingProps {
  Message: () => string;
}

/** A centered line of text. Presentation only: all state arrives through props. */
export function Greeting(props: GreetingProps) {
  return (
    <textlabel
      Name="Greeting"
      AnchorPoint={new Vector2(0.5, 0.5)}
      Position={UDim2.fromScale(0.5, 0.5)}
      AutomaticSize={Enum.AutomaticSize.XY}
      BackgroundTransparency={1}
      Font={Enum.Font.BuilderSansBold}
      TextColor3={new Color3(1, 1, 1)}
      TextSize={32}
      Text={props.Message}
    />
  );
}
