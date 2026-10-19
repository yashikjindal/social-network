let network = null;
let nodesDataset = null;
let edgesDataset = null;

function initGraph() {
    const nodes = [
        { id: 'Alice', label: 'Alice' },
        { id: 'Bob', label: 'Bob' },
        { id: 'Charlie', label: 'Charlie' },
        { id: 'David', label: 'David' },
        { id: 'Eve', label: 'Eve' },
        { id: 'Frank', label: 'Frank' }
    ];

    const edges = [
        { id: 'e1', from: 'Alice', to: 'Bob' },
        { id: 'e2', from: 'Alice', to: 'Charlie' },
        { id: 'e3', from: 'Bob', to: 'Charlie' },
        { id: 'e4', from: 'Bob', to: 'David' },
        { id: 'e5', from: 'Charlie', to: 'David' },
        { id: 'e6', from: 'Charlie', to: 'Eve' },
        { id: 'e7', from: 'David', to: 'Eve' },
        { id: 'e8', from: 'David', to: 'Frank' },
        { id: 'e9', from: 'Eve', to: 'Frank' }
    ];

    nodesDataset = new vis.DataSet(nodes);
    edgesDataset = new vis.DataSet(edges);

    const container = document.getElementById('networkGraph');
    const data = { nodes: nodesDataset, edges: edgesDataset };
    
    const options = {
        nodes: {
            shape: 'dot',
            size: 24,
            color: { background: '#475569', border: '#334155', highlight: '#0ea5e9' },
            font: { color: '#ffffff', size: 14 }
        },
        edges: {
            width: 2,
            color: { color: '#475569', highlight: '#38bdf8' },
            smooth: { type: 'cubicBezier' }
        },
        physics: { enabled: true }
    };

    network = new vis.Network(container, data, options);
}

async function findShortestPath() {
    const start = document.getElementById('startNode').value;
    const end = document.getElementById('endNode').value;
    const output = document.getElementById('outputMessage');

    if (start === end) {
        output.style.display = "block";
        output.style.backgroundColor = "#ef4444";
        output.innerText = "Source and Target users cannot be same!";
        return;
    }

    try {
        const response = await fetch('/find-path', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start, end })
        });
        const data = await response.json();

        initGraph();

        output.style.display = "block";
        if (data.success) {
            output.style.backgroundColor = "#065f46";
            output.innerText = `Shortest Path (BFS): ${data.path.join(' ➔ ')} | Total Hops: ${data.distance}`;

            data.path.forEach(nodeId => {
                nodesDataset.update({ id: nodeId, color: { background: '#10b981', border: '#047857' } });
            });

            for (let i = 0; i < data.path.length - 1; i++) {
                const u = data.path[i];
                const v = data.path[i + 1];

                const matches = edgesDataset.get({
                    filter: function (item) {
                        return (item.from === u && item.to === v) || (item.from === v && item.to === u);
                    }
                });

                if (matches.length > 0) {
                    edgesDataset.update({ id: matches[0].id, width: 4, color: { color: '#10b981' } });
                }
            }
        } else {
            output.style.backgroundColor = "#ef4444";
            output.innerText = data.message;
        }
    } catch (err) {
        output.style.display = "block";
        output.style.backgroundColor = "#ef4444";
        output.innerText = "Backend Server is not responding!";
    }
}

window.onload = initGraph;
document.getElementById('analyzeBtn').onclick = findShortestPath;
