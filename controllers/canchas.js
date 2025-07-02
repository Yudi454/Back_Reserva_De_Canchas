const conection =require("../config/database.js")

const getAllCanchas = (req, res) => {
  const consulta = "select * from canchas where estado_cancha=1";

  conection.query(consulta, (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.send("no hay canchas");
    } else {
      res.json(results);
    }
  });
};

const getOneCancha = (req, res) => {
  const id = req.params.id;

  const consulta = "select * from canchas where id_cancha=?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.status(404).send("No se encontró la cancha");
    } else {
      res.json(results[0]); // enviás solo la cancha, no un array
    }
  });
};

const createCanchas=(req,res)=>{
  const {imagen_cancha,precio_cancha}=req.body

  const estado_cancha=1;

  const consulta =`insert into canchas (imagen_cancha,precio_cancha,estado_cancha)
  values(?,?,?)`

  conection.query(consulta,[imagen_cancha,precio_cancha,estado_cancha],(err,results)=>{

    if(err) throw err;

    res.status(200).send({message:"cancha creada con exito"})

  })
}

const DeleteCancha=(req,res)=>{ //eliminado logico de canchas
  const id_cancha= req.params

  const consulta=`update canchas set estado_cancha=0 where id_cancha=?`

  conection.query(consulta,[id_cancha],(err,results)=>{
    if(err) throw err;
    res.status(200).send({message:"cancha eliminada"})
  })

}


const updateCanchas=(req,res)=>{
  const {id_cancha,imagen_cancha,precio_cancha,estado_cancha}=req.body

  const consulta =`update canchas set imagen_cancha=?, precio_cancha=?, estado_cancha=?
  where id_cancha=?`

  conection.query(consulta,[imagen_cancha,precio_cancha,estado_cancha,id_cancha],(err,results)=>{
    if(err) throw err;
    res.status(200).send({message:"actualizacion exitosa"})
  })
}

module.exports =  {getAllCanchas,getOneCancha,createCanchas,DeleteCancha, updateCanchas};
