import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {SessionItem} from './session-item.model';
import {SetStatistic} from './set-statistic.model';

@model()
export class SessionItemStatistic extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  rpe: number;

  @property({
    type: 'string',
  })
  notes?: string;

  @belongsTo(() => SessionItem)
  sessionItemId: number;

  @hasMany(() => SetStatistic)
  setStatistics: SetStatistic[];

  @property({
    type: 'number',
  })
  sessionStatisticId?: number;

  constructor(data?: Partial<SessionItemStatistic>) {
    super(data);
  }
}

export interface SessionItemStatisticRelations {
  // describe navigational properties here
}

export type SessionItemStatisticWithRelations = SessionItemStatistic & SessionItemStatisticRelations;
