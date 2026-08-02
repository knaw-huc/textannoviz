type ParsedContent = {
  intro: string;
  editors: string;
  vangogh: string;
};

export function parseContent(content: string): ParsedContent {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const body = doc.body;

  let intro = "";
  let editors = "";
  let vangogh = "";

  Array.from(body.children).forEach((el) => {
    const id = el.id;

    if (id === "editors") {
      editors = el.outerHTML;
    } else if (id === "vangogh") {
      vangogh = el.outerHTML;
    } else {
      intro += el.outerHTML;
    }
  });

  return {
    intro,
    editors,
    vangogh,
  };
}
