export const revalidate = 900;

export async function GET() {
  try {
    const response = await fetch(
      "https://api.sleeper.app/v1/players/nfl/trending/add?lookback_hours=24&limit=25",
      {
        next: {
          revalidate: 900
        }
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch trending adds" },
        { status: 500 }
      );
    }

    const players = await response.json();

    return Response.json({
      updatedAt: new Date().toISOString(),
      type: "add",
      count: players.length,
      players
    });
  } catch (error) {
    return Response.json(
      { error: "Trending adds request failed" },
      { status: 500 }
    );
  }
}
