function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function formatNumber(number, decimals = 2) {
    return new Intl.NumberFormat('uk-UA', { 
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = progress * (end - start) + start;
        element.textContent = formatNumber(currentValue);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function showLoading() {
    const button = document.getElementById('calculateBtn');
    button.innerHTML = '<span class="loader"></span> Розрахунок...';
    button.disabled = true;
}

function hideLoading() {
    const button = document.getElementById('calculateBtn');
    button.innerHTML = '<i class="fas fa-calculator"></i> Розрахувати прибуток';
    button.disabled = false;
}

function scrollToResults() {
    const results = document.getElementById('results');
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validateInputs() {
    const inputs = document.getElementById('calculatorForm').querySelectorAll('input');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
        }
    });
    
    return isValid;
}

function calculateProfit() {
    if (!validateInputs()) return;
    
    showLoading();
    
    setTimeout(() => {
        const capacity = parseFloat(document.getElementById("capacity").value);
        const generationPerKw = parseFloat(document.getElementById("generationPerKw").value);
        const tariff = parseFloat(document.getElementById("tariff").value);
        const forecastAccuracy = parseFloat(document.getElementById("forecastAccuracy").value) / 100;
        const forecastAccuracyWithSystem = parseFloat(document.getElementById("forecastAccuracyWithSystem").value) / 100;
        const penaltyRate = parseFloat(document.getElementById("penaltyRate").value) / 100;
        const systemCost = parseFloat(document.getElementById("systemCost").value);
        const systemMaintenance = parseFloat(document.getElementById("systemMaintenance").value);
        const operationYears = parseInt(document.getElementById("operationYears").value);
        
        const annualGeneration = capacity * generationPerKw;
        const annualRevenue = annualGeneration * tariff;
        const penaltyWithoutSystem = annualGeneration * (1 - forecastAccuracy) * tariff * penaltyRate;
        const penaltyWithSystem = annualGeneration * (1 - forecastAccuracyWithSystem) * tariff * penaltyRate;
        const profitWithoutSystem = annualRevenue - penaltyWithoutSystem;
        const profitWithSystem = annualRevenue - penaltyWithSystem - systemMaintenance;
        const additionalProfit = profitWithSystem - profitWithoutSystem;
        const paybackPeriod = systemCost / additionalProfit;
        const totalProfitWithoutSystem = profitWithoutSystem * operationYears;
        const totalProfitWithSystem = (profitWithSystem * operationYears) - systemCost;
        const totalAdditionalProfit = totalProfitWithSystem - totalProfitWithoutSystem;
        
        let resultHTML = `
            <div style="overflow-x:auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Параметр</th>
                            <th style="text-align: right;">Значення</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Річне виробництво електроенергії</td>
                            <td class="value"><span id="annualGeneration">${formatNumber(annualGeneration)}</span> кВт·год</td>
                        </tr>
                        <tr>
                            <td>Річний дохід (без штрафів)</td>
                            <td class="value"><span id="annualRevenue">${formatNumber(annualRevenue)}</span> грн</td>
                        </tr>
                        <tr>
                            <td>Штрафи без системи прогнозування</td>
                            <td class="value"><span id="penaltyWithoutSystem">${formatNumber(penaltyWithoutSystem)}</span> грн/рік</td>
                        </tr>
                        <tr>
                            <td>Штрафи з системою прогнозування</td>
                            <td class="value"><span id="penaltyWithSystem">${formatNumber(penaltyWithSystem)}</span> грн/рік</td>
                        </tr>
                        <tr>
                            <td>Зменшення штрафів</td>
                            <td class="value"><span id="penaltyReduction" class="positive">${formatNumber(penaltyWithoutSystem - penaltyWithSystem)}</span> грн/рік</td>
                        </tr>
                        <tr>
                            <td>Річний прибуток без системи</td>
                            <td class="value"><span id="profitWithoutSystem">${formatNumber(profitWithoutSystem)}</span> грн/рік</td>
                        </tr>
                        <tr>
                            <td>Річний прибуток з системою</td>
                            <td class="value"><span id="profitWithSystem">${formatNumber(profitWithSystem)}</span> грн/рік</td>
                        </tr>
                        <tr>
                            <td>Додатковий річний прибуток</td>
                            <td class="value"><span id="additionalProfit" class="${additionalProfit > 0 ? 'positive' : 'negative'}">${formatNumber(additionalProfit)}</span> грн/рік</td>
                        </tr>
                        <tr>
                            <td>Період окупності системи</td>
                            <td class="value"><span id="paybackPeriod">${formatNumber(paybackPeriod)}</span> років</td>
                        </tr>
                        <tr>
                            <td>Загальний прибуток за ${operationYears} років без системи</td>
                            <td class="value"><span id="totalProfitWithoutSystem">${formatNumber(totalProfitWithoutSystem)}</span> грн</td>
                        </tr>
                        <tr>
                            <td>Загальний прибуток за ${operationYears} років з системою</td>
                            <td class="value"><span id="totalProfitWithSystem">${formatNumber(totalProfitWithSystem)}</span> грн</td>
                        </tr>
                        <tr>
                            <td>Додатковий прибуток за ${operationYears} років</td>
                            <td class="value"><span id="totalAdditionalProfit" class="${totalAdditionalProfit > 0 ? 'positive' : 'negative'}">${formatNumber(totalAdditionalProfit)}</span> грн</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="conclusion ${paybackPeriod <= operationYears ? 'positive' : 'negative'}">
                ${paybackPeriod <= operationYears 
                    ? `<i class="fas fa-check-circle"></i> Система окупиться за ${formatNumber(paybackPeriod)} років, що менше за розрахунковий період експлуатації (${operationYears} років). Встановлення системи прогнозування є економічно вигідним.`
                    : `<i class="fas fa-exclamation-circle"></i> Система окупиться за ${formatNumber(paybackPeriod)} років, що більше за розрахунковий період експлуатації (${operationYears} років). Встановлення системи прогнозування є економічно невигідним при заданих параметрах.`
                }
            </div>
        `;
        
        document.getElementById("resultContent").innerHTML = resultHTML;
        document.getElementById("results").style.display = "block";
        
        setTimeout(() => {
            animateValue(document.getElementById("annualGeneration"), 0, annualGeneration, 1000);
            animateValue(document.getElementById("annualRevenue"), 0, annualRevenue, 1000);
            animateValue(document.getElementById("penaltyWithoutSystem"), 0, penaltyWithoutSystem, 1000);
            animateValue(document.getElementById("penaltyWithSystem"), 0, penaltyWithSystem, 1000);
            animateValue(document.getElementById("penaltyReduction"), 0, penaltyWithoutSystem - penaltyWithSystem, 1000);
            animateValue(document.getElementById("profitWithoutSystem"), 0, profitWithoutSystem, 1200);
            animateValue(document.getElementById("profitWithSystem"), 0, profitWithSystem, 1200);
            animateValue(document.getElementById("additionalProfit"), 0, additionalProfit, 1200);
            animateValue(document.getElementById("paybackPeriod"), 0, paybackPeriod, 1200);
            animateValue(document.getElementById("totalProfitWithoutSystem"), 0, totalProfitWithoutSystem, 1400);
            animateValue(document.getElementById("totalProfitWithSystem"), 0, totalProfitWithSystem, 1400);
            animateValue(document.getElementById("totalAdditionalProfit"), 0, totalAdditionalProfit, 1400);
        }, 100);
        
        hideLoading();
        scrollToResults();
    }, 800);
}

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '';
            } else {
                this.style.borderColor = 'var(--danger-color)';
            }
        });
    });
});