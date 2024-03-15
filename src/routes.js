import { randomUUID } from "node:crypto";

import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const filter = req.query;
      const hasFitler = Object.entries(filter).length;

      const tasks = database.select("tasks", hasFitler ? filter : null);

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description)
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: "Missing field or description" }));

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        create_at: new Date(),
        update_at: new Date(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { body } = req;

      if (!Object.entries(body).length)
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: "Missing field and description" }));

      const hasUpdated = database.update("tasks", id, body);

      if (hasUpdated) return res.writeHead(204).end();
      else
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "Task not found" }));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const hasDeleted = database.delete("tasks", id);

      if (hasDeleted) return res.writeHead(204).end();
      else
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "Task not found" }));
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const hasToggled = database.toggle("tasks", id);

      if (hasToggled) return res.writeHead(204).end();
      else
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "Task not found" }));
    },
  },
];
