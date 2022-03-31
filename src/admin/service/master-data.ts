import {ValueText} from 'onecore';

export interface MasterDataService {
  getStatus(): Promise<ValueText[]>;
  getTitles(): Promise<ValueText[]>;
  getPositions(): Promise<ValueText[]>;
  getGenders(): Promise<ValueText[]>;
}

export class MasterDataClient implements MasterDataService {
  constructor() {
    this.getGenders = this.getGenders.bind(this);
    this.getTitles = this.getTitles.bind(this);
    this.getPositions = this.getPositions.bind(this);
    this.getStatus = this.getStatus.bind(this);
  }
  private status = [
    {
      value: 'A',
      text: 'Active',
    },
    {
      value: 'I',
      text: 'Inactive',
    }
  ];


  private titles = [
    {value: 'Mr', text: 'Mr'},
    {value: 'Mrs', text: 'Mrs'},
    {value: 'Ms', text: 'Ms'},
    {value: 'Dr', text: 'Dr'}
  ];

  private positions = [
    {value: 'E', text: 'Employee'},
    {value: 'M', text: 'Manager'},
    {value: 'D', text: 'Director'}
  ];

  private genders = [
    {value: 'M', text: 'Male'},
    {value: 'F', text: 'Female'}
  ];

  getGenders(): Promise<ValueText[]> {
    return Promise.resolve(this.genders);
  }

  getTitles(): Promise<ValueText[]> {
    return Promise.resolve(this.titles);
  }

  getPositions(): Promise<ValueText[]> {
    return Promise.resolve(this.positions);
  }

  getStatus(): Promise<ValueText[]> {
    return Promise.resolve(this.status);
  }
}
