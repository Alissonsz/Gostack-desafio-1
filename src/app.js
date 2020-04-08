const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/projects/:id', (request, response, next) => {
  const {id} = request.params;

  if(!isUuid(id)){
      return response.status(400).json({error: "Invalid ID"});
  }

  return next();
});

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found!"});
  }

  const newRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found!"});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  console.log(id);

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found!"});
  }

  let repository = repositories[repositoryIndex];

  const newRepository = {
    id,
    title: repository.title,
    url: repository.url,
    techs: repository.techs,
    likes: repository.likes + 1,
  }

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

module.exports = app;
