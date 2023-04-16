import conditions from "./conditions.js"
console.log(conditions);

const apiKey = 'e50e15b990ed4b09965174003231004'

const header = document.querySelector('.header')
const form = document.querySelector('.form')
const input = document.querySelector('input')


function removeCard() {
    const prevCard = document.querySelector('.card')
    if (prevCard) prevCard.remove()
}
function showError(errorMessage) {
    const html = `<div class='card'>${errorMessage}</div>`
    header.insertAdjacentHTML("afterend", html)
}
function showCard({name, country,temp_c,condition,imgPass}) {
    const html = 
`<div class="card">
    <div class="card-city">${name} <span>${country}</span></div>
    <div class="card-weather">
        <div class="card-value">${temp_c}<sup>°c</sup></div>
        <img src=${imgPass} alt="" class="card-img">
    </div>
    

    <div class="card-describtion">${condition}</div>

</div>`
header.insertAdjacentHTML("afterend", html)
}
async function getWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data);
    return data
}



form.addEventListener('submit',async function (e){
    e.preventDefault()

    let city;

    city = input.value.trim()
    
    const data = await getWeather(city)
    
    if(data.error){
        removeCard()

        showError(data.error.message)
    }else{
        removeCard()

        console.log(data.current.condition.code);
       

        const info = conditions.find(
            (obj) => obj.code === data.current.condition.code
        );

        console.log(info);
        console.log(info.languages[23]['day_text']);
        
        const filePass = './img/'+(data.current.is_day? 'day' : 'night')+'/'
        const fileName = (data.current.is_day ? info.day : info.night) + '.png'
        const imgPass = filePass + fileName
        
        console.log('fileName', filePass+fileName);

        const weatherData = {
            name:data.location.name,
            country:data.location.country,
            temp_c:data.current.temp_c,
            condition: data.current.is_day
                ?info.languages[23]["day_text"]
                :info.languages[23]["night_text"],
            imgPass,
        }
        showCard(weatherData)

         
        
    }

})
