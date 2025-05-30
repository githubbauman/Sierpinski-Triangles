/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// === Parameters ===
let iterations = 6;           // aantal keer regels toepassen
let length = 8;             // lengte van elke lijn
let angleStep = 60;           // graden rotatie voor + en -

// === Rewriting rules ===
function applyRules(input, steps) {
    let current = input;
    for (let i = 0; i < steps; i++) {
        let next = "";
        for (let char of current) {
            if (char === 'x') {
                next += 'y+x+y';
            } else if (char === 'y') {
                next += 'x-y-x';
            } else {
                next += char;
            }
        }
        current = next;
    }
    return current;
}

function drawLSystem(instructions, startX, startY) {
    let x = startX;
    let y = startY;
    let angle = 0; // graden
    let maxX = x;
    let minY = y;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let char of instructions) {
        if (char === 'x' || char === 'y' || char === '=') {
            let rad = angle * Math.PI / 180;
            let newX = x + length * Math.cos(rad);
            let newY = y + length * Math.sin(rad);

            ctx.lineTo(newX, newY);

            x = newX;
            y = newY;
        } else if (char === '+') {
            angle += angleStep;
        } else if (char === '-') {
            angle -= angleStep;
        }
    }
    ctx.stroke();
}


function drawMultipleLSystems(count, spacing, baseX, baseY, instructions) {
    for (let i = 0; i < count; i++) {
        ctx.save();
        let offsetX = baseX + i * spacing;
        let offsetY = baseY;
        let offsets;
        if (i % 2 === 1) {
            ctx.translate(offsetX, offsetY);
            ctx.rotate(Math.PI); // 180°
            ctx.translate(-offsetX, -offsetY);
            offsets = drawLSystem(instructions, offsetX - 90, offsetY  + 462);
            
        }
        else {
            offsets = drawLSystem(instructions, offsetX + 85, offsetY);
        }
        ctx.restore();
    }
}

ctx.strokeStyle = "white";
ctx.lineWidth = 5;
ctx.lineJoin = "round"; 

let startString = "x";

let result = applyRules(startString, iterations);
drawMultipleLSystems(8, 253, 150, 600, result); // count, spacing, baseX, baseY, instructions
