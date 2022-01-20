'use restrict'

//필요한 변수들
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

const canvas_radial = document.getElementById('radial');
const ctx_radial = canvas_radial.getContext('2d');

const resultData = localStorage.getItem('result'); //이전 페이지에서 얻은 결과들
const getValue = JSON.parse(resultData);

const color = ['yellow', 'orange', 'red', 'green', 'turquoise', 'purple', 'yellowgreen', 'bluegreen', 'indigo', 'blue', 'magenta', 'redorange'];
//              0           1       2       3       4               5       6               7           8           9       10         11      


function loadResults() { //json 데이터 받아서 처리
    return fetch('short_ver.json')
    .then(response => response.json())
    .then(json => json.results);
}

function addStyle(result) {
    const color = document.querySelector('.color')
    const content = document.querySelector('.content');
    const i = document.querySelectorAll('.result i');
    const short = document.querySelector('.result .short');
    const support1 = document.querySelector('.support1');
    const support2 = document.querySelector('.support2');

    color.classList.add(`${result[0].color}`); //color
    content.classList.add(`border_${result[0].color}`); 
    i.forEach((element) => element.classList.add(`icon_${result[0].color}`));    
    short.classList.add(`border_${result[0].color}`);
    support1.classList.add(`${result[0].support1}`);
    support2.classList.add(`${result[0].support2}`);    
}

function displayResult(results, maxLoc){
    let result_color = color[maxLoc];
    let selection = results.filter(result => result.color === result_color);
    const target = $(".btn");
    target.before(createHTMLString(selection));
    addStyle(selection);
} 

function createHTMLString(result) { //결과 데이터를 동적으로 붙이기
    const character_length = result[0].character.length;
    const ability_length = result[0].ability.length;
    let ability_string = `<li><i class="fas fa-check"></i> 능력: `;
    let character_string = `<li class="short">`;

    //1. 능력 부분
    let sub_ability_string = ``;
    for(let i=0;i<ability_length;i++){
        if(i!==ability_length-1){
            sub_ability_string += `${result[0].ability[i]}, `;
        } else {
            sub_ability_string += `${result[0].ability[i]}</li>`;
        }
    }
    ability_string += sub_ability_string;

    //2. 특징 부분
    let sub_character_string = ``;
    for(let i=0;i<character_length;i++){
        if(i!==character_length-1){
            sub_character_string += `<i class="far fa-check-circle"></i> ${result[0].character[i]}<br>`;
        } else {
            sub_character_string += `<i class="far fa-check-circle"></i> ${result[0].character[i]}<br>
                                    </li>`;
        }
    }
    character_string += sub_character_string;

    let total_string = `
    <div class="result">
        <div class="color">${result[0].title}</div>
        <ul class="content">
            `+ability_string+character_string+
            `<li class="support">
                <div>Support Color</div>
                <div class="support1">${result[0].support1}</div>
                <div class="support2">${result[0].support2}</div>
            </li>
        </ul>
    </div>
    `;

    return total_string;
}

window.onload = function(){
    let resultArr = Object.values(getValue); //y축
    let matchArr = [...resultArr]; //number1, 2, 3 제거 -> 개수 세지 x
    matchArr.shift();
    matchArr.shift();
    matchArr.shift();

    let maxValue = Math.max(...matchArr);
    let maxLoc = matchArr.indexOf(maxValue);
    let ticks = []; //x축
    for(let i=1;i<=resultArr.length;i++){
        ticks.push(`${i}`);
    }

    //1. 막대 그래프 그리기
    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ticks,
            datasets: [{
                label: 'Bar Chart',
                data: resultArr,
                backgroundColor: '#FF6384',
                borderColor: 'rgb(255, 99, 132)',
            }]
        },
        options: {
            scales: { 
                yAxes: [{                   //y축 설정 
                    ticks: { 
                        stepSize: 1,        //y축 간격
                        suggestedMin: 0,    //y축 최소값
                        suggestedMax: 10,   //y축 최대값 
                    }
                }]
            },
            // legend: {
            //     display:true
            //     // position: 'left'
            // }
        }
    })

    //2. 방사형 그래프 그리기
    const labels = [1, 2, 3, 4, 5, 6, 7];
    const data = {
        labels: ticks,
        datasets: [{
            label: 'Radial Chart',
            data: resultArr,
            backgroundColor: 'transparent',
            borderColor: '#ea7387',
            borderWidth: 2,
        }]
    };

    const radial = new Chart(ctx_radial, {
        type: 'radar',
        data,
        options: {
            scale: {
                // gridLines: {
                //     color: "black",
                //     lineWidth: 3
                // },
                // angleLines: {
                //     display: false
                // },
                // ticks: {
                //     beginAtZero: true,
                //     min: 0,
                //     max: 100,
                //     stepSize: 20
                // },
                // pointLabels: {
                //     fontSize: 18,
                //     fontColor: "green"
                // }
            },
            legend: {
                // position: 'left'
            }
        }
    });

    loadResults()
    .then(results => {
        displayResult(results, maxLoc);
    })
    .catch(console.log);
}    