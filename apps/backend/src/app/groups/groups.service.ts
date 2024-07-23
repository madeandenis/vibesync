import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {

  private readonly logger = new Logger(GroupsService.name);

  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group | null> {
    const group = this.groupRepository.create(createGroupDto);
    try {
      return await this.groupRepository.save(group);
    } catch (error) {
      this.logger.error('Failed to create group:', error);
      return null;
    }
  }

  async findAll(): Promise<Group[]> {
    try {
      return await this.groupRepository.find();
    } catch (error) {
      this.logger.error('Failed to find groups:', error);
      return [];
    }
  }

  async findOne(id: string): Promise<Group | null> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id }
      });
      if (!group) {
        this.logger.log(`Group with id ${id} not found`);
      }
      return group;
    } catch (error) {
      this.logger.error(`Failed to find group with id ${id}:`, error);
      return null;
    }
  }

  async findOneParams(params: Partial<Group>): Promise<Group | null> {
    try {
      const group = await this.groupRepository.findOne({
        where: { ...params }
      });
      if (!group) {
        this.logger.log(`Group with parameters ${JSON.stringify(params)} not found`);
      }
      return group;
    } catch (error) {
      this.logger.error(`Failed to find group with parameters ${JSON.stringify(params)}:`, error);
      return null;
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group | null> {
    try {
      let group = await this.groupRepository.findOne({
        where: { id }
      });
      if (!group) {
        this.logger.log(`Group with id ${id} not found`);
        return null;
      }

      group = { ...group, ...updateGroupDto };
      return await this.groupRepository.save(group);
    } catch (error) {
      this.logger.error(`Failed to update group with id ${id}:`, error);
      return null;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id }
      });
      if (!group) {
        this.logger.log(`Group with id ${id} not found`);
        return;
      }

      await this.groupRepository.remove(group);
    } catch (error) {
      this.logger.error(`Failed to remove group with id ${id}:`, error);
    }
  }
}
