// 157.230.17.132:4009/sales

// Milestone   1: Facendo   una   chiamata   GET   all’endpoint   /sales ,    l’API   ci   ritornerà   la   lista   di   tutte   le vendite   fatte   dai   venditori   dell’azienda: Da   questi   dati   dobbiamo   creare   due   grafici:

// 1.Andamento   delle   vendite   totali   della   nostra   azienda   con   un   grafico   di   tipo   Line (http:www.chartjs.org/docs/latest/charts/line.html) con un   unico   dataset   che conterrà   il   numero   di   vendite   totali   mese   per   mese   nel   2017.

// 2.Il   secondo   grafico   è   quello   a   torta (http:www.chartjs.org/docs/latest/charts/doughnut.html)   che   evidenzierà   il contributo   di   ogni   venditore   per   l’anno   2017.   Il   valore   dovrà   essere   la percentuale   di   vendite   effettuate   da   quel   venditore   (fatturato_del   venditore   / fatturato_totale)

$.ajax({
    'url': 'http://157.230.17.132:4009/sales',
    'method': 'GET',
    'success': function(ris) {
        console.log(ris);
        grafico_fatturato_mensile(ris);
        grafico_vendite(ris);
    },
    'error': function() {
        console.log('errore');
    }
});


// FUNZIONE PER GENERARE GRAFICO DI VENDITE PER MESE
function grafico_fatturato_mensile(risposta) {

    var fatturato_mensile = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
    };

    for (var i = 0; i < risposta.length; i++) {

        var dati_utili = risposta[i];

        var importo = dati_utili.amount;
        console.log(importo);

        var data = dati_utili.date;
        console.log(data);

        var mese = moment(data, "DD-MM-YYYY");
        data = mese.format('MMMM');
        console.log(data);

        fatturato_mensile[mese.format('MMMM')] += importo;

        // PROCEDIMENTO SE AVESSI AVUTO L'OGGETTO "FATTURATO MENSILE" VUOTO SENZA CHIAVI E VALORI
        // if (!fatturato_mensile.hasOwnProperty(data)) {
        //     fatturato_mensile[mese.format('MMMM')] = importo;
        // } else {
        //     fatturato_mensile[mese.format('MMMM')] += importo;
        // }

        console.log(fatturato_mensile);
    }

    var chiavi = Object.keys(fatturato_mensile);
    var valori = Object.values(fatturato_mensile);

    var ctx = $('#myChart')[0].getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chiavi,
            datasets: [{
                label: '# of Votes',
                data: valori,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}



// FUNZIONE PER GENERARE GRAFICO DI VENDITE PER NOME VENDITORE
function grafico_vendite(risposta) {
    var vendite = {};
    var somma_totale = 0;

    for (var i = 0; i < risposta.length; i++) {

        var dati_utili = risposta[i];

        var importo = dati_utili.amount;
        console.log(importo);

        somma_totale += importo;


        var imprenditore = dati_utili.salesman;
        console.log(imprenditore);

        if (!vendite.hasOwnProperty(imprenditore)) {
            vendite[imprenditore] = importo;
        } else {
            vendite[imprenditore] += importo;
        }
    }


    console.log(vendite);
    console.log(somma_totale);

    var chiavi = Object.keys(vendite);

    var valori = Object.values(vendite);

    var percentuali = [];

    for (var a = 0; a < valori.length; a++) {
        var numeri = valori[a];
        console.log(numeri);
        var percent = ((numeri / somma_totale) * 100);
        console.log(percent);
        percentuali.push(percent);

    }
    console.log(percentuali);



    var ctx = $('#myChart-2')[0].getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chiavi,
            datasets: [{
                label: '# of Votes',
                data: percentuali,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {

        }
    });
}
