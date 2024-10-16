import {EventEmitter, Inject, Injectable, OnInit} from "@angular/core";
import {map, Observable} from "rxjs";
import {DeletableDTO} from "../repository/dto/base_dto";
import {WithSubscriptionsComponent} from "./with-subscriptions-component";

@Injectable({providedIn: 'root'})
export class DeletableEntityService<T extends DeletableDTO> extends WithSubscriptionsComponent implements OnInit {
  entityList$!: Observable<Array<T>>;
  datasource$!: Observable<Array<T>>;
  pageSizeOptions$!: Observable<Array<number>>;

  onDelete: EventEmitter<T> = new EventEmitter();
  onRestore: EventEmitter<T> = new EventEmitter();

  showDeleted$: Observable<boolean>;
  toggleShowDeleted: VoidFunction

  constructor(showDeleted$: Observable<boolean>, @Inject("toggleShowDeleted") toggleShowDeleted: VoidFunction) {
    super();
    this.showDeleted$ = showDeleted$;
    this.toggleShowDeleted = toggleShowDeleted;
  }

  ngOnInit() {
    this.datasource$ = this.entityList$.pipe(map(list => list.filter(entity => !entity.deleted)))
    this.pageSizeOptions$ = this.entityList$.pipe(map(list => {
        return Array.from(
          {length: Math.ceil(list.length / 5)},
          (_, i) => {
            const value = (i + 1) * 5;
            return value >= 30 ? Math.ceil(value / 10) * 10 : value;
          }
        ).filter((value, index, self) => self.indexOf(value) === index)
      })
    );
    this.startSubscriptions()
  }

  private startSubscriptions() {
    this.addSubscriptions(
      this.showDeleted$.pipe(
        map(showDeleted => {
          this.datasource$ = this.entityList$.pipe(map(list => list.filter(entity => showDeleted ? true : !entity.deleted)))
        })
      ).subscribe()
    )
  }

  protected changeDeletedStatus(entity: T) {
    if (entity.deleted) this.onRestore.emit(entity)
    else this.onDelete.emit(entity)
  }
}
