
import fs from 'fs';
import pdfmake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';


pdfmake.vfs = pdfFonts.pdfMake.vfs;

async function generarPdfBalanceBase64(infoBalanceIngresosGastos) {
    const docDefinition = {
        content: [
            { text: infoBalanceIngresosGastos.cliente, style: 'title' },
            { text: 'BALANCE DE INGRESOS Y GASTOS', style: 'header' },
            { text: `DEL ${new Date(infoBalanceIngresosGastos.fechaInicio).toLocaleDateString()} AL ${new Date(infoBalanceIngresosGastos.fechaFin).toLocaleDateString()}`, style: 'subheader' },
            { text: ' ' },  // Espacio en blanco
            { text: 'INGRESOS', style: 'sectionHeader' },
            {
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        ...infoBalanceIngresosGastos.cuentasIngresos.map(cuenta => [
                            { text: cuenta.str_detalle_libro_diario_nombre_cuenta, style: 'tableData' },
                            { text: cuenta.dc_detalle_libro_diario_monto.toFixed(2), style: 'tableData' }
                        ]),
                        [
                            { text: 'Total Ingresos', style: 'totalLabel' },
                            { text: infoBalanceIngresosGastos.ingresos.toFixed(2), style: 'totalData' }
                        ]
                    ]
                }
            },
            { text: ' ' },  // Espacio en blanco
            { text: 'GASTOS', style: 'sectionHeader' },
            {
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        ...infoBalanceIngresosGastos.cuentasGastos.map(cuenta => [
                            { text: cuenta.str_detalle_libro_diario_nombre_cuenta, style: 'tableData' },
                            { text: cuenta.dc_detalle_libro_diario_monto.toFixed(2), style: 'tableData' }
                        ]),
                        [
                            { text: 'Total Gastos', style: 'totalLabel' },
                            { text: infoBalanceIngresosGastos.gastos.toFixed(2), style: 'totalData' }
                        ]
                    ]
                }
            },
            { text: ' ' },  // Espacio en blanco
            { text: 'RESULTADO DEL EJERCICIO', style: 'sectionHeader' },
            { text: infoBalanceIngresosGastos.resultado.toFixed(2), style: 'result' }
        ],
        styles: {
            title: {
                fontSize: 20,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 20],
                // color: '#31708f'  // Color azul
            },
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10],
                // color: '#3c763d'  // Color verde oscuro
            },
            subheader: {
                fontSize: 15,
                alignment: 'center',
                margin: [0, 0, 0, 20],
                // color: '#8a6d3b'  // Color marrón
            },
            sectionHeader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5],
                // color: '#a94442'  // Color rojo oscuro
            },
            tableData: {
                margin: [0, 5, 0, 5],
                // fillColor: '#f0ad4e'  // Color naranja claro para datos de tabla
            },
            totalLabel: {
                bold: true,
                margin: [0, 5, 0, 5],
                fillColor: '#337ab7'  // Color azul oscuro para etiquetas de total
            },
            totalData: {
                bold: true,
                margin: [0, 5, 0, 5],
                alignment: 'right',
                fillColor: '#5cb85c'  // Color verde para datos de total
            },
            result: {
                fontSize: 16,
                bold: true,
                alignment: 'right',
                margin: [0, 10, 0, 10],
                color: '#d9534f'  // Color rojo para resultado
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

export default generarPdfBalanceBase64;

