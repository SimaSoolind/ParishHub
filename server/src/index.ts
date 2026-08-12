// Startpunkt för ParishHub-backend.
// Skapar en webbserver med Express som lyssnar och svarar på förfrågningar.

import express from "express";

// Skapar själva servern (appen).
const app = express();

// Porten (dörren) servern lyssnar på. 3000 är vanligt vid utveckling.
const PORT = 3000;

// En route: när någon besöker startsidan "/" skickar servern tillbaka en text.
// Parametern _request används inte än, därför understreck framför namnet.
app.get("/", (_request, response) => {
  response.send("ParishHub API lever!");
});

// Startar servern så den börjar lyssna efter förfrågningar.
app.listen(PORT, () => {
  console.log(`Servern lyssnar på http://localhost:${PORT}`);
});
