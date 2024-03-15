import { parse } from "csv-parse";
import { createReadStream } from "node:fs";

const csvPath = new URL("./tasks.csv", import.meta.url);

(async () => {
  const stream = createReadStream(csvPath);
  const parser = stream.pipe(parse({ delimiter: ",", fromLine: 2 }));

  for await (const record of parser) {
    const [title, description] = record;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });
    
  }
})();
