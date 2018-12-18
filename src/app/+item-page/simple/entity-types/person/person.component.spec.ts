import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { createRelationshipsObservable, getEntityPageFieldsTest } from '../shared/entity.component.spec';
import { PersonComponent } from './person.component';
import { of as observableOf } from 'rxjs';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [
    {
      key: 'person.identifier.email',
      language: 'en_US',
      value: 'fake@email.com'
    },
    {
      key: 'person.identifier.orcid',
      language: 'en_US',
      value: 'ORCID-1'
    },
    {
      key: 'person.identifier.birthdate',
      language: 'en_US',
      value: '1993'
    },
    {
      key: 'person.identifier.staffid',
      language: 'en_US',
      value: '1'
    },
    {
      key: 'person.identifier.jobtitle',
      language: 'en_US',
      value: 'Developer'
    },
    {
      key: 'person.identifier.lastname',
      language: 'en_US',
      value: 'Doe'
    },
    {
      key: 'person.identifier.firstname',
      language: 'en_US',
      value: 'John'
    }],
  relationships: createRelationshipsObservable()
});

describe('PersonComponent', getEntityPageFieldsTest(mockItem, PersonComponent));
