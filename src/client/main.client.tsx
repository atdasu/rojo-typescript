import Vide, { mount } from "@rbxts/vide";
import { Greeting } from "client/UI/Greeting/Greeting";
import { createReactiveState } from "client/UI/ReactiveState";
import { STARTER_MESSAGE } from "shared/constants";

const Players = game.GetService("Players");

const state = createReactiveState(Vide, { Message: STARTER_MESSAGE });

print(`[Client] ${STARTER_MESSAGE}`);

mount(
  () => (
    <screengui Name="Starter" ResetOnSpawn={false}>
      <Greeting Message={() => state().Message} />
    </screengui>
  ),
  Players.LocalPlayer.WaitForChild("PlayerGui"),
);
