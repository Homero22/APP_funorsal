import pdfmake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfmake.vfs = pdfFonts.pdfMake.vfs;

async function generarPdfBalanceGeneralBase64(infoBalanceGeneral) {
    const buildTableBody = (infoBalanceGeneral) => {
        const body = [
            [{ text: 'Cuenta', style: 'tableHeader' }, { text: 'Debe', style: 'tableHeader' }, { text: 'Haber', style: 'tableHeader' }, { text: 'Saldo', style: 'tableHeader' }]
        ];

        const addCategoryTitle = (title) => {
            body.push([
                { text: title, style: 'categoryTitle', colSpan: 4, alignment: 'left' }, {}, {}, {}
            ]);
        };

        const addAccounts = (cuentas) => {
            cuentas.forEach(cuenta => {
                body.push([
                    { text: cuenta.str_detalle_libro_diario_nombre_cuenta, style: 'tableData' },
                    { text: cuenta.debe.toFixed(2), style: 'tableData' },
                    { text: cuenta.haber.toFixed(2), style: 'tableData' },
                    { text: cuenta.saldo.toFixed(2), style: 'tableData' }
                ]);
            });
        };

        addCategoryTitle('Activos');
        addAccounts(infoBalanceGeneral.cuentasActivos);

        addCategoryTitle('Pasivos');
        addAccounts(infoBalanceGeneral.cuentasPasivos);

        addCategoryTitle('Patrimonio');
        addAccounts(infoBalanceGeneral.cuentasPatrimonio);

        // Añadir la fila para Resultado del Ejercicio
        body.push([
            { text: 'Resultado del Ejercicio', style: 'categoryTitle', colSpan: 3, alignment: 'right' },
            {},
            {},
            { text: infoBalanceGeneral.resultadoEjercicio.toFixed(2), style: 'tableData' }
        ]);

        return body;
    };

    const docDefinition = {
        content: [
            { text: infoBalanceGeneral.cliente, style: 'title' },
            { text: 'BALANCE GENERAL', style: 'header' },
            { text: `DEL ${new Date(infoBalanceGeneral.fechaInicio).toLocaleDateString()} AL ${new Date(infoBalanceGeneral.fechaFin).toLocaleDateString()}`, style: 'subheader' },
            { text: ' ' },  // Espacio en blanco
            {
                table: {
                    widths: ['*', 'auto', 'auto', 'auto'],
                    body: buildTableBody(infoBalanceGeneral)
                }
            }
        ],
        styles: {
            title: {
                fontSize: 16,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10],
            },
            header: {
                fontSize: 14,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10],
            },
            subheader: {
                fontSize: 12,
                alignment: 'center',
                margin: [0, 0, 0, 15],
            },
            tableHeader: {
                fontSize: 10,
                bold: true,
                fillColor: '#eeeeee',
                margin: [0, 5, 0, 5],
            },
            tableData: {
                fontSize: 10,
                margin: [0, 5, 0, 5],
            },
            categoryTitle: {
                fontSize: 12,
                bold: true,
                fillColor: '#d3d3d3',
                margin: [0, 5, 0, 5],
                alignment: 'left'
            },
        }
    };

    return new Promise((resolve, reject) => {
        const pdfDoc = pdfmake.createPdf(docDefinition);
        pdfDoc.getBase64((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}

export default generarPdfBalanceGeneralBase64;
