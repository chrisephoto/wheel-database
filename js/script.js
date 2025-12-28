window.onload = function() {
  initialize()
};

function initialize() {
  // add event listeners
  document.getElementById('wheel-details-close').addEventListener('click', closeDetails);
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // populate filters
  populateFilters();

  // populate wheel list
  for (let i = 0; i < dataset.length; i++) {
    populateGrid(i)
  }

  // check cookies and apply preferences
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const theme = getCookie('theme');
  if (theme == 'theme-dark') {
    document.querySelector('body').classList = 'theme-dark';
    document.querySelector('#theme-toggle').innerHTML = 'light_mode';
  }

  // get current url with parameters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // add search query to search input
  const urlSearch = urlParams.get('q')
  document.getElementById('input-search').value = urlSearch;

  // if brand parameter is valid, set brand input
  const urlBrand = urlParams.get('b')
  if (urlBrand) {
    for (let i = 0; i < document.getElementById('input-brand').length; i++) {
      if (urlBrand == document.getElementById('input-brand').options[i].value) {
        document.getElementById('input-brand').value = urlBrand;
      }
    }
  }

  // if manufacturer parameter is valid, set manufacturer input
  const urlManufacturer = urlParams.get('m')
  if (urlManufacturer) {
    for (let i = 0; i < document.getElementById('input-manufacturer').length; i++) {
      if (urlManufacturer == document.getElementById('input-manufacturer').options[i].value) {
        document.getElementById('input-manufacturer').value = urlManufacturer;
      }
    }
  }

  // if style parameter is valid, set style input
  const urlStyle = urlParams.get('s')
  if (urlStyle) {
    for (let i = 0; i < document.getElementById('input-style').length; i++) {
      if (urlStyle == document.getElementById('input-style').options[i].value) {
        document.getElementById('input-style').value = urlStyle;
      }
    }
  }

  // if construction parameter is valid, set construction input
  const urlConstruction = urlParams.get('c')
  if (urlConstruction) {
    for (let i = 0; i < document.getElementById('input-construction').length; i++) {
      if (urlConstruction == document.getElementById('input-construction').options[i].value) {
        document.getElementById('input-construction').value = urlConstruction;
      }
    }
  }

  // if diameter parameter is valid, set diameter input
  const urlDiameter = urlParams.get('d')
  if (urlDiameter) {
    for (let i = 0; i < document.getElementById('input-diameter').length; i++) {
      if (urlDiameter == document.getElementById('input-diameter').options[i].value) {
        document.getElementById('input-diameter').value = urlDiameter;
      }
    }
  }

  // if pcd parameter is valid, set pcd input
  const urlPCD = urlParams.get('p')
  if (urlPCD) {
    for (let i = 0; i < document.getElementById('input-pcd').length; i++) {
      if (urlPCD == document.getElementById('input-pcd').options[i].value) {
        document.getElementById('input-pcd').value = urlPCD;
      }
    }
  }

  // run applyFilter function
  applyFilter();

  // if wheel id is valid, run populateDetails function
  const urlId = urlParams.get('id')
  for (let i = 0; i < dataset.length; i++) {
    if (dataset[i].id == urlId) {
      populateDetails(i);
    }
  }
}

// functions
function populateFilters() {
    // create array of all unique brands from the database
    brandArray = [];
    for (let i = 0; i < dataset.length; i++) {
        if(brandArray.indexOf(dataset[i].brand) === -1) {
            brandArray.push(dataset[i].brand);
        }
    }
    brandArray = brandArray.sort(); // sort the array alphabetically

    // populate DOM with brands
    for (let i = 0; i < brandArray.length; i++) {
        const input = document.getElementById('input-brand');
        const option = document.createElement('option');
        option.value = brandArray[i];
        option.innerHTML = brandArray[i];
        input.appendChild(option);
    }

    // create array of all unique brands from the database
    manufacturerArray = [];
    for (let i = 0; i < dataset.length; i++) {
        if(manufacturerArray.indexOf(dataset[i].manufacturer) === -1 && dataset[i].manufacturer != 'Unverified') {
            manufacturerArray.push(dataset[i].manufacturer);
        }
    }
    manufacturerArray = manufacturerArray.sort(); // sort the array alphabetically

    // populate DOM with manufacturers
    for (let i = 0; i < manufacturerArray.length; i++) {
        const input = document.getElementById('input-manufacturer');
        const option = document.createElement('option');
        option.value = manufacturerArray[i];
        option.innerHTML = manufacturerArray[i];
        input.appendChild(option);
    }
}

function populateGrid(i) {
  const content = document.querySelector('#wheel-list > div');
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  const figcaption = document.createElement('figcaption');
  const div = document.createElement('div');
  content.appendChild(figure);
  figure.id = dataset[i].id;
  figure.onclick = function(){populateDetails(i)};
  figure.appendChild(img);
  img.src = "images/" + dataset[i].id + "/00.png";
  figure.appendChild(figcaption);
  figcaption.innerHTML = `<p>${dataset[i].brand}</p>\n<p>${dataset[i].model}</p>`;
}

function populateDetails(i) {
  //scroll details to top of page
  document.getElementById('wheel-details').scrollTo(0,0);

  //hide default message and show details
  document.querySelector('#wheel-details-message').classList = 'hidden';
  document.querySelector('#wheel-details-container').classList = '';
  
  //clear detail information
  if (document.querySelector('#wheel-details-hero img')) {
    document.querySelector('#wheel-details-hero img').remove();
  }
  document.getElementById('wheel-header-tags').innerHTML = "";
  document.getElementById('wheel-info-construction').innerHTML = "";
  document.getElementById('wheel-info-colors').innerHTML = "";
  const images = document.querySelectorAll('#wheel-images a');
  images.forEach(images => {
    images.remove();
  });
  const related = document.getElementById('wheel-related');
  related.innerHTML = '';
  const rows = document.querySelectorAll('#wheel-specs tr:not(:first-of-type)');
  rows.forEach(rows => {
    rows.remove();
  });
  document.getElementById('wheel-links').innerHTML = "";

  //load new detail information
  const target = document.getElementById('wheel-details-hero');
  const image  = document.createElement('img');
  target.appendChild(image);
  image.src = "images/" + dataset[i].id + "/00.png";
  document.getElementById('wheel-header-brand').innerHTML = dataset[i].brand;
  document.getElementById('wheel-header-model').innerHTML = dataset[i].model;
  for (let j = 0; j < dataset[i].construction.length; j++) {
    document.getElementById('wheel-header-tags').innerHTML += `<span onclick="resetFilter();document.getElementById('input-search').value='${dataset[i].construction[j]}';applyFilter();">${dataset[i].construction[j]}</span>\n`;
  }
  document.getElementById('wheel-header-tags').innerHTML += `<span onclick="resetFilter();document.getElementById('input-style').value='${dataset[i].style}';applyFilter();">${dataset[i].style}</span>\n`;
  for (let j = 0; j < dataset[i].tags.length; j++) {
    document.getElementById('wheel-header-tags').innerHTML += `<span onclick="resetFilter();document.getElementById('input-search').value='${dataset[i].tags[j]}';applyFilter();">${dataset[i].tags[j]}</span>\n`;
  }
  document.getElementById('wheel-header-description').innerHTML = dataset[i].description;
  document.getElementById('wheel-info-brand').innerHTML = `<a onclick="resetFilter();document.getElementById('input-brand').value = '${dataset[i].brand}';applyFilter();">${dataset[i].brand}</a>`;
  document.getElementById('wheel-info-model').innerHTML = dataset[i].model;
  document.getElementById('wheel-info-manufacturer').innerHTML = `<a onclick="resetFilter();document.getElementById('input-manufacturer').value = '${dataset[i].manufacturer}';applyFilter();">${dataset[i].manufacturer}</a>`;
  if (dataset[i].year_start == dataset[i].year_end) {
    document.getElementById('wheel-info-years').innerHTML = dataset[i].year_start;
  }
  else {
    document.getElementById('wheel-info-years').innerHTML = dataset[i].year_start + ' - ' + dataset[i].year_end;
  }
  document.getElementById('wheel-info-origin').innerHTML = dataset[i].origin;
  for (let j = 0; j < dataset[i].construction.length; j++) {
    if (j != 0) {
      document.getElementById('wheel-info-construction').innerHTML += ", ";
    }
    document.getElementById('wheel-info-construction').innerHTML += `<span>${dataset[i].construction[j]}</span>`;
  }
  for (let j = 0; j < dataset[i].colors.length; j++) {
    document.getElementById('wheel-info-colors').innerHTML += `<span>${dataset[i].colors[j]}</span>\n`;
  }
  for (let j = 0; j < dataset[i].sizes.length; j++) {
    const table = document.querySelector('#wheel-specs tbody');
    const row  = document.createElement('tr');
    table.appendChild(row);
    for (const data in dataset[i].sizes[j]) {
      const cell = document.createElement('td');
      const text = document.createTextNode(dataset[i].sizes[j][data]);
      row.appendChild(cell);
      cell.appendChild(text);
    }
  }
  for (let j = 0; j < dataset[i].images.length; j++) {
    const target = document.getElementById('wheel-images');
    const link = document.createElement('a');
    const image  = document.createElement('img');
    target.appendChild(link);
    link.href = "images/" + dataset[i].id + "/" + dataset[i].images[j];
    link.target = '_blank';
    link.appendChild(image);
    image.src = "images/" + dataset[i].id + "/" + dataset[i].images[j];
  }
  if (dataset[i].related.length > 0) {
    const container = document.getElementById('wheel-related-container');
    container.classList = '';
    for (let j = 0; j < dataset[i].related.length; j++) {
      for (let k = 0; k < dataset.length; k++) {
        if (dataset[k].id == dataset[i].related[j]) {
          const target = document.getElementById('wheel-related');
          const figure = document.createElement('figure');
          const img = document.createElement('img');
          const figcaption = document.createElement('figcaption');
          const div = document.createElement('div');
          target.appendChild(figure);
          figure.appendChild(img);
          figure.onclick = function(){loadDetails(dataset[i].related[j])};
          img.src = "images/" + dataset[i].related[j] + "/00.png";
          figure.appendChild(figcaption);
          figcaption.innerHTML = `<p>${dataset[k].brand}</p>\n<p>${dataset[k].model}</p>`;
        }
      }
    }    
  }
  else {
    const target = document.getElementById('wheel-related-container');
    target.classList = 'hidden';
  }
  if (dataset[i].links.length > 0) {
    document.getElementById('wheel-links-container').classList = '';
    for (let j = 0; j < dataset[i].links.length; j++) {
      document.getElementById('wheel-links').innerHTML += `<a href="${dataset[i].links[j]}" target="_blank">${dataset[i].links[j]}</a>`;
    }    
  }
  else {
    document.getElementById('wheel-links-container').classList = 'hidden';
  }
  document.getElementById('wheel-details').classList = 'open';
  document.title = 'Wheel Database - ' + dataset[i].brand + " " + dataset[i].model;

  //update browser url/history
  var queryString = new URL(document.location);
  queryString.searchParams.set('id', dataset[i].id);
  window.history.pushState(null, '', queryString);
}

function loadDetails(id) {
  for (let i = 0; i < dataset.length; i++) {
    if (dataset[i].id == id) {
      populateDetails(i);
    }
  }
  document.getElementById('wheel-details').scrollTo(0,0);
}

function closeDetails() {
  //remove class to hide modal
  document.getElementById('wheel-details').classList = '';

  document.querySelector('#wheel-details-message').classList = '';
  document.querySelector('#wheel-details-container').classList = 'hidden';

  //update browser url/history
  document.title = 'Wheel Database';
  var queryString = new URL(document.location);
  queryString.searchParams.delete('id');
  window.history.pushState(null, '', queryString);
}

function toggleTheme() {
  if(document.querySelector('body').classList.contains('theme-light')) {
    document.querySelector('body').classList = 'theme-dark';
    document.getElementById('theme-toggle').innerHTML = 'light_mode';
    document.cookie = 'theme=theme-dark';
  }
  else {
    document.querySelector('body').classList = 'theme-light';
    document.getElementById('theme-toggle').innerHTML = 'dark_mode';
    document.cookie = 'theme=theme-light';
  }
}

function applyFilter() {
  //create array
  filterIndexes = []
  
  //set filter params
  filterSearch = document.getElementById('input-search').value;
  filterBrand = document.getElementById('input-brand').value;
  filterManufacturer = document.getElementById('input-manufacturer').value;
  filterStyle = document.getElementById('input-style').value;
  //filterConstruction = document.getElementById('input-construction').value;
  filterDiameter = document.getElementById('input-diameter').value;
  filterPCD = document.getElementById('input-pcd').value
    
  //check dataset for matches
  for (let i = 0; i < dataset.length; i++) {
    matchSearch = false;
    matchBrand = true;
    matchManufacturer = true;
    matchStyle = true;
    matchConstruction = true;
    matchDiameter = false;
    matchPCD = false;
    
    //matchSearch 
    if (!filterSearch) {
      matchSearch = true;
    }
    else {
      wheelName = dataset[i].brand + " " + dataset[i].model;
      if (wheelName.toUpperCase().includes(filterSearch.toUpperCase())) {matchSearch = true;}
      if (dataset[i].description.toUpperCase().includes(filterSearch.toUpperCase())) {matchSearch = true;}
      for (let j = 0; j < dataset[i].tags.length; j++) {
        if (dataset[i].tags[j].toUpperCase().includes(filterSearch.toUpperCase())) {matchSearch = true;}
      }
      for (let j = 0; j < dataset[i].construction.length; j++) {
        if (dataset[i].construction[j].toUpperCase().includes(filterSearch.toUpperCase())) {matchSearch = true;}
      }
    }
    
    //matchBrand
    if (filterBrand && dataset[i].brand != filterBrand) {
      matchBrand = false;
    }
    
    //matchManufacturer
    if (filterManufacturer && dataset[i].manufacturer != filterManufacturer) {
      matchManufacturer = false;
    }

    //matchStyle
    if (filterStyle && dataset[i].style != filterStyle) {
      matchStyle = false;
    }
    
    //matchConstruction
    //if (filterConstruction && dataset[i].construction != filterConstruction) {
    //  matchConstruction = false;
    //}
    
    //matchDiameter and matchPCD
    if (filterDiameter && filterPCD) {
      for (let j = 0; j < dataset[i].sizes.length; j++) {
        if (dataset[i].sizes[j].diameter == filterDiameter && dataset[i].sizes[j].pcd == filterPCD) {
          matchDiameter = true;
          matchPCD = true;
        }
      }
    }
    else if (filterDiameter && !filterPCD) {
      matchPCD = true;
      for (let j = 0; j < dataset[i].sizes.length; j++) {
        if (dataset[i].sizes[j].diameter == filterDiameter) {
          matchDiameter = true;
        }
      }
    }
    else if (!filterDiameter && filterPCD) {
      matchDiameter = true;
      for (let j = 0; j < dataset[i].sizes.length; j++) {
        if (dataset[i].sizes[j].pcd == filterPCD) {
          matchPCD = true;
        }
      }
    }
    else {
      matchDiameter = true;
      matchPCD = true;
    }
    
    //add matches to index list
    if (matchSearch && matchBrand && matchManufacturer && matchStyle && matchConstruction && matchDiameter && matchPCD) {
      filterIndexes.push(i);
    }
  }
  
  //clear wheel list
  document.querySelector('#wheel-list > div').innerHTML = '';
  
  //populate wheel list
  for (let j = 0; j < filterIndexes.length; j++) {
    populateGrid(filterIndexes[j])
  }

  //update browser url/history
  var queryString = new URL(document.location);
  if (filterSearch){queryString.searchParams.set('q', filterSearch)};
  if (filterBrand){queryString.searchParams.set('b', filterBrand)};
  if (filterManufacturer){queryString.searchParams.set('m', filterManufacturer)};
  if (filterStyle){queryString.searchParams.set('s', filterStyle)};
  //if (filterConstruction){queryString.searchParams.set('c', filterConstruction)};
  if (filterDiameter){queryString.searchParams.set('d', filterDiameter)};
  if (filterPCD){queryString.searchParams.set('p', filterPCD)};
  window.history.pushState(null, '', queryString);
}

function resetFilter() {
  //clear wheel list
  document.querySelector('#wheel-list > div').innerHTML = '';
  
  //populate wheel list
  for (let i = 0; i < dataset.length; i++) {
    populateGrid(i)
  }
  
  //reset inputs
  document.getElementById('wheel-filters-form').reset()

  //reset url params
  var queryString = new URL(document.location);
  queryString.searchParams.delete('q');
  queryString.searchParams.delete('b');
  queryString.searchParams.delete('m');
  queryString.searchParams.delete('s');
  queryString.searchParams.delete('c');
  queryString.searchParams.delete('d');
  queryString.searchParams.delete('p')
  window.history.pushState(null, '', queryString);
}