import { Component, InjectionToken, Injector, Input, OnInit } from '@angular/core';
import { SearchResult } from '../../../+search-page/search-result.model';
import { Item } from '../../../core/shared/item.model';
import { hasValue } from '../../empty.util';
import { ItemSearchResult } from '../../object-collection/shared/item-search-result.model';
import { getComponentByEntityType } from '../entity-type-decorator';
import { ElementViewMode } from '../../view-mode';

export const ITEM: InjectionToken<string> = new InjectionToken<string>('item');

@Component({
  selector: 'ds-entity-type-switcher',
  styleUrls: ['./entity-type-switcher.component.scss'],
  templateUrl: './entity-type-switcher.component.html'
})
/**
 * Component for determining what component to use depending on the item's relationship type (relationship.type)
 */
export class EntityTypeSwitcherComponent implements OnInit {
  /**
   * The item to determine the component for
   */
  @Input() object: Item | SearchResult<Item>;

  /**
   * The preferred view-mode to display
   */
  @Input() viewMode: ElementViewMode;

  /**
   * The object injector used to inject the item into the child component
   */
  objectInjector: Injector;

  constructor(private injector: Injector) {
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [{ provide: ITEM, useFactory: () => this.object, deps:[] }],
      parent: this.injector
    });

  }

  /**
   * Fetch the component depending on the item's relationship type
   * @returns {string}
   */
  getComponent(): string {
    let item: Item;
    if (hasValue((this.object as any).dspaceObject)) {
      const searchResult = this.object as ItemSearchResult;
      item = searchResult.dspaceObject;
    } else {
      item = this.object as Item;
    }

    const type = item.findMetadata('relationship.type');
    return getComponentByEntityType(type, this.viewMode);
  }
}
