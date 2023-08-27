function validateRadioButtons(name) {
    const selectedRadio = document.querySelector(`input[name="${name}"]:checked`);
    const errorElement = document.getElementById(`${name}-error`);
    if (!selectedRadio) {
      errorElement.textContent = 'Това поле е задължително!';
      errorElement.style.display = 'block';
      return false;
    } else {
      errorElement.style.display = 'none';
      return true;
    }
  }
  // КРАЙ НА ПРОВЕРКА ДА ЛИ СА ПОПЪЛНЕНИ РАДИО БУТОНИТЕ ЗА ФИЗИЧЕСКО И ЮРИДИЧЕСКО ЛИЦЕ
  
  document.addEventListener('DOMContentLoaded', function() {
      const inputs = document.querySelectorAll('.form-input');
  
      inputs.forEach(input => {
          input.addEventListener('input', function() {
              if (this.value.trim() !== '') {
                  this.classList.add('has-value');
              } else {
                  this.classList.remove('has-value');
              }
          });
      });
  });
  
  
  
  // ТОВА ПРОВЕРЯВА ДАЛИ ВСИЧКО Е ПОПЪЛНЕНО В СТЪПКА 1 за да ПРЕМИНЕ НАПРЕД
  document.getElementById('next-step-1').addEventListener('click', function(e) {
      const idsToCheck = ['address1', 'address2', 'postcode1', 'postcode2'];
      const radioNamesToCheck = [];
      if (validateFields(idsToCheck, radioNamesToCheck)) {
          document.querySelector('.step.step-1.active').classList.remove('active');
          document.querySelector('.calculator-step.step.step-1.active').classList.remove('active');
          document.querySelector('.step.step-2').classList.add('active');
          document.querySelector('.calculator-step.step.step-2').classList.add('active');
      }
  });
  // КРАЙ НА ПРОВЕРКАТА ДАЛИ ВСИЧКО Е ПОПЪЛНЕНО В СТЪПКА 1 за да ПРЕМИНЕ НАПРЕД
  
  
  
  
  // ТОВА ПРОВЕРЯВА ДАЛИ ВСИЧКО Е ПОПЪЛНЕНО В СТЪПКА 2 за да ПРЕМИНЕ НАПРЕД
  document.getElementById('next-step-1').addEventListener('click', function(e) {
      // Проверка на стъпка 2
      const idsToCheck = ['year', 'brand', 'car-models', 'car-type'];
      if (validateFields(idsToCheck)) {
          // Изпълнение на логиката от първия обработчик
          document.querySelector('.step.step-1.active').classList.remove('active');
          document.querySelector('.calculator-step.step.step-1.active').classList.remove('active');
          document.querySelector('.step.step-2').classList.add('active');
          document.querySelector('.calculator-step.step.step-2').classList.add('active');
          // Изпълнение на логиката от втория обработчик
          changeStep(1);
      }
  });
  // КРАЙ НА ПРОВЕРКАТА ДАЛИ ВСИЧКО Е ПОПЪЛНЕНО В СТЪПКА 2 за да ПРЕМИНЕ НАПРЕД
  
  
  
  // ТОВА ПРОВЕРЯВА ДАЛИ ВСИЧКО Е ПОПЪЛНЕНО В СТЪПКА 3 за да ПРЕМИНЕ НАПРЕД
  document.getElementById('calculate-cost').addEventListener('click', function(e) {
      // Проверка само за стъпка 3
      const idsToCheck = ['car-value','email','phone'];
      const radioNamesToCheck = ['insurance','person','drone'];
  
      if (validateFields(idsToCheck,radioNamesToCheck) && validateRadioButtons('insurance') && validateRadioButtons('person')) {
          // Изпълнете логиката за изчисление на цената тук
          calculateTotalCost();
      }
  });
  // КРАЙ НА ПРОВЕРКАТА ДАЛИ ВСИЧКО Е ПОПЪЛНЕНО В СТЪПКА  за да ПРЕМИНЕ НАПРЕД
  
  
  // ПРОВЕРКА ДА ЛИ СА ПОПЪЛНЕНИ ВСИЧКИ ПОЛЕТА и РАДИО БУТОНИТЕ
  function validateFields(ids, radioNames = []) {
      let isValid = true;
  
      ids.forEach(id => {
          const input = document.getElementById(id);
          const errorElement = document.getElementById(`${id}-error`);
          if (input.value.trim() === '') {
              errorElement.textContent = 'Това поле е задължително!';
              errorElement.style.display = 'block';
              isValid = false;
          } else {
              errorElement.style.display = 'none';
          }
      });
  
      radioNames.forEach(name => {
          const radioButtons = document.getElementsByName(name);
          const errorElement = document.getElementById(`${name}-error`);
          if (![...radioButtons].some(radio => radio.checked)) {
              errorElement.textContent = 'Моля, изберете опция!';
              errorElement.style.display = 'block';
              isValid = false;
          } else {
              errorElement.style.display = 'none';
          }
          if (!validateRadioButtons(name)) {
              isValid = false;
          }
      });
  
      return isValid;
  }
  // КРАЙ НА ПРОВЕРКА ДА ЛИ СА ПОПЪЛНЕНИ ВСИЧКИ ПОЛЕТА и РАДИО БУТОНИТЕ


  //ТОВА ОПЦИЯ ЗА ЗАРЕЖДАНЕ НА CSV
 // Изпълнение на кода след зареждане на страницата

 async function fetchCSV() {
    const response = await fetch('csv/dataset.csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    const jsonData = rows.map(row => {
        const values = row.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
        return {
            make: values[0],
            model: values[1],
            year: values[2],
            engine: values[3],
            variant: values[5],
            body_styles: values[4],
            type: values[6],
            kType: values[7]
        };
    });
    return jsonData;
}

function correctBrandNames(data) {
    data.forEach(item => {
        if (item.make === 'Citro�n') {
            item.make = 'Citroën';
        }
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    const data = await fetchCSV();
    correctBrandNames(data);
    const brands = [...new Set(data.map(item => item.make))].sort();
    const brandSelect = document.getElementById('brand');
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.text = brand;
        brandSelect.appendChild(option);
    });

    brandSelect.addEventListener('change', function() {
        const selectedBrand = this.value;
        const brandModels = data.filter(item => item.make === selectedBrand);
        const models = [...new Set(brandModels.map(item => item.model))].sort((a, b) => {
            const aIsNumber = !isNaN(a);
            const bIsNumber = !isNaN(b);
            if (aIsNumber && bIsNumber) {
                return a - b;
            } else if (aIsNumber) {
                return -1;
            } else if (bIsNumber) {
                return 1;
            } else {
                return a.localeCompare(b);
            }
        });
        const modelSelect = document.getElementById('car-models');
        modelSelect.innerHTML = '';
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.text = model;
            modelSelect.appendChild(option);
        });
        modelSelect.value = models[0];
        modelSelect.dispatchEvent(new Event('change'));
    });

    const modelSelect = document.getElementById('car-models');

    modelSelect.addEventListener('change', function() {
        const selectedBrand = brandSelect.value;
        const selectedModel = this.value;
        const yearIntervals = [...new Set(data.filter(item => item.make === selectedBrand && item.model === selectedModel).map(item => item.year.replace(/\s+/g, '')))];
        const years = [];
        yearIntervals.forEach(interval => {
            const [start, end] = interval.split('-').map(year => year.trim());
            for (let year = parseInt(start); year <= parseInt(end); year++) {
                years.push(year.toString());
            }
        });
        const uniqueYears = [...new Set(years)];
        const yearSelect = document.getElementById('year');
        yearSelect.innerHTML = '';
        uniqueYears.sort((a, b) => a - b).forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.text = year;
            yearSelect.appendChild(option);
        });
        yearSelect.value = uniqueYears[0];
        yearSelect.dispatchEvent(new Event('change'));
    });

    const yearSelect = document.getElementById('year');

    yearSelect.addEventListener('change', function() {
        const selectedYear = this.value;
        const selectedModel = modelSelect.value;
        const selectedBrand = brandSelect.value;
        const selectedType = data.find(item => {
            const [start, end] = item.year.replace(/\s+/g, '').split('-').map(year => parseInt(year));
            return item.make === selectedBrand && item.model === selectedModel && selectedYear >= start && selectedYear <= end;
        }).body_styles.replace(/diesel|petrol/gi, '').trim();

        const categories = {
            "SUV": ["SUV", "Full Hybrid SUV", "Plug-In Hybrid SUV", "Mild Hybrid SUV", "Electric Motor SUV", "Range Extender SUV"],
            "BigSUV": ["SUV (Open)", "SUV Van", "Mild Hybrid Off-Road Vehicle", "Plug-In Hybrid Off-Road Vehicle", "Electric Motor Off-Road Vehicle", "(two-stroke) Off-Road Vehicle", "Mild Hybrid Convertible Off-Road Vehicle", "Plug-In Hybrid Convertible Off-Road Vehicle", "(two-stroke) Convertible Off-Road Vehicle"],        
            "Coupe": ["Coupe", "Wankel Coupe", "Mild Hybrid Coupe", "Electric Motor Coupe", "Full Hybrid Coupe", "Plug-In Hybrid Coupe", "Range Extender Coupe", "/Ethanol Coupe", "Wankel Hatch"],
            "Wagon": ["Estate", "Plug-In Hybrid Estate", "(two-stroke) Convertible", "Full Hybrid Estate", "Mild Hybrid Estate", "Electric Motor Estate", "Full Hybrid Estate Van", "Mild Hybrid Estate Van", "Plug-In Hybrid Estate Van"],
            "Hatchback": ["Hatch", "Hatchbac", "Full Hybrid Hatch", "Wankel Convertible", "(two-stroke) Coupe", "Electric Motor Hatch", "Range Extender Hatch", "Mild Hybrid Hatch", "Electric Motor Hatchback", "Hybrid Hatchback", "/Ethanol Hatchback", "/Liquified Petroleum Gas (LPG) Hatchback"],
            "Sedan": ["Saloon", "Wankel Saloon", "Mild Hybrid Saloon", "Full Hybrid Saloon", "Plug-In Hybrid Saloon", "Electric Motor Saloon", "/Compressed Natural Gas (CNG) Saloon"],
            "Convertible": ["Convertible", "MPV", "Convertible Off-Road Vehicle", "Full Hybrid MPV", "Electric Motor MPV", "Range Extender MPV", "Mild Hybrid MPV", "Hybrid MPV", "Plug-In Hybrid MPV", "Electric MPV", "Full Hybrid Van-Based MPV", "Electric Motor Van-Based MPV", "Mild Hybrid Panel Van", "Electric Motor Panel Van", "Mild Hybrid Bus", "Electric Motor Bus", "Range Extender Bus", "Plug-In Hybrid Bus", "(two-stroke) Bus", "(two-stroke) Chassis Cab", "Electric Motor Chassis Cab", "Full Hybrid Chassis Cab", "Mild Hybrid Chassis Cab", "Full Hybrid Panel Van", "Wankel Estate", "Range Extender Bus", "Plug-In Hybrid Hatchback", "Mild Hybrid Convertible Off-Road Vehicle", "Electric Motor Tipper", "Range Extender Coupe", "Plug-In Hybrid Van", "Plug-In Hybrid Estate Van", "(two-stroke) Convertible Off-Road Vehicle", "Full Hybrid Convertible", "Mild Hybrid Closed Off-Road Van"],
            "Van": ["Panel Van", "Van", "Van-Based MPV", "Estate Van", "Tipper", "Platform/Chassis", "Lorry", "Chassis Cab", "Electric Motor Van", "(two-stroke) Van", "Electric Motor Van-Based MPV", "Electric Motor Dump Truck", "Electric Motor Convertible", "Van/MPV", "Range Extender Van", "Mild Hybrid Van", "Electric Motor Platform/Chassis", "Electric Motor Pickup", "Full Hybrid Pickup", "Mild Hybrid Pickup", "Electric Motor Tipper", "Range Extender Coupe", "Full Hybrid Van-Based MPV", "Plug-In Hybrid Hatchback", "Mild Hybrid Convertible Off-Road Vehicle", "Electric Motor Tipper", "Plug-In Hybrid Van", "Plug-In Hybrid Estate Van", "Full Hybrid Convertible", "Mild Hybrid Closed Off-Road Van"],
            "PickUp": ["Pickup", "Full Hybrid Pickup", "Mild Hybrid Pickup", "Electric Motor Pickup"],
            "BigPickUp": ["Dump Truck", "Electric Motor Dump Truck", "Full Hybrid Convertible", "Mild Hybrid Closed Off-Road Van"],
            "Hybrid": ["Electric Motor Vehicle", "Hybrid Vehicle", "Mild Hybrid Vehicle", "Full Hybrid Vehicle", "Plug-In Hybrid Vehicle", "Range Extender Vehicle", "Ethanol Vehicle", "Compressed Natural Gas (CNG) Vehicle", "Liquified Petroleum Gas (LPG) Vehicle"],
            "Specialized Vehicles": ["Two-Stroke Vehicle", "Wankel Vehicle", "(two-stroke) Convertible", "(two-stroke) Coupe", "(two-stroke) Van", "(two-stroke) Chassis Cab", "(two-stroke) Bus", "(two-stroke) Off-Road Vehicle", "(two-stroke) Convertible Off-Road Vehicle"],
            "Other": []
        };

        const typeSelect = document.getElementById('car-type');
        typeSelect.innerHTML = '';

        let category = 'Other';
        for (const [cat, subcategories] of Object.entries(categories)) {
            if (subcategories.includes(selectedType)) {
                category = cat;
                break;
            }
        }

        let values = {
            "SUV": 150,
            "BigSUV": 250,
            "Coupe": 1,
            "Wagon": 100,
            "Hatchback": 1,
            "Sedan": 50,
            "Convertible": 1,
            "Van": 250,
            "PickUp": 250,
            "BigPickUp": 400,
            "Hybrid": 150,
            "Specialized Vehicles": 150,
            "Other": 1
        };

        const value = values[category];

        if (category === 'Other') {
            categories.Other.push(selectedType);
        }

        const option = document.createElement('option');
        option.value = values[category];
        option.text = selectedType + ' (' + category + ')';
        typeSelect.appendChild(option);
        typeSelect.style.display = 'block';

        // New code
        const yearValue = getYearValue(selectedYear);
        console.log("Selected Year:", selectedYear, "Year Value:", yearValue);
    });
});





function fillSelectOptions(selectId, optionsArray, valuesArray = []) {
let select = document.getElementById(selectId);
if (select) {
select.innerHTML = '';
optionsArray.forEach((option, index) => {
  let opt = document.createElement('option');
  opt.value = valuesArray[index] || option; // Използвайте стойността от valuesArray, ако е налична
  opt.innerHTML = option;
  select.appendChild(opt);
  console.log("Options to add:", optionsArray);
console.log("Values to add:", valuesArray);
});
const idsToCheck = ['address1', 'address2', 'year', 'brand', 'car-models', 'car-value', 'email', 'phone'];
idsToCheck.forEach(id => {
    let value = getParameterByName(id);
    if (value) {
        document.getElementById(id).value = value;
    }
});

// Задаване на стойностите на радио бутоните
const radioNames = ['insurance', 'person', 'drone'];
radioNames.forEach(name => {
    let value = getParameterByName(name);
    if (value) {
        let radioButton = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radioButton) {
            radioButton.checked = true;
        }
    }
});
};
}


//КРАЙ НА ТАЗИ ОПЦИЯ 
function geocodeAddressAndExtractPostalCode(address, callback) {
const geocoder = new google.maps.Geocoder();
geocoder.geocode({ 'address': address }, function(results, status) {
    if (status === 'OK') {
        const postalCodeItem = results[0].address_components.find(component => component.types.includes("postal_code"));
        if (postalCodeItem) {
            const postalCode = postalCodeItem.long_name;
            callback(null, postalCode);
        } else {
            callback("Пощенски код не е намерен за този адрес.");
        }
    } else {
        callback('Грешка при геокодиране: ' + status);
    }
});
}

// ТОВА Е ФУНКЦИЯ ЗА СТЪПКА 2 ЗАРЕЖДА ОПЦИИТЕ




// ТАЗИ ФУНКЦИЯ ЗАРЕЖДА ГОДИНИТЕ ОТ БАЗАТА ДАННИ   




// ТОВА Е ФУНКЦИЯ КОЯТО РЕСЕТВА МЕНЮТАТА АКО СМЕНИМ ГОДИНАТА
 

var input = document.querySelector("#phone");
var iti = window.intlTelInput(input, {
    separateDialCode: true,
    initialCountry: "BG"
});



// Event listener, който ще следи за промени в инпут полето
input.addEventListener("input", function() {
    // Взима текущата стойност на инпут полето
    var number = input.value;

    // Проверява дали номерът започва с 0
    if (number.startsWith("0")) {
        // Премахва 0 от началото на номера
        input.value = number.substr(1);
    }
});

// Когато искате да получите стойността на инпут полето с кода на държавата
function getFullPhoneNumber() {
    return iti.getNumber(); // Това ще върне номера във формата +359893695920
}

// Пример за извикване на функцията:
console.log(getFullPhoneNumber());


let isDroneWorkingElement = document.querySelector('input[name="drone"]:checked');
let isDroneWorking = isDroneWorkingElement ? isDroneWorkingElement.value : 'no';
var directionsService = new google.maps.DirectionsService();    
var autocomplete1 = new google.maps.places.Autocomplete(document.getElementById('address1'));
var autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('address2'));
    
    var currentStep = 1;
    var totalSteps = 2;
        
    document.getElementById('next-step-1').addEventListener('click', function() {
    var address1 = document.getElementById('address1');
    var address2 = document.getElementById('address2');
   
    address1.addEventListener('change', function() {
  geocodeAddress(address1.value);


  
});


 //ТОВА Е ОТНОВО ФУКЦИЯ ЗА АЛЕРТ АКО НЕ Е ПОПЪЛНЕНО АДРЕС 1 И АДРЕС 2   
    if (!address1.value || !address2.value) {
        if (!address1.value) {
            document.getElementById('address1-error').textContent = 'Моля, попълнете това поле.';
            document.getElementById('address1-error').style.display = 'block';
        }
        if (!address2.value) {
            document.getElementById('address2-error').textContent = 'Моля, попълнете това поле.';
            document.getElementById('address2-error').style.display = 'block';
        }
    } else {
        document.getElementById('address1-error').style.display = 'none';
        document.getElementById('address2-error').style.display = 'none';
        changeStep(1);
    }
});
//КРАЙ НА ФУКЦИЯ ЗА АЛЕРТ АКО НЕ Е ПОПЪЛНЕНО АДРЕС 1 И АДРЕС 2 
function getCityCenterCoordinates(cityName, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': cityName }, function(results, status) {
        if (status === 'OK') {
            // Търсене на резултат, който съдържа пощенски код
            for (let result of results) {
                const postalCodeItem = result.address_components.find(component => component.types.includes("postal_code"));
                if (postalCodeItem) {
                    const location = result.geometry.location;
                    callback(null, location);
                    return;
                }
            }
            // Ако не е намерен резултат с пощенски код, използвайте първия резултат
            const location = results[0].geometry.location;
            callback(null, location);
        } else {
            callback('Грешка при геокодиране: ' + status);
        }
    });
}


function getPostalCodeFromCoordinates(coordinates, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'location': coordinates }, function(results, status) {
        if (status === 'OK') {
            const postalCodeItem = results[0].address_components.find(component => component.types.includes("postal_code"));
            if (postalCodeItem) {
                const postalCode = postalCodeItem.long_name;
                callback(null, postalCode);
            } else {
                callback("Пощенски код не е намерен за тези координати.");
            }
        } else {
            callback('Грешка при обратно геокодиране: ' + status);
        }
    });
}


function extractPostalCode(place, inputElement) {
    if (!place || !place.address_components) {
        console.error("Мястото не съдържа информация за адреса.");
        return;
    }

    const postalCodeItem = place.address_components.find(component => component.types.includes("postal_code"));

    if (postalCodeItem) {
        const postalCode = postalCodeItem.long_name;
        inputElement.value = `${inputElement.value}, ${postalCode}`;
    } else {
        console.log("Пощенски код не е намерен за този адрес.");
        getPostalCodeForCity(place.formatted_address, function(err, postalCode) {
            if (!err && postalCode) {
                inputElement.value = `${inputElement.value}, ${postalCode}`;
            } else {
                console.error(err);
            }
        });
    }
}



//ТОВА Е СЛУШАТЕЛ КОЙТО ПРОВЕРЯВА ДАЛИ КОЛАТА Е ИЗПРАВНА ИЛИ НЕ
autocomplete1.addListener('place_changed', function() {
    const place = autocomplete1.getPlace();
    const addressField = document.getElementById('address1');
    if (place.formatted_address.includes("Варна")) {
    addressField.value = `${place.formatted_address}, 9000`;
}
    if (!place.address_components.some(component => component.types.includes("postal_code"))) {
        getCityCenterCoordinates(place.formatted_address, function(err, coordinates) {
            if (!err) {
                getPostalCodeFromCoordinates(coordinates, function(err, postalCode) {
                    if (!err) {
                        addressField.value = `${place.formatted_address}, ${postalCode}`;
                    } else {
                        console.error(err);
                    }
                });
            } else {
                console.error(err);
            }
        });
    } else {
        extractPostalCode(place, addressField);
    }
});

autocomplete2.addListener('place_changed', function() {
    const place = autocomplete2.getPlace();
    const addressField = document.getElementById('address2');
    if (place.formatted_address.includes("Варна")) {
    addressField.value = `${place.formatted_address}, 9000`;
}
    if (!place.address_components.some(component => component.types.includes("postal_code"))) {
        getCityCenterCoordinates(place.formatted_address, function(err, coordinates) {
            if (!err) {
                getPostalCodeFromCoordinates(coordinates, function(err, postalCode) {
                    if (!err) {
                        addressField.value = `${place.formatted_address}, ${postalCode}`;
                    } else {
                        console.error(err);
                    }
                });
            } else {
                console.error(err);
            }
        });
    } else {
        extractPostalCode(place, addressField);
    }
});
//КРАЙ НА СЛУШАТЕЛ КОЙТО ПРОВЕРЯВА ДАЛИ КОЛАТА Е ИЗПРАВНА ИЛИ НЕ

function appendPostalCodeToAddress(addressField, place) {
    const cityName = place.address_components.find(component => component.types.includes("locality"));
    if (!cityName) {
        console.error("Не може да се намери името на града.");
        return;
    }

    getCityCenterCoordinates(cityName.long_name, function(err, coordinates) {
        if (!err) {
            getPostalCodeFromCoordinates(coordinates, function(err, postalCode) {
                if (!err) {
                    addressField.value = `${place.formatted_address}, ${postalCode}`;
                } else {
                    console.error(err);
                }
            });
        } else {
            console.error(err);
        }
    });
}


autocomplete1.addListener('place_changed', function() {
    const place = autocomplete1.getPlace();
    const addressField = document.getElementById('address1');
    appendPostalCodeToAddress(addressField, place);
});

autocomplete2.addListener('place_changed', function() {
    const place = autocomplete2.getPlace();
    const addressField = document.getElementById('address2');
    appendPostalCodeToAddress(addressField, place);
});


//ТОВА Е ФУНКЦИЯ ЗА СМЯНА НА СТЪПКИТЕ
    function changeStep(increment) {
        var nextStep = currentStep + increment;
        
        if (nextStep > totalSteps) {
            nextStep = totalSteps;
        } else if (nextStep < 1) {
            nextStep = 1;
        }
        let currentElem = document.querySelector('.step.step-' + currentStep);
let nextElem = document.querySelector('.step.step-' + nextStep);
let currentCalcElem = document.querySelector('.calculator-step.step-' + currentStep);
let nextCalcElem = document.querySelector('.calculator-step.step-' + nextStep);

if (!currentElem || !nextElem || !currentCalcElem || !nextCalcElem) {
    console.error('One or more elements not found:', {
        currentElem,
        nextElem,
        currentCalcElem,
        nextCalcElem
    });
    return; // Exit the function to prevent further errors
}

currentElem.classList.remove('active');
nextElem.classList.add('active');
currentCalcElem.classList.remove('active');
nextCalcElem.classList.add('active');

currentStep = nextStep;
// 
        // Update step navigation bar
        document.querySelector('.step.step-' + currentStep).classList.remove('active');
        document.querySelector('.step.step-' + nextStep).classList.add('active');
    
        // Update step form
        document.querySelector('.calculator-step.step-' + currentStep).classList.remove('active');
        document.querySelector('.calculator-step.step-' + nextStep).classList.add('active');
        
        currentStep = nextStep;
        console.log('Current Step:', currentStep);
console.log('Next Step:', nextStep);
    }


  
//КРАЙ НА ФУНКЦИЯ ЗА СМЯНА НА СТЪПКИ    
document.querySelectorAll('.step').forEach(stepLabel => {
    stepLabel.addEventListener('click', function() {
        // Извличане на номера на стъпката от data-step атрибута
        var stepNumber = parseInt(this.getAttribute('data-step'));
        
        // Ако потребителят кликне върху втората стъпка, извършете валидация
        if (stepNumber === 2 && !validateForm()) {
            return; // Ако валидацията е неуспешна, прекратете функцията тук
        }

        // Изчисление на инкремента, за да преминете към избраната стъпка
        var increment = stepNumber - currentStep;
        
        // Извикване на changeStep функцията с изчисления инкремент
        changeStep(increment);
    });
});

    

//ВАЛИДАЦИЯ ОТ СТЪПКА 2
    function validateForm() {
  // Вземете всички падащи менюта
  let year = document.getElementById("year");
  let brand = document.getElementById("brand");
  let carModels = document.getElementById("car-models");
  let carType = document.getElementById("car-type");

  // Проверете дали всички падащи менюта са попълнени
  if (year.value === "" || brand.value === "" || carModels.value === "" || carType.value === "") {
    // Покажете съобщения за грешка
    if (year.value === "") document.getElementById("year-error").innerText = "Моля, изберете година.";
    if (brand.value === "") document.getElementById("brand-error").innerText = "Моля, изберете марка.";
    if (carModels.value === "") document.getElementById("car-models-error").innerText = "Моля, изберете модел.";
    if (carType.value === "") document.getElementById("car-type-error").innerText = "";

    return false; // Върнете false, за да спрете прехода към следващата част
  }

  // Преминете към следващата част на калкулатора
  return true;
}

// Добавете обработчик за събитие към бутона
document.getElementById("next-step-1").addEventListener("click", function(e) {
  if (!validateForm()) {
    e.preventDefault(); // Спрете прехода, ако формата не е валидна
  }
});

//КРАЙ НА ВАЛИДАЦИЯ ОТ СТЪПКА 2




    //ГЛАВНИТЕ ФУНКЦИИ НА КАЛКУЛАТОРА

    function calculateCost() {
    let address = document.getElementById('address1').value;
    let droneRadio = document.querySelector('input[name="drone"]:checked');
    let droneWorking = droneRadio ? droneRadio.value : 'yes';
    let additionalCost = droneWorking === 'no' ? 100 : 0;
    let address2Value = document.getElementById('address2').value;
    let postcodeFromAddress2 = extractPostcodeFromAddress(address2Value);
    let postcodeValue = getPostcodeValue(postcodeFromAddress2);;
    let carValueElement = document.getElementById("car-value");
    let carValue = Number(carValueElement.value.replace(/\s/g, ''));
    let carPriceScore = carValue > 50000 ? 100 : 0;
    let insuranceChoice = document.querySelector('input[name="insurance"]:checked').value;
    let insuranceCost = insuranceChoice === "yes" ? carValue * 0.0025 : 0;
    let carTypeSelect = document.getElementById('car-type');
    let chosenCarTypeValue = carTypeSelect ? parseInt(carTypeSelect.value) : 0;

  if (carTypeSelect) {
    carTypeSelect.addEventListener('change', function () {
      chosenCarTypeValue = parseInt(this.value);
      console.log(chosenCarTypeValue); // Logs the value of the selected car type in the console
    });
    carTypeSelect.dispatchEvent(new Event('change')); // Trigger the change event immediately
  }



    console.log("Address:", address);
console.log("Drone Working:", droneWorking, "Additional Drone Cost:", additionalCost);

console.log("Car Value:", carValue, "Car Price Score:", carPriceScore);
console.log("Insurance Choice:", insuranceChoice, "Insurance Cost:", insuranceCost);
console.log(`Адрес: ${address2Value}`);
    console.log(`Пощенски код: ${postcodeFromAddress2}`);
    console.log(`Стойност: ${postcodeValue}`);

//допълнителни функции АКО
if (carValue > 49999) {
    carPriceScore = 100;
} else {
    carPriceScore = 0;
}


if (insuranceChoice === "yes") {
    insuranceCost = carValue * 0.0025;
}


    console.log("Address: " + address);
    let cost = 0; // Проверете дали сте инициализирали променливата cost.


    //СРОЙНОСТИ ЗА ДЪРЖАВИТЕ В АДРЕСИТЕ
  if (address.includes('Germany') || address.includes('Германия')) {
    cost = 600;
  } else if (address.includes('Bulgaria') || address.includes('България')) {
    cost = 0;
} else if (address.includes('Netherlands') || address.includes('Холандия')) {
        cost = 650;
    } else if (address.includes('Belgium') || address.includes('Белгия')) {
        cost = 600;
    } else if (address.includes('Spain') || address.includes('Испания')) {
        cost = 650;
    } else if (address.includes('France') || address.includes('Франция')) {
        cost = 650;
    } else if (address.includes('Portugal') || address.includes('Португалия')) {
        cost = 850;
    } else if (address.includes('Austria') || address.includes('Австрия')) {
        cost = 550;
    } else if (address.includes('Italy') || address.includes('Италия')) {
        cost = 500;
    } else if (address.includes('Luxembourg') || address.includes('Люксембург')) {
        cost = 600;
    } else if (address.includes('Denmark') || address.includes('Дания')) {
        cost = 850;
    } else if (address.includes('Switzerland') || address.includes('Швейцария')) {
        cost = 850;
    } else if (address.includes('Czech Republic') || address.includes('Чехия')) {
        cost = 600;
    } else if (address.includes('Slovakia') || address.includes('Словакия')) {
        cost = 550;
    } else if (address.includes('Slovenia') || address.includes('Словения')) {
        cost = 550;
    } else if (address.includes('Hungary') || address.includes('Унгария')) {
        cost = 550;
    } else if (address.includes('Poland') || address.includes('Полша')) {
        cost = 750;
    } else if (address.includes('Croatia') || address.includes('Хърватия')) {
        cost = 550;
    } else {
        cost = 50;
    }
 //КРАЙ НА СТОЙНОСТИТЕ ЗА ДЪРЖАВИТЕ
    
 function extractPostcodeFromAddress(address) {
    // Проверка дали адресът съдържа "Варна" или "Varna"
    if (address.toLowerCase().includes("варна") || address.toLowerCase().includes("varna")) {
        return 9000;
    }

    // Предполагам, че пощенският код е последната част от адреса (пример: ул. Васил Левски 15, 1000 София => 1000)
    let parts = address.split(" ");
    let postcode = parts[parts.length - 1];
    return Number(postcode);
}


    //ТОВА СА СТОЙНОСТИТЕ ЗА ПОЩЕНСКИТЕ КОДОВЕ
    function getPostcodeValue(postcode) {
    let value = 0;
    if (postcode >= 4400 && postcode <= 4657) {
        value = 0;
    } else if (postcode >= 4700 && postcode <= 4999) {
        value = 120;
    } else if (postcode >= 5000 && postcode <= 5295) {
        value = 90;
    } else if (postcode >= 5300 && postcode <= 5481) {
        value = 90;
    } else if (postcode >= 5500 && postcode <= 5793) {
        value = 80;
    } else if (postcode >= 5800 && postcode <= 5999) {
        value = 80;
    } else if (postcode >= 6000 && postcode <= 6297) {
        value = 70;
    } else if (postcode >= 6300 && postcode <= 6714) {
        value = 70;
    } else if (postcode >= 6600 && postcode <= 6969) {
        value = 120;
    } else if (postcode >= 7000 && postcode <= 7174) {
        value = 90;
    } else if (postcode >= 7200 && postcode <= 7460) {
        value = 120;
    } else if (postcode >= 7500 && postcode <= 7694) {
        value = 120;
    } else if (postcode >= 7700 && postcode <= 7999) {
        value = 120;
    } else if (postcode >= 8000 && postcode <= 8689) {
        value = 80;
    } else if (postcode >= 8600 && postcode <= 8789) {
        value = 80;
    } else if (postcode >= 8800 && postcode <= 8999) {
        value = 80;
    } else if (postcode >= 9000 && postcode <= 9299) {
        value = 120;
    } else if (postcode >= 9298 && postcode <= 9699) {
        value = 120;
    } else if (postcode >= 9700 && postcode <= 9974) {
        value = 120;
    }
    return value;
}
//КРАЙ НА ДОПЪЛНИТЕЛНИ ФУНКЦИИ АКО

function getYearValue(year) {
  if (year === '2024' || year === '2023') {
    return 150;
  } else if (year === '2022' || year === '2021' || year === '2020') {
    return 100;
  } else {
    return 0;
  }
}

let selectedYearElement = document.getElementById("year"); // предполагам, че това е ID-то на вашия елемент за избор на година
let selectedYear = selectedYearElement.value;
let yearValue = getYearValue(selectedYear);
console.log("Selected Year:", selectedYear, "Year Value:", yearValue);
//ФУНКЦИЯ ЗА ДДС

//КАКВО ДА СМЯТА КАЛКУЛАТОРА

let finalCost = cost + additionalCost + carPriceScore + postcodeValue + insuranceCost + yearValue + chosenCarTypeValue;
console.log("Address:", address);
    console.log("Drone additional cost:", additionalCost);
    console.log("Car price score:", carPriceScore);
    console.log("Postcode value:", postcodeValue);
    console.log("Insurance cost:", insuranceCost);
    return finalCost;
}




function calculateDistanceCost(address1, address2, callback) {
    var directionsService = new google.maps.DirectionsService();
    directionsService.route({
        origin: address1,
        destination: address2,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status == 'OK') {
            var distance = response.routes[0].legs[0].distance.value / 1000; // Разстоянието в километри
            var cost = distance * 0.10; // Разстояние умножено по 0.10
            console.log("Distance cost:", cost);
            callback(cost);
        } else {
            console.log('Грешка при намиране на разстояние: ' + status);
        }
    });
}



function calculateTotalCost(callback) {
    let address1 = document.getElementById('address1').value;
    let address2 = document.getElementById('address2').value;

    calculateDistanceCost(address1, address2, function(distanceCost) {
        let cost = calculateCost();
        let totalCost = cost + distanceCost;

        let personType = document.querySelector('input[name="person"]:checked').value;
        if (personType === "no") {
            totalCost *= 1.20; // Add 20% VAT to the total cost
        }

        console.log("Total cost after VAT:", totalCost);
        callback(totalCost);
    });
}
// Пример за извикване на функцията:



// Показва стойността на 'cost' на потребителя
function displayCost(totalcost) {
    var roundedTotalCost = Math.round(totalcost); // Закръгляне до най-близкото цяло число
    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "Цената за доставка е <span style='color:green;'>" + roundedTotalCost + " ЕВРО</span>";
    console.log(roundedTotalCost);
    return roundedTotalCost;
}





document.getElementById('calculate-cost').addEventListener('click', function(e) {
    console.log("Button clicked!");

    const idsToCheck = ['address1', 'address2', 'year', 'brand', 'car-models', 'car-type', 'car-value', 'email', 'phone'];
    const radioNamesToCheck = ['insurance', 'person', 'drone'];

    if (validateFields(idsToCheck, radioNamesToCheck) && validateRadioButtons('insurance') && validateRadioButtons('person')) {
        calculateTotalCost(function(totalCost) {
            let displayedCost = displayCost(totalCost);
            
            // Extract values from the provided IDs
            let params = idsToCheck.map(id => {
                let value = encodeURIComponent(document.getElementById(id).value);
                return `${id}=${value}`;
            });

            // Extract values from the radio buttons
            radioNamesToCheck.forEach(name => {
                let selectedValue = document.querySelector(`input[name="${name}"]:checked`);
                if (selectedValue) {
                    params.push(`${name}=${encodeURIComponent(selectedValue.value)}`);
                }
            });

            let newURL = `calculator.html?totalCost=${displayedCost}&${params.join('&')}`;
            window.location.href = newURL;
        });
    }
});
    // Изчисление на цената
    calculateCost();

    document.getElementById('cost-calculator-form').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateCost();
    
});