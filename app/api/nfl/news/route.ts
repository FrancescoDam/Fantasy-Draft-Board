export const revalidate = 900;

function getTagValue(item: string, tag: string) {
  const pattern = new RegExp("<" + tag + ">([\\s\\S]*?)</" + tag + ">");
  const match = item.match(pattern);

  if (!match) {
    return "";
  }

  return match[1]
    .replace("<![CDATA[", "")
    .replace("]]>", "")
    .trim();
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export async function GET() {
  try {
    const response = await fetch("https://www.espn.com/espn/rss/nfl/news", {
      next: {
        revalidate: 900
      }
    });

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch NFL news feed" },
        { status: 500 }
      );
    }

    const xml = await response.text();
    const itemPattern = new RegExp("<item>[\\s\\S]*?</item>", "g");
    const itemMatches = xml.match(itemPattern) || [];

    const stories = itemMatches.slice(0, 20).map((item) => {
      const title = stripHtml(getTagValue(item, "title"));
      const description = stripHtml(getTagValue(item, "description"));
      const link = stripHtml(getTagValue(item, "link"));
      const pubDate = stripHtml(getTagValue(item, "pubDate"));

      return {
        title,
        description,
        link,
        pubDate,
        source: "ESPN NFL RSS"
      };
    });

    return Response.json({
      updatedAt: new Date().toISOString(),
      count: stories.length,
      source: "ESPN NFL RSS",
      stories
    });
  } catch (error) {
    return Response.json(
      { error: "NFL news request failed" },
      { status: 500 }
    );
  }
}
