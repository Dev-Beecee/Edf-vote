import VotesCountPerProject from "@/components/votes-count-per-project/VotesCountPerProject";

export default function VotesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Statistiques des Votes</h1>
        <p className="text-muted-foreground mt-2">
          Consultez les statistiques de votes pour chaque projet soumis
        </p>
      </div>
      
      <VotesCountPerProject />
    </div>
  );
}

