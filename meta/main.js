let data = [];

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
    displayStats();
    console.log(commits);
  }

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
});

// 1.2
let commits = [];
function processCommits() {
  commits = d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: 'https://github.com/vis-society/lab-7/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        writable: true,
        enumerable: false,
        configurable: true,
      });

      return ret;
    });
}

// Step 1.3
function displayStats() {
  // Process commits first
  processCommits();

  // Create the dl element
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  // Total Commits
  dl.append('dt').text('Total Commits');
  dl.append('dd').text(commits.length);

  // Number of Files
  const numFiles = d3.groups(data, d => d.file).length;
  dl.append('dt').text('Number of Files');
  dl.append('dd').text(numFiles);

  // Total LOC
  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(data.length);

  // Maximum Depth
  const maxDepth = d3.max(data, d => d.depth);
  dl.append('dt').text('Maximum Depth');
  dl.append('dd').text(maxDepth);

  // Longest Line
  const longestLine = d3.max(data, d => d.length);
  dl.append('dt').text('Longest Line');
  dl.append('dd').text(longestLine);

  // Maximum Lines (Longest File)
  const fileLengths = d3.rollups(
    data,
    (v) => d3.max(v, d => d.line),
    (d) => d.file
  );
  const maxLines = d3.max(fileLengths, d => d[1]);
  dl.append('dt').text('Maximum Lines');
  dl.append('dd').text(maxLines);
}


