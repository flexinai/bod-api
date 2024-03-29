import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Week} from '../models';
import {WeekRepository} from '../repositories';

export class WeekController {
  constructor(
    @repository(WeekRepository)
    public weekRepository : WeekRepository,
  ) {}

  @post('/weeks', {
    responses: {
      '200': {
        description: 'Week model instance',
        content: {'application/json': {schema: getModelSchemaRef(Week)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Week, {
            title: 'NewWeek',
            exclude: ['id'],
          }),
        },
      },
    })
    week: Omit<Week, 'id'>,
  ): Promise<Week> {
    return this.weekRepository.create(week);
  }

  @get('/weeks/count', {
    responses: {
      '200': {
        description: 'Week model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Week) where?: Where<Week>,
  ): Promise<Count> {
    return this.weekRepository.count(where);
  }

  @get('/weeks', {
    responses: {
      '200': {
        description: 'Array of Week model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Week, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Week) filter?: Filter<Week>,
  ): Promise<Week[]> {
    return this.weekRepository.find(filter);
  }

  @patch('/weeks', {
    responses: {
      '200': {
        description: 'Week PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Week, {partial: true}),
        },
      },
    })
    week: Week,
    @param.where(Week) where?: Where<Week>,
  ): Promise<Count> {
    return this.weekRepository.updateAll(week, where);
  }

  @get('/weeks/{id}', {
    responses: {
      '200': {
        description: 'Week model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Week, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Week, {exclude: 'where'}) filter?: FilterExcludingWhere<Week>
  ): Promise<Week> {
    return this.weekRepository.findById(id, filter);
  }

  @patch('/weeks/{id}', {
    responses: {
      '204': {
        description: 'Week PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Week, {partial: true}),
        },
      },
    })
    week: Week,
  ): Promise<void> {
    await this.weekRepository.updateById(id, week);
  }

  @put('/weeks/{id}', {
    responses: {
      '204': {
        description: 'Week PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() week: Week,
  ): Promise<void> {
    await this.weekRepository.replaceById(id, week);
  }

  @del('/weeks/{id}', {
    responses: {
      '204': {
        description: 'Week DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.weekRepository.deleteById(id);
  }
}
