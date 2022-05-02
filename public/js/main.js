function jokuFunktio() {
    let x = document.getElementById('etsintakentta').value;
    hae(x) 
}

async function hae(x) {
    const response = await fetch(`https://reseptit-app-heroku.herokuapp.com/reseptit/?q=${x}`)
    let data = await response.json();
    //console.log(data)
    let str = '<ul class="grid">';
        for (i = 0; i < data.length; i++) {
            //console.log(data[i]);
            str += '<li class="liItem">';
                str += '<img src="'+ data[i].thumbnail + '" class="lol">'
                str += '<h2>'+ data[i].name + '</h2>';
                str += '<p>'+ data[i].description + '</p>';
                str += '<p>'+ data[i].ingredients + '</p>';
                str += '<h3>'+ data[i].category + '</h3>';
                str += '<p>'+ data[i]._id + '</p>';
            str += '</li>';
        }
        str += '</ul>';
        document.getElementById("reseptitContainer").innerHTML = str;
}

// funktio rullaa sivun ala- tai yläosaan
window.addEventListener("scroll", function(){
    var header = document.querySelector("navi");
    header.classList.scrollaus("sticky", window.scrollY > 0);
})


