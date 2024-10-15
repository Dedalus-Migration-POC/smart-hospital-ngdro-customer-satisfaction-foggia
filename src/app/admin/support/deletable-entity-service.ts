import {EventEmitter, Injectable, OnInit} from "@angular/core";
import {map, Observable} from "rxjs";
import {DeletableDTO} from "../repository/dto/base_dto";

@Injectable({providedIn: 'root'})
export class DeletableEntityService<T extends DeletableDTO> implements OnInit {
  entityList$!: Observable<Array<T>>;
  datasource$!: Observable<Array<T>>;
  pageSizeOptions$!: Observable<Array<number>>;

  onDelete: EventEmitter<T> = new EventEmitter();
  onRestore: EventEmitter<T> = new EventEmitter();

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
  }

  protected changeShowDeleted(event: any) {
    this.datasource$ = this.entityList$.pipe(map(list => list.filter(entity => event.checked ? true : !entity.deleted)))
  }

  protected changeDeletedStatus(entity: T) {
    if (entity.deleted) this.onRestore.emit(entity)
    else this.onDelete.emit(entity)
  }
}
