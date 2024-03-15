import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).every(([key, value]) => {
          return value && row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) this.#database[table].push(data);
    else this.#database[table] = [data];

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex((row) => row.id === id);

    if (index === -1) {
      return false;
    } else {
      Object.entries(data).forEach(([key, value]) => {
        if (value) this.#database[table][index][key] = value;
      });

      this.#persist();
      return true;
    }
  }

  delete(table, id) {
    const index = this.#database[table].findIndex((row) => row.id === id);

    if (index === -1) {
      return false;
    } else {
      this.#database[table].splice(index, 1);
      this.#persist();
      return true;
    }
  }

  toggle(table, id) {
    const index = this.#database[table].findIndex((row) => row.id === id);

    if (index === -1) {
      return false;
    } else {
      const isCompleted = !!this.#database[table][index]["completed_at"];
      if (isCompleted) this.#database[table][index]["completed_at"] = null;
      else this.#database[table][index]["completed_at"] = new Date();
      this.#persist();
      return true;
    }
  }
}
