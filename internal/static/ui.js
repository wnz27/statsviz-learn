// ui holds the user interface state
import { lastGCs } from './stats.js';
import Plot from "./plot.js";

const GCLines = data => {
    const gcs = lastGCs;
    const mints = data.times[0];
    const maxts = data.times[data.times.length - 1];

    const shapes = [];
    for (let i = 0, n = gcs.length; i < n; i++) {
        let d = gcs[i];
        // Clamp GC times which are out of bounds
        if (d < mints || d > maxts) {
            continue;
        }

        shapes.push({
            type: 'line',
            x0: d,
            x1: d,
            yref: 'paper',
            y0: 0,
            y1: 1,
            line: {
                color: 'rgb(55, 128, 191)',
                width: 1,
                dash: 'longdashdot',
            }
        })
    }
    return shapes;
}

// TODO(arl) this whole file should probabaly be removed, and plots functions be
// moved into app.js
let plots = [];

const configurePlots = (plotdefs) => {
    plots = [];
    plotdefs.forEach(plotdef => {
        plots.push(new Plot(plotdef));
    });
}

const attachPlots = (data) => {
    let row = null;
    let plotsDiv = $('#plots');
    plotsDiv.empty()

    for (let i = 0; i < plots.length; i++) {
        const plot = plots[i];
        if (i % 2 == 0) {
            row = $('<div>', { class: 'row' });
            plotsDiv.append(row);
        }

        let col = $('<div>', { class: 'col' });
        let div = $('<div>', { id: plot.name() });

        plot.createElement(div[0], data)
        col.append(div);
        row.append(col);
    }
}

const updatePlots = data => {
    let gcLines = GCLines(data);

    plots.forEach(plot => {
        if (!plot.hidden) {
            plot.update(data, gcLines);
        }
    });
}

let paused = false;
const isPaused = () => { return paused; }
const togglePause = () => { paused = !paused; }

export { configurePlots, attachPlots, updatePlots, isPaused, togglePause };