import { Button } from "@/components/ui/button";
import { createGame, ping, listGames } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Home() {
  const games = await listGames();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Button onClick={ping}>Ping</Button>
        <Button onClick={createGame}>Create Game</Button>
        <div className="w-full max-w-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game: any) => (
                <TableRow key={game.nid}>
                  <TableCell>{game.nid}</TableCell>
                  <TableCell>{game.title}</TableCell>
                  <TableCell>{game.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
