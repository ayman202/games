import GameForm from "@/components/GameForm";
import { createGame } from "@/app/actions/games";

export default function NewGamePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add a game</h1>
      <GameForm action={createGame} submitLabel="Create game" />
    </div>
  );
}
