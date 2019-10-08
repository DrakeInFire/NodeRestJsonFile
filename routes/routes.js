const personasRoutes=require("./personas");

const appRouter= (app,fs)=>{
	
	app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    personasRoutes(app, fs);
	
	
}
module.exports =appRouter;