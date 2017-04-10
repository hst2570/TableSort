var wp_table_sort = function (table) {
    var that = {};
    var thead = table.thead;
    var tbody = table.tbody;
    var sortTypeFlag = setSortTypeFlag();
    var COLUMN_STATUS_ELEMENT = '<span class="columnStatus" style="z-index:1;position: relative;width:8px;color:#A4A4A4"></span>';
    var inputElement = [];

    function setSortTypeFlag() {
        var i;
        var flag = [];

        for (i = 0 ; i < thead.length ; i++) {
            flag[i] = false;
        }

        return flag;
    }

    function getElementData(tbody) {
        var trCount, tdCount;
        var tbodyData;
        var tmp_data;
        var data = [];

        for (trCount = 0 ; trCount < tbody.length ; trCount++) {
            tmp_data = {};

            for (tdCount = 0 ; tdCount < tbody[trCount].children.length ; tdCount++) {
                tbodyData = tbody[trCount].cells[tdCount];

                if (!tbodyData.innerHTML.match(/<input.*/g)) {
                    tmp_data[tdCount] = tbodyData.innerText;
                } else {
                    tmp_data[tdCount] = tbodyData.children[0].value || '0';
                }
            }

            tmp_data['html'] =  tbody[trCount].outerHTML;
            data[trCount] = tmp_data;

        }
        return data;
    }

    function sortEvent(data, column) {
        var copyData = [];
        var i;

        for (i = 0 ; i < data.length ; i++) {
            copyData[i] = data[i];
        }

        if (sortTypeFlag[column] === false) {
            copyData = bubbleSort(copyData, column);
            sortTypeFlag = setSortTypeFlag();
            sortTypeFlag[column] = true;
        } else {
            copyData = bubbleSort(copyData, column);
            copyData.reverse();
            sortTypeFlag = setSortTypeFlag();
        }

        return copyData;
    }

    function bubbleSort(theArray, column) {
        var i, j;
        var firstValue, secondValue, temp;

        for (i = theArray.length - 1; i >= 0; i--) {
            for (j = 0; j < i; j++) {
                firstValue = theArray[j][column].replace(/,+/g, '').replace(/\s/g, '');
                secondValue = theArray[j + 1][column].replace(/,+/g, '').replace(/\s/g, '');

                var typeCheckFirst = parseInt(firstValue);
                var typeCheckSecond = parseInt(secondValue);

                if (!isNaN(typeCheckFirst) && !isNaN(typeCheckSecond)) {
                    firstValue = typeCheckFirst;
                    secondValue = typeCheckSecond;
                }

                if (firstValue < secondValue) {
                    temp = theArray[j];
                    theArray[j] = theArray[j + 1];
                    theArray[j + 1] = temp;
                }
            }
        }

        return theArray;
    }

    function sortDOMElement(data, tbody) {
        var trCount;

        for (trCount = 0 ; trCount < data.length ; trCount++) {
            tbody[trCount].outerHTML = data[trCount]['html'];
        }

        addCommaInTable(tbody);
        setInputValueComma(inputElement);
    }

    function addCommaInTable(tbody) {
        var trCount, tdCount;

        for (trCount = 0 ; trCount < tbody.length ; trCount++) {
            tmp_data = {};

            for (tdCount = 0 ; tdCount < tbody[trCount].children.length ; tdCount++) {
                tbodyData = tbody[trCount].cells[tdCount];

                if (!tbodyData.innerText.match(/[^0-9]+/g) && !tbodyData.innerHTML.match(/<input.*/g)) {
                    tbodyData.innerText = addComma(tbodyData.innerText);
                } else if(tbodyData.innerHTML.match(/<input.*/g)){
                    tbodyData.children[0].value = addComma(tbodyData.children[0].value);
                }
            }
        }
    }

    function setInputValueComma(classElement) {
        for (var i = 0 ; i < classElement.length ; i++) {
            classElement[i].onblur = (function (i) {
                return function () {
                    classElement[i].value = addComma(classElement[i].value);
                }
            })(i);
        }
    }

    function setColumnStatus(index) {
        var statusElement = document.getElementsByClassName('columnStatus');
        var i;

        for (i = 0 ; i < statusElement.length ; i++){
            statusElement[i].innerHTML = '';
        }

        if (sortTypeFlag[index]){
            statusElement[index].innerHTML = '↑';
        } else {
            statusElement[index].innerHTML = '↓';
        }
    }

    that.setSortTable = function () {
        var i;
        var data = getElementData(tbody);

        for (i = 0 ; i < thead.length ; i++) {
            thead[i].style.cursor = 'pointer';
            thead[i].innerHTML += COLUMN_STATUS_ELEMENT;

            thead[i].onclick = function (index) {
                return function () {
                    var sortedData = sortEvent(data, index);
                    sortDOMElement(sortedData, tbody);
                    setColumnStatus(index);
                };
            }(i);
        }
    };

    that.setInputElement = function (classElement) {
        inputElement = classElement;
    };

    return that;
};
