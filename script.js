// event listeners
window.onload=function(){
  document.getElementById("wheel-details-close").addEventListener("click", closeDetails);
  for (let i = 0; i < dataset.length; i++) {
    populateGrid(i)
  }
}

window.onkeydown=function(e){
  if(e.which == 27) {
    closeDetails();
  }
}

document.addEventListener("click", event => {
  if (document.getElementById("wheel-details").classList.contains("open")) {
    const validClick1 = document.getElementById("wheel-details").contains(event.target)
    const validClick2 = document.getElementById("wheel-list").contains(event.target)
    if (!validClick1 && !validClick2) {
      closeDetails();
    }
  }
})

// functions
function populateGrid(i) {
  const content = document.getElementById("wheel-list");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  const div = document.createElement("div");
  content.appendChild(figure);
  figure.onclick = function(){populateDetails(i)}
  figure.appendChild(img);
  img.src = dataset[i].images[0];
  figure.appendChild(figcaption);
  figcaption.innerHTML = dataset[i].shortname;
}

function populateDetails(i) {
  document.getElementById("wheel-info-shortname").innerHTML = dataset[i].shortname;
  document.getElementById("wheel-info-description").innerHTML = dataset[i].description;
  document.getElementById("wheel-info-brand").innerHTML = dataset[i].brand;
  document.getElementById("wheel-info-model").innerHTML = dataset[i].model;
  document.getElementById("wheel-info-manufacturer").innerHTML = dataset[i].manufacturer;
  document.getElementById("wheel-info-years").innerHTML = dataset[i].years;
  document.getElementById("wheel-info-origin").innerHTML = dataset[i].origin;
  document.getElementById("wheel-info-construction").innerHTML = dataset[i].construction;
  document.getElementById("wheel-info-style").innerHTML = dataset[i].style;
  document.querySelector("#wheel-info-link a").href = dataset[i].link;
  for (let j = 0; j < dataset[i].sizes.length; j++) {
    const table = document.querySelector("#wheel-specs tbody");
    const row  = document.createElement("tr");
    table.appendChild(row);
    for (const data in dataset[i].sizes[j]) {
      const cell = document.createElement("td");
      const text = document.createTextNode(dataset[i].sizes[j][data]);
      row.appendChild(cell);
      cell.appendChild(text);
    }
  }
  for (let j = 0; j < dataset[i].images.length; j++) {
    const target = document.getElementById("wheel-images");
    const image  = document.createElement("img");
    target.appendChild(image);
    image.src = dataset[i].images[j];
  }
  document.getElementById("wheel-details").classList = "open";
}

function closeDetails() {
  //remove class to hide modal
  document.getElementById("wheel-details").classList = "";
  
  //clear details from modal
  setTimeout(function(){
    const images = document.querySelectorAll('#wheel-details img');
    images.forEach(images => {
      images.remove();
    });
    const rows = document.querySelectorAll('#wheel-specs tr:not(:first-of-type)');
    rows.forEach(rows => {
      rows.remove();
    });
  }, 200)
}

function applyFilter() {
  //create array
  filterIndexes = []
  
  //set filter params
  filterSearch = document.getElementById("input-search").value;
  filterBrand = document.getElementById("input-brand").value;
  //filterMfg = document.getElementById("input-mfg").value;
  filterYear = [];
  for (var option of document.getElementById('input-year').options)
  {
      if (option.selected) {
          filterYear.push(option.value);
      }
  }
  //filterConstruction = document.getElementById("input-construction").value;
  filterStyle = document.getElementById("input-style").value;
  filterSize = [];
  for (var option of document.getElementById('input-size').options)
  {
      if (option.selected) {
          filterSize.push(option.value);
      }
  }
  filterPCD = [];
  for (var option of document.getElementById('input-pcd').options)
  {
      if (option.selected) {
          filterPCD.push(option.value);
      }
  }
    
  //check dataset for matches
  for (let i = 0; i < dataset.length; i++) {
    match = []
    if (dataset[i].brand != filterBrand || !filterBrand) {
      match.push("true")
    }
    for (let j = 0; j < filterYear.length; j++) {
      if (dataset[i].years.includes(filterYear[j])) {
        match.push("true");
        j = filterYear.length
      }
    }
    if (dataset[i].style == filterStyle || !filterStyle) {
      match.push("true")
    }
    for (let j = 0; j < filterSize.length; j++) {
      if (dataset[i].years.includes(filterSize[j])) {
        match.push("true");
        j = filterSize.length
      }
    }
    for (let j = 0; j < filterPCD.length; j++) {
      if (dataset[i].years.includes(filterPCD[j])) {
        match.push("true");
        j = filterPCD.length
      }
    }
  }
  
  //clear wheel list
  document.getElementById("wheel-list").innerHTML = "";
  
  //populate wheel list
  for (let j = 0; j < filterIndexes.length; j++) {
    populateGrid(filterIndexes[j])
  }
}

function resetFilter() {
  //clear wheel list
  document.getElementById("wheel-list").innerHTML = "";
  
  //populate wheel list
  for (let i = 0; i < dataset.length; i++) {
    populateGrid(i)
  }
  
  //reset inputs
  a = document.getElementById("input-search");
  b = document.getElementById("input-brand");
  c = document.getElementById("input-style");
  d = document.getElementById("input-size");
  e = document.getElementById("input-pcd");
  f = document.getElementById("input-year");
  a.value = a.defaultValue
  b.value = b.defaultValue
  c.value = c.defaultValue
  d.value = d.defaultValue
  e.value = e.defaultValue
  f.value = f.defaultValue
}
