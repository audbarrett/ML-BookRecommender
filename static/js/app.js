// Function to calculate Levenshtein distance between two strings
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];

  // Initialize matrix
  var i, j;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Calculate distances
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Substitution
          matrix[i][j - 1] + 1,     // Insertion
          matrix[i - 1][j] + 1      // Deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Function to find closest matches
function findClosestMatches(input, options, limit) {
  var matches = [];

  // Calculate Levenshtein distance for each option
  for (var i = 0; i < options.length; i++) {
    var distance = levenshteinDistance(input, options[i].toUpperCase());
    matches.push({ index: i, distance: distance });
  }

  // Sort matches by distance
  matches.sort((a, b) => a.distance - b.distance);

  // Return top 'limit' matches
  return matches.slice(0, limit);
}

function dropdownFunction() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('searchInput').value.toUpperCase();
  ul = document.getElementById("bookOptions");
  li = ul.getElementsByTagName('li');
  
  // Array to hold closest matches
  var closestMatches = findClosestMatches(input, Array.from(li).map(item => item.textContent.toUpperCase()), 5);

  // Show the top 5 matches
  for (i = 0; i < li.length; i++) {
    if (closestMatches.some(match => match.index === i)) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }

  // Show dropdown menu if there is a search query
  ul.style.display = input ? 'block' : 'none';
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

