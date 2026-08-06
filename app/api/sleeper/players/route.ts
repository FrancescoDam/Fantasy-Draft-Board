export const revalidate = 3600;

export async function GET() {
  try {
    const response = await fetch("https://api.sleeper.app/v1/players/nfl", {
      next: {
        revalidate: 3600
      }
    });

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch Sleeper players" },
        { status: 500 }
      );
    }

    const players = await response.json();

    return Response.json({
      updatedAt: new Date().toISOString(),
      count: Object.keys(players).length,
      players
    });
  } catch (error) {
    return Response.json(
      { error: "Sleeper API request failed" },
      { status: 500 }
    );
  }
}
