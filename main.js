// 157.230.17.132:4009/sales

// Milestone   1: Facendo   una   chiamata   GET   all’endpoint   /sales ,    l’API   ci   ritornerà   la   lista   di   tutte   le vendite   fatte   dai   venditori   dell’azienda: Da   questi   dati   dobbiamo   creare   due   grafici:

// 1.Andamento   delle   vendite   totali   della   nostra   azienda   con   un   grafico   di   tipo   Line (http:www.chartjs.org/docs/latest/charts/line.html) con un   unico   dataset   che conterrà   il   numero   di   vendite   totali   mese   per   mese   nel   2017.

// 2.Il   secondo   grafico   è   quello   a   torta (http:www.chartjs.org/docs/latest/charts/doughnut.html)   che   evidenzierà   il contributo   di   ogni   venditore   per   l’anno   2017.   Il   valore   dovrà   essere   la percentuale   di   vendite   effettuate   da   quel   venditore   (fatturato_del   venditore   / fatturato_totale)
$(document).ready(function() {


chiamata_recupero_e_aggiorno_dati();

function chiamata_recupero_e_aggiorno_dati(){
    $.ajax({
        'url': 'http://157.230.17.132:4009/sales',
        'method': 'GET',
        'success': function(ris) {
            console.log(ris);
            // grafico_fatturato_mensile(ris);
            // grafico_vendite(ris);
        },
        'error': function() {
            console.log('errore');
        }
    });
}

$('button').on('click', function(){

    var nome_scelto = $('.name').children('option:selected').text();

    var mese_scelto = $('.months').children('option:selected').text();
    var converto_mese = moment(mese_scelto, "MMMM");
    var data_finale = converto_mese.format("DD-MM-2017");

    var cifra_immessa = parseInt($('input').val());

    console.log(nome_scelto, data_finale, cifra_immessa);
    // $('input').val('');

    $.ajax({
        'url': 'http://157.230.17.132:4009/sales',
        'method': 'POST',
        'data': {
            'salesman': nome_scelto,
            'amount': cifra_immessa,
            'date': data_finale
        },
        'success': function(invio) {
            console.log(invio);
            chiamata_recupero_e_aggiorno_dati();
        },
        'error': function() {
            alert('errore');
        }
    });
});

// moment.locale('it');

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
        // recupero l'elemento corrente, che corrisponde ad un oggetto
        var dati_utili = risposta[i];

        // recupero i vari fatturati, espressi in numeri
        var importo = dati_utili.amount;
        console.log(importo);
        // recupero la data per ogni singolo fatturato
        var data = dati_utili.date;
        console.log(data);
        // con moment associo la data recuperata prima con il formato giusto, e la sostituisco con il mese scritto in lettere corrispondente
        var mese = moment(data, "DD-MM-YYYY");
        data = mese.format('MMMM');
        console.log(data);

        // incremento ad ogni giro l'importo al mese corrente
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
                label: 'vendite',
                data: valori,
                backgroundColor: [
                    'rgba(202, 46, 85, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(255, 206, 86, 0.4)',
                    'rgba(75, 192, 192, 0.4)',
                    'rgba(153, 102, 255, 0.4)',
                    'rgba(255, 159, 64, 0.4)',
                    'rgba(146, 170, 131, 0.4)',
                    'rgba(14, 14, 82, 0.4)',
                    'rgba(179, 136, 235, 0.4)',
                    'rgba(241, 191, 152, 0.4)',
                    'rgba(84, 94, 117, 0.4)',
                    'rgba(70, 37, 33, 0.4)',
                ],
                borderColor: [
                    'rgba(202, 46, 85, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(146, 170, 131, 1)',
                    'rgba(14, 14, 82, 1)',
                    'rgba(179, 136, 235, 1)',
                    'rgba(241, 191, 152, 1)',
                    'rgba(84, 94, 117, 1)',
                    'rgba(70, 37, 33, 1)',
                ],
                borderWidth: 2,

                lineTension: 0.2,

                hoverBorderWidth: 4,

                fill: false,

                pointRadius: 4
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Fatturato su base mensile'
            },
            legend: {
                position: 'bottom'
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

        var numero_reale = ((numeri / somma_totale) * 100);
        console.log(numero_reale);

        var percentuale = numero_reale.toFixed(1);
        console.log(percentuale);

        percentuali.push(percentuale);

    }
    console.log(percentuali);


    var ctx = $('#myChart-2')[0].getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'doughnut',
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
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,


            }]
        },
        options: {

            title: {
                display: true,
                text: 'Vendite per imprenditore'
            },
            legend: {
                position: 'bottom'
            }

        }
    });
}

});
