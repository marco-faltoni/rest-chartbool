// 157.230.17.132:4009/sales

$(document).ready(function () {

    chiamata_recupero_e_aggiorno_dati(false);

    function chiamata_recupero_e_aggiorno_dati(upload) {
        $.ajax({
            'url': 'http://157.230.17.132:4009/sales',
            'method': 'GET',
            'success': function (ris) {
                // console.log(ris);
                // elaboro i dati mensili
                var vendite_mensili = fatturato_mensile(ris);
                // estraggo le chiavi dell'oggetto creato con la funzione sopra
                var mesi = Object.keys(vendite_mensili);
                // estraggo i valori dell'oggetto creato con la funzione sopra
                var dati_mesi = Object.values(vendite_mensili);

                if (!upload) {
                    // passo le var appena fatta alla funzione che mi creerà il primo grafico
                    grafico_mensilità(mesi, dati_mesi);
                } else {
                    grafico_mese.config.data.datasets[0].data = dati_mesi;
                    grafico_mese.update();
                }


                // elaboro i dati venditori
                var vendite_venditori = grafico_vendite(ris);
                // estraggo le chiavi dell'oggetto creato con la funzione sopra
                var nomi_venditori = Object.keys(vendite_venditori);
                // estraggo i valori dell'oggetto creato con la funzione sopra
                var dati_venditori = Object.values(vendite_venditori);

                if (!upload) {
                    // passo le var appena fatta alla funzione che mi creerà il secondo grafico
                    grafico_vendite_venditori(nomi_venditori, dati_venditori);
                } else {
                    grafico_venditori.config.data.datasets[0].data = dati_venditori;
                    grafico_venditori.update();
                }


            },
            'error': function () {
                console.log('errore');
            }
        });
    }

    $('button').on('click', function () {
        // recupero il nome scelto nelle opzioni
        var nome_scelto = $('.name').children('option:selected').text();

        // recupero il mese scelto nelle opzioni
        var mese_scelto = $('.months').children('option:selected').text();

        // associo la stringa ottenuta con la il mese di moment
        var converto_mese = moment(mese_scelto, "MMMM");
        // converto il mese di moment ricavato sopra in una data moment completa
        var data_finale = converto_mese.format("DD/MM/2017");

        // faccio il parseInt del numero ricavato dall'input
        var cifra_immessa = parseInt($('input').val());

        console.log(nome_scelto, data_finale, cifra_immessa);

        // faccio una condizione per essere sicuro che l'utente selezioni una delle opzioni valide e che immetta un numero
        if (nome_scelto == 'Imprenditori' || mese_scelto == 'Mesi') {
            alert('Seleziona il Mese e/o un Imprenditore');
        } else if (cifra_immessa == isNaN || cifra_immessa <= 0) {
            alert('Immetti un numero superiore a 0');
        } else {
            $.ajax({
                'url': 'http://157.230.17.132:4009/sales',
                'method': 'POST',
                'data': {
                    'salesman': nome_scelto,
                    'amount': cifra_immessa,
                    'date': data_finale
                },
                'success': function (invio) {
                    console.log(invio);
                    chiamata_recupero_e_aggiorno_dati(true);
                },
                'error': function () {
                    alert('errore');
                }
            });
        }
    });

    // moment.locale('it');

    // FUNZIONE PER GENERARE GRAFICO DI VENDITE PER MESE
    function fatturato_mensile(risposta) {
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
            var importo = parseInt(dati_utili.amount);
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
        }

        return fatturato_mensile;
    }

    // FUNZIONE PER GENERARE GRAFICO DI VENDITE PER NOME VENDITORE
    function grafico_vendite(risposta) {
        var vendite = {};
        var somma_totale = 0;

        for (var i = 0; i < risposta.length; i++) {

            var dati_utili = risposta[i];

            var importo = dati_utili.amount;
            console.log(importo);

            somma_totale += parseInt(importo);


            var imprenditore = dati_utili.salesman;
            console.log(imprenditore);

            if (!vendite.hasOwnProperty(imprenditore)) {
                vendite[imprenditore] = parseInt(importo);
            } else {
                vendite[imprenditore] += parseInt(importo);
            }
        }

        for (const nome_venditore in vendite) {
            var importo_venditore = vendite[nome_venditore];
            var percentuale_venditore = ((importo_venditore / somma_totale) * 100).toFixed(1);
            vendite[nome_venditore] = percentuale_venditore;
        }


        console.log(vendite);
        console.log(somma_totale);

        return vendite
    }


    function grafico_mensilità(nomi_etichette, valori) {

        grafico_mese = new Chart($('#myChart')[0].getContext('2d'), {
            "type": 'line',
            "data": {
                "labels": nomi_etichette,
                "datasets": [{
                    "label": 'vendite',
                    "data": valori,
                    "backgroundColor": [
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
                    "borderColor": [
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
                    "borderWidth": 2,

                    "lineTension": 0.3,

                    "hoverBorderWidth": 4,

                    "fill": false,

                    "pointRadius": 4
                }]
            },
            "options": {
                "scales": {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                "title": {
                    display: true,
                    text: 'Fatturato su base mensile'
                },
                "legend": {
                    position: 'bottom'
                }
            }
        });
    }


    function grafico_vendite_venditori(nomi_etichette, valori) {

        grafico_venditori = new Chart($('#myChart-2')[0].getContext('2d'), {
            "type": 'doughnut',
            "data": {
                "labels": nomi_etichette,
                "datasets": [{
                    "label": '# of Votes',
                    "data": valori,
                    "backgroundColor": [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                    ],
                    "borderColor": [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    "borderWidth": 1,
                }]
            },
            "options": {
                "title": {
                    "display": true,
                    "text": 'Vendite per imprenditore'
                },
                "legend": {
                    "position": 'bottom'
                },
                "tooltips": {
                    "callbacks": {
                        "label": function (tooltipItem, data) {
                            var nome_venditore = data.labels[tooltipItem.index];
                            var percentuale_vendite = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            return nome_venditore + ': ' + percentuale_vendite + '%';
                        }
                    }
                }
            }
        });

    }


});
