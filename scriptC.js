window.onload = function() {
    // Извличане на totalCost от URL
    let totalCost = getParameterByName('totalCost');
    
    if (totalCost) {
        document.getElementById('price-output').textContent = totalCost + " ЕВРО";
    } else {
        console.error("Не може да се извлече totalCost от URL.");
    }

    // List of all the IDs you want to extract and display
    const idsToDisplay = ['address1', 'address2', 'year', 'brand', 'car-models', 'car-value', 'email', 'phone'];

    idsToDisplay.forEach(id => {
        let value = getParameterByName(id);
        if (value) {
            document.getElementById(`data-output-${id}`).textContent = value;
        }
    });

    // Set radio buttons based on URL parameters
    const radioNames = ['insurance', 'person', 'drone'];
    radioNames.forEach(name => {
        let value = getParameterByName(name);
        if (value) {
            let radioButton = document.querySelector(`input[name="${name}"][value="${value}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
        }
        let personValue = getParameterByName('person');
    let vatMessageElement = document.getElementById('vat-message');
    if (personValue === 'yes') {
        vatMessageElement.textContent = "";
    } else if (personValue === 'no') {
        vatMessageElement.textContent = "Цената е с ДДС";
    }
    });
};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

document.getElementById('edit-button').addEventListener('click', function() {
    // Използвайте текущия URL, за да върнете потребителя обратно към калкулатора
    // Това ще запази всички параметри в URL-а, така че стойностите да не се губят
    window.location.href = window.location.pathname.replace('calculator.html', 'index.html') + window.location.search;
});

