import {belongsTo, Entity, hasOne, model, property} from '@loopback/repository';
import {Exercise} from './exercise.model';
import {SessionItemStatistic} from './session-item-statistic.model';

@model()
export class SessionItem extends Entity {
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
  reps: number;

  @property({
    type: 'boolean',
    required: true,
  })
  AMRAP: boolean;

  @property({
    type: 'boolean',
  })
  leftRight?: boolean;

  @property({
    type: 'number',
    required: true,
  })
  sets: number;

  @property({
    type: 'number',
    required: true,
  })
  weight: number;

  @property({
    type: 'string'
  })
  weightUnit?: string;

  @property({
    type: 'string',
    required: true,
  })
  intensity: string;

  @property({
    type: 'string',
    required: true,
  })
  tempo: string;

  @property({
    type: 'number',
  })
  order: number;

  @belongsTo(() => Exercise)
  exerciseId: number;

  @property({
    type: 'number',
  })
  sessionId?: number;

  @hasOne(() => SessionItemStatistic)
  sessionItemStatistic: SessionItemStatistic;

  constructor(data?: Partial<SessionItem>) {
    super(data);
  }
}

export interface SessionItemRelations {
  // describe navigational properties here
}

export type SessionItemWithRelations = SessionItem & SessionItemRelations;
