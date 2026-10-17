/* ========================================================
   EcoPulse - Interactive Application Logic
   ======================================================== */

// 1. Initialize Icons on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }
    animateCounters();
});

// 2. Animated Stats Counters (Judges love this visual touch!)
function animateCounters() {
    const stats = [
        { element: document.querySelector('#stats-co2'), target: 14250, suffix: ' kg' },
        { element: document.querySelector('#stats-recycled'), target: 8400, suffix: '+' },
        { element: document.querySelector('#stats-trees'), target: 1200, suffix: '' },
        { element: document.querySelector('#stats-users'), target: 450, suffix: '+' }
    ];

    stats.forEach(stat => {
        if (!stat.element) return;
        let count = 0;
        const speed = Math.ceil(stat.target / 60);

        const timer = setInterval(() => {
            count += speed;
            if (count >= stat.target) {
                stat.element.innerText = stat.target.toLocaleString() + stat.suffix;
                clearInterval(timer);
            } else {
                stat.element.innerText = count.toLocaleString() + stat.suffix;
            }
        }, 25);
    });
}

// 3. Carbon Calculator Logic
function calculateCarbon() {
    const mode = document.getElementById('commuteMode').value;
    const km = parseFloat(document.getElementById('commuteKm').value) || 0;
    const diet = document.getElementById('dietType').value;
    const resultBox = document.getElementById('calcResult');

    // Emission factors (kg CO2 per km)
    const transportFactors = {
        'car': 0.19,
        'bus': 0.08,
        'ev': 0.05,
        'cycle': 0.0
    };

    // Annual diet emissions (kg CO2)
    const dietFactors = {
        'heavy-meat': 2600,
        'medium-meat': 1900,
        'vegetarian': 1300,
        'vegan': 1000
    };

    const annualTransportCO2 = (km * transportFactors[mode] * 300);
    const annualDietCO2 = dietFactors[diet];
    const totalKg = Math.round(annualTransportCO2 + annualDietCO2);
    const treesNeeded = Math.ceil(totalKg / 21); // 1 mature tree absorbs ~21kg CO2/year

    // Update Result Elements
    document.getElementById('co2Output').innerText = `${totalKg.toLocaleString()} kg`;
    document.getElementById('treesOutput').innerText = `${treesNeeded} Trees`;

    let tip = "";
    if (mode === 'car' && km > 10) {
        tip = "💡 Tip: Switching your car commute to an EV or bus twice a week will save ~450 kg CO₂ annually!";
    } else if (diet === 'heavy-meat') {
        tip = "💡 Tip: Adopting a meatless day once a week can reduce your impact by up to 200 kg CO₂ per year!";
    } else {
        tip = "🌟 Great job! Your habits keep you well below the global average emission footprint.";
    }

    document.getElementById('actionTip').innerText = tip;
    resultBox.classList.remove('hidden');

    // Smooth scroll to results
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 4. Waste Sorter Assistant Logic
const wasteDatabase = {
    'bottle': { category: 'Dry / Recyclable Bin (Blue)', color: 'border-blue-500 bg-blue-950/40 text-blue-300', note: 'Rinse with clean water and crush flat to save space.' },
    'plastic': { category: 'Dry / Recyclable Bin (Blue)', color: 'border-blue-500 bg-blue-950/40 text-blue-300', note: 'Ensure it is free from wet food residue before recycling.' },
    'banana': { category: 'Wet / Organic Bin (Green)', color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300', note: '100% biodegradable. Excellent for local garden compost!' },
    'peel': { category: 'Wet / Organic Bin (Green)', color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300', note: 'Decomposes naturally within 3-4 weeks.' },
    'food': { category: 'Wet / Organic Bin (Green)', color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300', note: 'Dispose into organic wet waste. Do not leave in plastic wrappers.' },
    'battery': { category: 'E-Waste / Hazardous Bin (Red)', color: 'border-rose-500 bg-rose-950/40 text-rose-300', note: 'Contains toxic heavy metals. Take to specialized e-waste collection bins!' },
    'phone': { category: 'E-Waste Bin (Red)', color: 'border-rose-500 bg-rose-950/40 text-rose-300', note: 'Electronics must never go into landfill bins. Hand over to certified recyclers.' },
    'cardboard': { category: 'Paper / Recyclable Bin (Blue)', color: 'border-amber-500 bg-amber-950/40 text-amber-300', note: 'Flatten dry cardboard to optimize collection volume.' },
    'glass': { category: 'Glass / Specialized Recycling', color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300', note: '100% recyclable infinitely. Handle carefully to avoid broken shards.' }
};

function checkWaste() {
    const raw = document.getElementById('wasteInput').value.toLowerCase().trim();
    const resBox = document.getElementById('wasteResult');

    if (!raw) return;

    let match = null;
    for (let key in wasteDatabase) {
        if (raw.includes(key)) {
            match = wasteDatabase[key];
            break;
        }
    }

    resBox.classList.remove('hidden');

    if (match) {
        resBox.className = `mt-6 p-4 rounded-xl border text-sm transition-all duration-300 ${match.color}`;
        resBox.innerHTML = `
            <div class="font-bold text-base mb-1">Recommended Bin: ${match.category}</div>
            <div>${match.note}</div>
        `;
    } else {
        resBox.className = 'mt-6 p-4 rounded-xl border border-slate-700 bg-slate-950 text-slate-300 text-sm transition-all duration-300';
        resBox.innerHTML = `
            <div class="font-bold text-base mb-1">General Domestic Bin</div>
            <div>No specific category found. Please consult your local municipal recycling list.</div>
        `;
    }
}

function quickTest(item) {
    const input = document.getElementById('wasteInput');
    input.value = item;
    checkWaste();
}
