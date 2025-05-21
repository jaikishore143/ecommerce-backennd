import { Router } from 'express';
import { AddressesController } from '../controllers/addresses.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Address routes (authenticated users)
router.get('/', authenticate, AddressesController.getUserAddresses);
router.get('/:id', authenticate, AddressesController.getAddressById);
router.post('/', authenticate, AddressesController.createAddress);
router.put('/:id', authenticate, AddressesController.updateAddress);
router.delete('/:id', authenticate, AddressesController.deleteAddress);

export default router;
