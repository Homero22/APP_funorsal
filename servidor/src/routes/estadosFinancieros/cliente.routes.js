import Router from 'express';
import clienteController from '../../controllers/estadosFinancieros/cliente.controllers.js';

const router = Router();
router.get('/todos', clienteController.obtenerTodosClientes);
router.get('/', clienteController.obtenerClientes);
router.get('/:id', clienteController.obtenerCliente);
router.post('/', clienteController.crearCliente);
router.put('/:id', clienteController.actualizarCliente);
router.delete('/:id', clienteController.eliminarCliente);


export default router;