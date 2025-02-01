import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
    try {
        // Fetch the project data
        const projects = await fetchJSON('../lib/projects.json');
        
        // Select the projects container
        const projectsContainer = document.querySelector('.projects');

        const projectsTitle = document.querySelector('.projects-title');

        // Update the projects title with the count of projects
        if (projectsTitle) {
            projectsTitle.innerHTML = `${projects.length} Projects`; // Shows count of projects followed by the word "Projects"
        }
        
        // Render the projects
        renderProjects(projects, projectsContainer, 'h2');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Call the loadProjects function to execute the process
loadProjects();
