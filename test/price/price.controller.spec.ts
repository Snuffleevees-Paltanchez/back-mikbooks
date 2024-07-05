import { Test, TestingModule } from '@nestjs/testing'
import { PriceController } from '../../src/price/price.controller'
import { PriceService } from '../../src/price/price.service'
import { NotFoundException } from '@nestjs/common'
import { EditPriceDto } from '../../src/price/dto'

class MockPriceService {
  private prices = [
    { id: 1, bookId: 1, platformId: 1, price: 50, isDeleted: false },
    { id: 2, bookId: 2, platformId: 2, price: 60, isDeleted: false },
  ]

  async deletePrice(id: number) {
    const index = this.prices.findIndex((price) => price.id === id)
    if (index !== -1) {
      this.prices[index].isDeleted = true
      return this.prices[index]
    } else {
      return null
    }
  }

  async updatePrice(id: number, priceData: EditPriceDto) {
    const index = this.prices.findIndex((price) => price.id === id)
    if (index !== -1) {
      this.prices[index].price = priceData.price
      return this.prices[index]
    } else {
      return null
    }
  }
}

describe('PriceController', () => {
  let controller: PriceController
  //let priceService: MockPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceController],
      providers: [
        {
          provide: PriceService,
          useClass: MockPriceService,
        },
      ],
    }).compile()

    controller = module.get<PriceController>(PriceController)
    //priceService = module.get<PriceService, MockPriceService>(PriceService);
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('deletePrice', () => {
    it('should mark a price as deleted', async () => {
      const priceId = 1
      const result = await controller.deletePrice(priceId)
      expect(result).toEqual({
        message: 'Price marked as deleted successfully',
        data: {
          id: 1,
          price: 50,
          isDeleted: true,
          bookId: 1,
          platformId: 1,
        },
      })
    })

    it('should throw NotFoundException if price does not exist', async () => {
      const invalidPriceId = 999
      await expect(controller.deletePrice(invalidPriceId)).rejects.toThrowError(
        NotFoundException,
      )
    })
  })

  // TO DO

  // describe('updatePrice', () => {
  //   it('should update the price successfully', async () => {
  //     const priceId = '1';
  //     const updatedPriceData: priceDto = {
  //       bookId: 1,
  //       platformId: 1,
  //       price: 75.5,
  //       date: new Date(),
  //       productUrl: 'https://example.com/product/1',
  //     };
  //     const result = await controller.updatePrice(priceId.toString(), updatedPriceData);
  //     expect(result).toEqual({
  //       id: 1,
  //       price: 75.5,
  //     });
  //   });

  //   it('should throw NotFoundException if price does not exist', async () => {
  //     const invalidPriceId = '999';
  //     const invalidPriceData: priceDto = {
  //       bookId: 999,
  //       platformId: 999,
  //       price: 99.9,
  //       date: new Date(),
  //       productUrl: 'https://example.com/product/999',
  //     };
  //     await expect(controller.updatePrice(invalidPriceId.toString(), invalidPriceData)).rejects.toThrowError(
  //       NotFoundException,
  //     );
  //   });
  // });
})
