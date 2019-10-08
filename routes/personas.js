const personasRoutes= (app,fs)=>{
	
	const dataPath="./data/personas.json";
	const dataRestorePath="./data/personasOriginal.json";
	
	const readFile = (callback, returnJson = true, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

   const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };
	const isNullUndefined=(valor)=>{
		if(valor===null|| valor===undefined)
			return true;
		return false
	}
	const isEmptyString=(valor)=>{
		let result=false;
		try{
			if(valor===null|| valor===undefined || valor.trim()===""){
				result=true;
			}		
		}catch(err){
			console.log(err);
			result=true;
		}
		return result;
	}
	
	const validaEntrada=(datos,personas,updateDni=false)=>{
		console.log(datos);
		let error=true;
		if(isEmptyString(datos.nombre)){
			error="campo nombre obligatorio";
		}else if(isEmptyString(datos.apellidos)){
			error="campo apellidos obligatorio";
		}else if(isEmptyString(datos.dni)){
			error="campo dni obligatorio";
		}else if(isNaN(datos.edad)){
			error="campo edad obligatorio y numerico";
		}else if(updateDni!==false){
			console.log("ACTUALIZAR",updateDni);
			let find=false;
			personas.forEach((value,index)=>{
				console.log(index,value);
				if(value.dni===updateDni){
					find=true;
				}else if(value.dni ===datos.dni){
					error="El dni esta en uso"
				}
			});
			if(!find){
				error="El usuario no existe";
			}
		}else {

			personas.forEach((value)=>{
				if(value.dni===datos.dni){
					error="dni en uso";
				}
			});
		}
		
		
		console.log(error);
		return error;
	}
	
	app.get("/personas",(req,res)=>{
		readFile((data)=>{
			console.log(data)
			console.log(data[0]);
			res.send(data);
		});
	});
	app.get("/personas/restore",(req,res)=>{
		console.log("RESTORE");
		readFile((data)=>{
			console.log(data);
			writeFile(JSON.stringify(data,null,2),()=>{
				res.send("");	
			});
		},true,dataRestorePath);
	});
	app.get("/personas/:id",(req,res)=>{
		readFile((data)=>{
			var result;
			const dni=req.params["id"];
			console.log("ID",dni);
			data.forEach((value)=>{
				if(value.dni===dni){
					result=value;
				}
			});
			console.log(result)
			res.send(result);
		});
	})
	app.post("/personas",(req,res)=>{
		let nuevaPersona=req.body;
		readFile((data)=>{
			let error=validaEntrada(nuevaPersona,data);
			console.log(error);
			if(error!== true){
				res.status(400).send({
					error:error
				})
				return;
			}
			data.push(nuevaPersona);
			writeFile(JSON.stringify(data,null,2),()=>{
				res.send(nuevaPersona);	
			});			
		});		
	});
	
	app.put("/personas/:id",(req,res)=>{
		const dniOld=req.params["id"];
		readFile((data)=>{
			let personaUpdte=req.body;
			let error=validaEntrada(personaUpdte,data,dniOld);
			console.log(error);
			if(error!== true){
				res.status(400).send({
					error:error
				})
				return;
			}
			let indiceActualizar;
			data.forEach((value,index)=>{
				if(value.dni===dniOld){
					indiceActualizar=index;
				}
			});
			data[indiceActualizar]=personaUpdte;
			writeFile(JSON.stringify(data,null,2),()=>{
				res.send(personaUpdte);	
			});			
		});		
		
	});
	app.delete("/personas/:id",(req,res)=>{
		const dni=req.params["id"];
		readFile((data)=>{
			let indiceEliminar=-1;
			data.forEach((value,index)=>{
				if(value.dni===dni){
					indiceEliminar=index;
				}
			});
			if(indiceEliminar!==-1){
				data.splice(indiceEliminar);
			}		
			writeFile(JSON.stringify(data,null,2),()=>{
				res.send("");	
			});
		});
	});
	
	
}
module.exports =personasRoutes;