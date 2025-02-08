import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');
        const projectsContainer = document.querySelector('.projects');
        const projectsTitle = document.querySelector('.projects-title');

        if (projectsTitle) {
            projectsTitle.innerHTML = `${projects.length} Projects`;
        }

        renderProjects(projects, projectsContainer, 'h2');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

loadProjects();

// Pie Plot
// 1.3
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
});
d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

// 1.4
// let data = [1, 2, 3, 4, 5, 5];
// let total = 0;

// for (let d of data) {
//   total += d;
// }
// let angle = 0;
// let arcData = [];

// for (let d of data) {
//   let endAngle = angle + (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }
// let arcs = arcData.map((d) => arcGenerator(d));

// let colors = d3.scaleOrdinal(d3.schemeTableau10);
// arcs.forEach((arc, idx) => {
//     d3.select('svg')
//       .append('path')
//       .attr('d', arc)
//       .attr('fill', colors(idx)); 
//   });

// Step 1.5: adding the color scheme
// Step 2.1: changing data
let projects = await fetchJSON('../lib/projects.json');
let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);
let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  })

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);

let arcs = arcData.map((d) => arcGenerator(d));

let colors = d3.scaleOrdinal(d3.schemeTableau10);
arcs.forEach((arc, idx) => {
  d3.select('svg')
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(idx));
});

// Step 2.2
let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
})

// Step 4.1 and 4.2
function renderPieChart(projectsGiven) {
let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
);

let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
});

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(newData);

let arcs = arcData.map((d) => arcGenerator(d));

let colors = d3.scaleOrdinal(d3.schemeTableau10);
arcs.forEach((arc, idx) => {
    d3.select('svg')
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(idx));
});

let legend = d3.select('.legend');
legend.selectAll('*').remove();  

newData.forEach((d, idx) => {
    legend.append('li')
    .attr('style', `--color:${colors(idx)}`)
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});
}

renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
query = event.target.value;
let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
});

const projectsContainer = document.querySelector('.projects');
renderProjects(filteredProjects, projectsContainer, 'h2');
renderPieChart(filteredProjects);
});
  
// step 5.2
let selectedIndex = -1;

let svg = d3.select('svg');
svg.selectAll('path').remove();

arcs.forEach((arc, i) => {
  svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;

      svg
        .selectAll('path')
        .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

      d3.select('.legend')
        .selectAll('li')
        .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

      const projectsContainer = document.querySelector('.projects');

      if (selectedIndex === -1) {
        renderProjects(projects, projectsContainer, 'h2');
      } else {
        let selectedYear = data[selectedIndex].label;
        let filteredProjects = projects.filter((project) => project.year === selectedYear);
        renderProjects(filteredProjects, projectsContainer, 'h2');
      }
    });
});



