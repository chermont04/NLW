import express from 'express';

const app = express();

/**
 * GET => Busca
 * POST => Salva
 * PUT => Alterar
 * DELETE => Deletar
 * PATCH => Alteração especifica
 */
  //http://localhost:3333/users
app.get("/", (request, response) => {

  return response.json({message: "Hello Word - NLW04!"});
});

// 1 Param => Rota(Recurso API)
// 2 Param => request, response
app.post("/", (request, response) => {
  // recebeu os dados para salvar
  return response.json({message: "Dados salvos com sucesso! "});
});

app.listen(3333, () => console.log('server is running'));