const appRouter= (app,fs)=>{
	
	const dataPath="./data/personas.json";
	
	app.get("/personas",(req,res)=>{
		fs.readFile(dataPath,"utf8",(err,data)=>{
			if(err){
				console.log(err);
				throw err;
			}
			res.send(JSON.parse(data));
		});		
	});
	
	
}
module.exports =appRouter;