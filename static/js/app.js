function dropdownFunction() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('searchInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("bookOptions");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    txtValue = li[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = ""; 
    } else {
      li[i].style.display = "none";
    }

  }

  // Show dropdown menu if there is a search query
  ul.style.display = filter ? 'block' : 'none';
}

function Sidebaropen(){
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'flex';
}

function Sidebarclose(){
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'none';
}

fetch("http://127.0.0.1:5000/titles")
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to get list of book titles');
    }
    return response.json();
  })
  .then(data => {
    titles = data['titles'];
    let list = document.getElementById("bookOptions");
    for (i=0;i<titles.length;++i){
        let li = document.createElement('li');
        li.innerText = titles[i];
        li.id = titles[i];
        li.addEventListener('click', selectInput);
        list.appendChild(li);
  }})
  .catch(error => {
    console.error('Error:', error);
  });

  function selectInput(e){
    input = document.getElementById('searchInput');
    input.value = e.currentTarget.id;
    ul = document.getElementById("bookOptions");
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
      txtValue = li[i].innerText;
        li[i].style.display = "none";
  
    }
    recommendations()
  }

  function recommendations(){
    input = encodeURIComponent(document.getElementById('searchInput').value);
    fetch('http://127.0.0.1:5000/recs/'+ input)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to get book recommendations :(');
      }
      return response.json();
    })
    .then(data => {
      recs = data['recommendations'];
      let list = document.getElementById("reclist");
      while(list.firstChild){
        list.removeChild(list.firstChild)
      }
      for (i=0;i<recs.length;++i){
          let li = document.createElement('li');
          li.innerText =recs[i];
          list.appendChild(li);
    }})
    .catch(error => {
      console.error('Error:', error);
    });
  }
