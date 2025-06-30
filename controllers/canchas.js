const conection =require("../config/database.js")

const getAllCanchas = (req, res) => {
  const consulta = "select * from canchas";

  conection.query(consulta, (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.send("no hay canchas");
    } else {
      res.json(results);
    }
  });
};

module.exports =  {getAllCanchas};
