import pdfmake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { formatoNumero } from '../utils/formatoNumero.js';

pdfmake.vfs = pdfFonts.pdfMake.vfs;

async function generarPdfBalanceComprobacionBase64(infoBalanceComprobacion) {
    const buildTableBody = (infoBalanceComprobacion) => {
        const body = [
            [{ text: 'Cuenta', style: 'tableHeader' }, { text: 'Debe', style: 'tableHeader' }, { text: 'Haber', style: 'tableHeader' }]
        ];

        const addCategoryTitle = (title) => {
            body.push([
                { text: title, style: 'categoryTitle', colSpan: 3, alignment: 'left' }, {}, {}
            ]);
        };

        const addAccounts = (cuentas) => {
            cuentas.forEach(cuenta => {
                body.push([
                    { text: cuenta.str_detalle_libro_diario_nombre_cuenta, style: 'tableData' },
                    { text: formatoNumero(cuenta.debe.toFixed(2)), style: 'tableData' },
                    { text: formatoNumero(cuenta.haber.toFixed(2)), style: 'tableData' }
                ]);
            });
        };

        addCategoryTitle('ACTIVOS');
        addAccounts(infoBalanceComprobacion.cuentasActivos);

        addCategoryTitle('PASIVOS');
        addAccounts(infoBalanceComprobacion.cuentasPasivos);

        addCategoryTitle('PATRIMONIO');
        addAccounts(infoBalanceComprobacion.cuentasPatrimonio);

        addCategoryTitle('INGRESOS');
        addAccounts(infoBalanceComprobacion.cuentasIngresos);

        addCategoryTitle('GASTOS');
        addAccounts(infoBalanceComprobacion.cuentasGastos);

        body.push([
            { text: 'Total', style: 'totalLabel' },
            { text: formatoNumero(infoBalanceComprobacion.totalDebitos.toFixed(2)), style: 'totalData' },
            { text: formatoNumero(infoBalanceComprobacion.totalCreditos.toFixed(2)), style: 'totalData' }
        ]);

        return body;
    };

    const docDefinition = {
        content: [
            { text: infoBalanceComprobacion.cliente, style: 'title' },
            { text: 'BALANCE DE COMPROBACIÓN', style: 'header' },
            { text: `DEL ${new Date(infoBalanceComprobacion.fechaInicio).toLocaleDateString()} AL ${new Date(infoBalanceComprobacion.fechaFin).toLocaleDateString()}`, style: 'subheader' },
            { text: ' ' },  // Espacio en blanco
            {
                table: {
                    widths: ['*', 'auto', 'auto'],
                    body: buildTableBody(infoBalanceComprobacion)
                }
            }
        ],
        styles: {
            title: {
                fontSize: 16, // Disminuir el tamaño de la letra
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10],
            },
            header: {
                fontSize: 14, // Disminuir el tamaño de la letra
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10],
            },
            subheader: {
                fontSize: 12, // Disminuir el tamaño de la letra
                alignment: 'center',
                margin: [0, 0, 0, 15],
            },
            tableHeader: {
                fontSize: 10, // Disminuir el tamaño de la letra
                bold: true,
                fillColor: '#eeeeee',
                margin: [0, 5, 0, 5],
            },
            tableData: {
                fontSize: 10, // Disminuir el tamaño de la letra
                margin: [0, 5, 0, 5],
            },
            categoryTitle: {
                fontSize: 12, // Tamaño de letra para los títulos de las categorías
                bold: true,
                fillColor: '#d3d3d3',
                margin: [0, 5, 0, 5],
                alignment: 'left'
            },
            totalLabel: {
                fontSize: 10, // Disminuir el tamaño de la letra
                bold: true,
                margin: [0, 5, 0, 5],
                fillColor: '#337ab7',
            },
            totalData: {
                fontSize: 10, // Disminuir el tamaño de la letra
                bold: true,
                margin: [0, 5, 0, 5],
                alignment: 'right',
                fillColor: '#5cb85c',
            }
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

export default generarPdfBalanceComprobacionBase64;


