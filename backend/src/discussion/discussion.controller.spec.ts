import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionController } from './discussion.controller';

describe('DiscussionController', () => {
  let controller: DiscussionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionController],
    }).compile();

    controller = module.get<DiscussionController>(DiscussionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
