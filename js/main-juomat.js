lataaJalkkari();

async function lataaJalkkari() {
    let response = await fetch('http://localhost:3000/reseptit/juomat')
    let data = await response.json()
    return data;
}

lataaJalkkari().then(data => {
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
});


window.addEventListener("scroll", function(){
    var header = document.querySelector("navi");
    header.classList.scrollaus("sticky", window.scrollY > 0);
});