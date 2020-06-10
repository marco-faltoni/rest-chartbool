// 157.230.17.132:4009/sales

// Milestone   1: Facendo   una   chiamata   GET   all’endpoint   /sales ,    l’API   ci   ritornerà   la   lista   di   tutte   le vendite   fatte   dai   venditori   dell’azienda: Da   questi   dati   dobbiamo   creare   due   grafici:

// 1.Andamento   delle   vendite   totali   della   nostra   azienda   con   un   grafico   di   tipo   Line (http:www.chartjs.org/docs/latest/charts/line.html) con un   unico   dataset   che conterrà   il   numero   di   vendite   totali   mese   per   mese   nel   2017.

// 2.Il   secondo   grafico   è   quello   a   torta (http:www.chartjs.org/docs/latest/charts/doughnut.html)   che   evidenzierà   il contributo   di   ogni   venditore   per   l’anno   2017.   Il   valore   dovrà   essere   la percentuale   di   vendite   effettuate   da   quel   venditore   (fatturato_del   venditore   / fatturato_totale)

$.ajax({
    'url': 'http://157.230.17.132:4009/sales',
    'method': 'GET',
    'success': function(risposta) {
        console.log(risposta);

        var fatturato_mensile = {};

        for (var i = 0; i < risposta.length; i++) {

            var dati_utili = risposta[i];

            var importo = dati_utili.amount;
            console.log(importo);

            var data = dati_utili.date;
            console.log(data);

            var mese = moment(data, "DD-MM-YYYY");
            data = mese.format('MMMM');
            console.log(data);

            if (!fatturato_mensile.hasOwnProperty(data)) {
                fatturato_mensile[mese.format('MMMM')] = importo;
            } else {
                fatturato_mensile[mese.format('MMMM')] += importo;
            }
            console.log(fatturato_mensile);
        }


    },
    'error': function() {
        console.log('errore');
    }
});






var ctx = $('#myChart')[0].getContext('2d');

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
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
