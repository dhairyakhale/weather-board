const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')

const apiKey = 'f1fe7a5567b5a2f7fdbdea39aa9c0ca5'

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

app.get('/', (req, res)=> {
    //res.send('Hello World!')
    res.render('index')
})

app.post('/', (req, res)=> {
    let city = req.body.city
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, (err, response, body)=> {
        if(err){
            res.render('index', {temp: null, error: "Error, please try again."})
        } else {
            let Weather = JSON.parse(body)
            if(Weather.main == undefined){
                res.render('index', {temp: null, error: "Error, please try again."});
            } else {
				var descText = Weather.weather[0].description;
				descText = descText.charAt(0).toUpperCase()+descText.slice(1);

				var speedText = Math.round(Weather.wind.speed*(36))/10;

				res.render('index', {temp: Weather.main.temp, humidity: Weather.main.humidity,
					cityname: Weather.name, condition_id: `owf-${Weather.weather[0].id}`,
					wind_speed: speedText, wind_deg: Weather.wind.deg, 
					desc: descText, clouds: Weather.clouds.all, error: null})
            }
        }
    })
})


app.listen(5000, ()=> {
    console.log('Example app listening on port 5000!')
})