const expres = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const fs = require('fs');
const https = require('https');
const topojson = require('topojson-client');

const app = expres();

app.use(expres.static(path.join(__dirname,"dist")));

app.use(favicon(path.join(__dirname,"dist","Mario.ico")));

// Arrow function ()=>{}
app.get('/',function(req,res){
    res.sendFile('index.html');
});

var apiV1 = expres.Router();
var apiV2 = expres.Router();

apiV1.get('/paises/estados/ciudades', function(req,res){
    var ciudades = [];
    var worldData = []
    var worldJson = 'https://unpkg.com/world-atlas@1.1.4/world/110m.json';
    fs.readFile('dist/cities.json','UTF-8' ,function (err, data){
        //console.log(err,data);
        ciudades = JSON.parse(data).states;

        https.get(worldJson, function(response){
        
        var body = '';

        response.on('data', function(d){
            body += d;
        });
        response.on('end', function(){
            try{
                //worldData = JSON.parse(body);
                worldData = JSON.parse(body);
                worldData = topojson.feature(worldData, worldData.objects.countries);

                //console.log(JSON.parse(body).d);
                res.status(200).json({
                    status: true,
                    ciudades: ciudades,
                    worldData: worldData
                });

            }catch(err){
                console.error('Error: ',err)
            }
        });

            //console.log(response);
        })

        
    });
    
    

   

    //res.send('Bienvenido al API 1');
});
apiV2.get('/', function(req,res){
  
    var estados = [{
        name: 'Aguascalientes',
        pupulation: 123456
    },
    {
        name: 'Guerrero',
        pupulation: 123456
    }
]
res.status(200).json({
    status: true,
    estados: estados
});

    //res.send('Bienvenido al API 2');
});

app.use('/api/v1', apiV1);
app.use('/api/v2', apiV2);

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
})

