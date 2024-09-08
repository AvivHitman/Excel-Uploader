import { Controller, Get } from '@nestjs/common';
import { CustomersService } from '../services/customer.service';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Get()
    findAll() {
        return this.customersService.findAll();
    }
}
